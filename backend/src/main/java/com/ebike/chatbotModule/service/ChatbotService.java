package com.ebike.chatbotModule.service;

import com.ebike.chatbotModule.dto.request.ChatbotAskRequest;
import com.ebike.chatbotModule.dto.response.ChatbotDebugResponse;
import com.ebike.chatbotModule.dto.response.ChatbotRecommendationDto;
import com.ebike.chatbotModule.dto.response.ChatbotResponse;
import com.ebike.orderModule.entity.Showroom;
import com.ebike.orderModule.repository.ShowroomRepository;
import com.ebike.productModule.entity.Product;
import com.ebike.productModule.entity.ProductSpecification;
import com.ebike.productModule.repository.ProductRepository;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional(readOnly = true)
public class ChatbotService {

    private static final BigDecimal REGISTRATION_FEE_AMOUNT = new BigDecimal("2500000");
    private static final BigDecimal SHOWROOM_INCENTIVE_AMOUNT = new BigDecimal("1200000");

    private final ProductRepository productRepository;
    private final ShowroomRepository showroomRepository;
    private final GeminiChatClient geminiChatClient;
    private final PdfKnowledgeBaseService pdfKnowledgeBaseService;
    private final List<FaqEntry> faqEntries = new ArrayList<>();
    private final Map<String, List<ChatbotRecommendationDto>> recentRecommendationsByChatId = new ConcurrentHashMap<>();

    public ChatbotService(
        ProductRepository productRepository,
        ShowroomRepository showroomRepository,
        GeminiChatClient geminiChatClient,
        PdfKnowledgeBaseService pdfKnowledgeBaseService
    ) {
        this.productRepository = productRepository;
        this.showroomRepository = showroomRepository;
        this.geminiChatClient = geminiChatClient;
        this.pdfKnowledgeBaseService = pdfKnowledgeBaseService;
        loadFaqEntries();
    }

    public ChatbotResponse ask(ChatbotAskRequest request) {
        ChatbotAnalysis analysis = analyze(request);
        String aiAnswer = sanitizeAiAnswer(geminiChatClient.generateAnswer(buildAiPrompt(analysis)));
        if (isUsableAiAnswer(aiAnswer)) {
            return new ChatbotResponse(aiAnswer, "ai_rag_light", analysis.recommendations());
        }

        if (analysis.pdfKnowledgeContext().hasSnippets()) {
            return buildPdfFallbackResponse(analysis);
        }

        return analysis.ruleBasedResponse();
    }

    public ChatbotDebugResponse debug(ChatbotAskRequest request) {
        ChatbotAnalysis analysis = analyze(request);
        return new ChatbotDebugResponse(
            analysis.userMessage(),
            analysis.normalizedMessage(),
            analysis.faqMatch() == null ? null : analysis.faqMatch().question(),
            analysis.faqMatch() == null ? null : analysis.faqMatch().category(),
            analysis.ruleBasedResponse().matchedIntent(),
            geminiChatClient.isConfigured(),
            analysis.showroomContext(),
            analysis.orderPaymentContext(),
            analysis.pdfKnowledgeContext().combinedContext(),
            analysis.pdfKnowledgeContext().sourceLabels(),
            analysis.ruleBasedResponse().answer(),
            analysis.recommendations()
        );
    }

    private ChatbotAnalysis analyze(ChatbotAskRequest request) {
        String userMessage = request == null ? null : request.effectiveMessage();
        if (userMessage == null || userMessage.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "message is required");
        }

        String chatId = normalizeChatId(request.chatId());
        String normalizedMessage = userMessage.trim().toLowerCase(Locale.ROOT);
        FaqEntry faqMatch = faqEntries.stream()
            .filter(entry -> entry.matches(normalizedMessage))
            .max(Comparator.comparingInt(FaqEntry::priorityScore))
            .orElse(null);
        List<ChatbotRecommendationDto> recommendations = findProductRecommendations(normalizedMessage);
        if (recommendations.isEmpty() && isFollowUpPriceQuestion(normalizedMessage)) {
            recommendations = recentRecommendationsByChatId.getOrDefault(chatId, List.of());
        }
        String showroomContext = buildShowroomContext(normalizedMessage);
        String orderPaymentContext = buildOrderPaymentContext(normalizedMessage);
        PdfKnowledgeBaseService.PdfKnowledgeContext pdfKnowledgeContext = pdfKnowledgeBaseService.findRelevantContext(userMessage);
        ChatbotResponse ruleBasedResponse = buildRuleBasedResponse(
            faqMatch,
            recommendations,
            showroomContext,
            orderPaymentContext,
            isFollowUpPriceQuestion(normalizedMessage)
        );

        if (!recommendations.isEmpty()) {
            recentRecommendationsByChatId.put(chatId, recommendations);
        }

        return new ChatbotAnalysis(
            chatId,
            userMessage.trim(),
            normalizedMessage,
            faqMatch,
            recommendations,
            showroomContext,
            orderPaymentContext,
            pdfKnowledgeContext,
            ruleBasedResponse
        );
    }

    private ChatbotResponse buildRuleBasedResponse(
        FaqEntry faqMatch,
        List<ChatbotRecommendationDto> recommendations,
        String showroomContext,
        String orderPaymentContext,
        boolean priceQuestion
    ) {
        if (faqMatch != null && !recommendations.isEmpty()) {
            return new ChatbotResponse(
                faqMatch.answer() + " Dựa trên câu hỏi của bạn, đây là vài mẫu xe phù hợp để tham khảo.",
                "faq+product_recommendation",
                recommendations
            );
        }

        if (faqMatch != null) {
            return new ChatbotResponse(faqMatch.answer(), "faq", List.of());
        }

        if (!showroomContext.isBlank()) {
            return new ChatbotResponse(
                "Đây là thông tin showroom hiện có:\n" + showroomContext,
                "showroom_context",
                List.of()
            );
        }

        if (!orderPaymentContext.isBlank()) {
            return new ChatbotResponse(orderPaymentContext, "order_payment_context", List.of());
        }

        if (!recommendations.isEmpty()) {
            return new ChatbotResponse(
                buildRecommendationAnswer(recommendations),
                "product_recommendation",
                recommendations
            );
        }

        if (priceQuestion) {
            return new ChatbotResponse(
                "Mình chưa xác định được bạn muốn xem giá của mẫu xe nào. Bạn có thể nhập tên mẫu xe hoặc hỏi lại sau khi mình gợi ý một vài mẫu phù hợp.",
                "price_followup_missing_context",
                List.of()
            );
        }

        return new ChatbotResponse(
            "Mình có thể tư vấn mẫu xe điện phù hợp, tầm giá, pin, quãng đường, tốc độ, bảo hành, showroom nhận xe và thanh toán. Bạn có thể nói rõ nhu cầu như: đi học, đi làm hằng ngày, muốn xe giá tốt, đi xa hoặc ưu tiên tốc độ.",
            "fallback",
            List.of()
        );
    }

    private String buildRecommendationAnswer(List<ChatbotRecommendationDto> recommendations) {
        StringBuilder answer = new StringBuilder("Hiện mình tìm thấy một vài mẫu xe phù hợp với câu hỏi của bạn:");
        for (ChatbotRecommendationDto recommendation : recommendations) {
            answer.append("\n- ")
                .append(recommendation.name())
                .append(" giá khoảng ")
                .append(formatCurrency(recommendation.price()))
                .append(": ")
                .append(recommendation.reason());
        }
        answer.append("\nBạn muốn mình lọc tiếp theo ngân sách, quãng đường đi mỗi ngày hay kiểu dáng xe không?");
        return answer.toString();
    }

    private String buildGeminiPrompt(ChatbotAnalysis analysis) {
        StringBuilder context = new StringBuilder();
        if (analysis.faqMatch() != null) {
            context.append("FAQ liên quan:\n")
                .append("- Câu hỏi: ").append(analysis.faqMatch().question()).append('\n')
                .append("- Trả lời: ").append(analysis.faqMatch().answer()).append("\n\n");
        }
        if (!analysis.recommendations().isEmpty()) {
            context.append("Sản phẩm gợi ý từ database:\n");
            for (ChatbotRecommendationDto recommendation : analysis.recommendations()) {
                context.append("- ")
                    .append(recommendation.name())
                    .append(" | Gia: ")
                    .append(recommendation.price())
                    .append(" VND | Lý do: ")
                    .append(recommendation.reason())
                    .append('\n');
            }
            context.append('\n');
        }
        if (!analysis.showroomContext().isBlank()) {
            context.append("Showroom đang hoạt động:\n").append(analysis.showroomContext()).append("\n\n");
        }
        if (!analysis.orderPaymentContext().isBlank()) {
            context.append("Thông tin đặt hàng và thanh toán:\n").append(analysis.orderPaymentContext()).append("\n\n");
        }
        context.append("Câu trả lời fallback nếu thiếu dữ liệu: ").append(analysis.ruleBasedResponse().answer());

        return """
            Bạn là trợ lý tư vấn xe điện của Kinetic E-Bike.
            Hãy luôn trả lời bằng tiếng Việt có dấu, tự nhiên, thân thiện, ngắn gọn và đúng vai trò tư vấn bán hàng.
            Chỉ dựa trên CONTEXT được cung cấp. Nếu không đủ thông tin, hãy nói rõ và gợi ý khách xem sản phẩm hoặc liên hệ showroom.
            Không bịa đặt thông số, giá, khuyến mãi hoặc chính sách ngoài context.

            CONTEXT:
            %s

            CÂU HỎI KHÁCH HÀNG:
            %s
            """.formatted(context, analysis.userMessage());
    }

    private List<ChatbotRecommendationDto> findProductRecommendations(String message) {
        if (isCatalogQuestion(message)) {
            return productRepository.findAll().stream()
                .filter(product -> Boolean.TRUE.equals(product.getActive()))
                .sorted(Comparator
                    .comparing((Product product) -> product.getFeatured() != null && product.getFeatured()).reversed()
                    .thenComparing(Product::getPrice, Comparator.nullsLast(Comparator.naturalOrder())))
                .limit(5)
                .map(product -> new ChatbotRecommendationDto(
                    product.getId(),
                    product.getName(),
                    product.getSlug(),
                    product.getPrice(),
                    describeProduct(product)
                ))
                .toList();
        }

        return productRepository.findAll().stream()
            .filter(product -> Boolean.TRUE.equals(product.getActive()))
            .map(product -> scoreProduct(product, message))
            .filter(scoredProduct -> scoredProduct.score() > 0)
            .sorted(Comparator.comparingInt(ScoredProduct::score).reversed())
            .limit(3)
            .map(scoredProduct -> new ChatbotRecommendationDto(
                scoredProduct.product().getId(),
                scoredProduct.product().getName(),
                scoredProduct.product().getSlug(),
                scoredProduct.product().getPrice(),
                scoredProduct.reason()
            ))
            .toList();
    }

    private ScoredProduct scoreProduct(Product product, String message) {
        int score = 0;
        List<String> reasons = new ArrayList<>();
        ProductSpecification specification = product.getSpecification();

        if (containsAny(message, "cheap", "budget", "student", "gia re", "giá rẻ", "duoi 20", "dưới 20", "under 20", "sinh viên")) {
            BigDecimal threshold = BigDecimal.valueOf(20_000_000L);
            if (product.getPrice() != null && product.getPrice().compareTo(threshold) <= 0) {
                score += 3;
                reasons.add("phù hợp nhu cầu giá tốt");
            }
        }

        if (containsAny(message, "fast", "speed", "toc do", "tốc độ", "nhanh") && specification != null && specification.getMaxSpeedKmh() != null) {
            if (specification.getMaxSpeedKmh().compareTo(BigDecimal.valueOf(50)) >= 0) {
                score += 3;
                reasons.add("có tốc độ tối đa tốt");
            }
        }

        if (containsAny(message, "far", "range", "quang duong", "quãng đường", "di xa", "đi xa", "long distance") && specification != null
            && specification.getMaxRangeKm() != null) {
            if (specification.getMaxRangeKm().compareTo(BigDecimal.valueOf(70)) >= 0) {
                score += 3;
                reasons.add("hỗ trợ quãng đường di chuyển dài");
            }
        }

        if (containsAny(message, "battery", "pin") && specification != null && specification.getBatteryType() != null) {
            score += 1;
            reasons.add("phù hợp câu hỏi về pin");
        }

        if (containsAny(message, "scooter", "xe tay ga", "xe ga", "e_scooter")
            && specification != null && specification.getVehicleType() != null
            && specification.getVehicleType().name().contains("SCOOTER")) {
            score += 2;
            reasons.add("thuộc nhóm xe tay ga điện");
        }

        if (containsAny(message, "bike", "xe dap", "xe đạp", "xe đạp điện", "ebike")
            && specification != null && specification.getVehicleType() != null
            && specification.getVehicleType().name().contains("BIKE")) {
            score += 2;
            reasons.add("thuộc nhóm xe đạp điện");
        }

        String productName = product.getName() == null ? "" : product.getName().toLowerCase(Locale.ROOT);
        String productSlug = product.getSlug() == null ? "" : product.getSlug().toLowerCase(Locale.ROOT);
        if (score == 0 && containsAny(message, productName, productSlug)) {
            score = 1;
            reasons.add("khớp với tên sản phẩm bạn nhắc đến");
        }

        String reason = reasons.isEmpty() ? "phù hợp nhu cầu bạn mô tả" : String.join(", ", reasons);
        return new ScoredProduct(product, score, reason);
    }

    private boolean isCatalogQuestion(String message) {
        return containsAny(message, "sản phẩm", "san pham", "mẫu nào", "mau nao", "có xe", "co xe", "đang có", "dang co", "bán xe", "ban xe")
            || containsAny(message, "xe đạp điện nào", "xe dap dien nao", "xe điện nào", "xe dien nao");
    }

    private boolean isFollowUpPriceQuestion(String message) {
        return containsAny(message, "giá", "gia", "bao nhiêu", "bao nhieu", "giá tiền", "gia tien", "tầm giá", "tam gia")
            && containsAny(
                message,
                "các dòng xe đó",
                "cac dong xe do",
                "dòng xe đó",
                "dong xe do",
                "mẫu đó",
                "mau do",
                "mấy mẫu",
                "may mau",
                "mẫu trên",
                "mau tren",
                "những mẫu",
                "nhung mau",
                "xe đó",
                "xe do"
            );
    }

    private String normalizeChatId(String chatId) {
        return chatId == null || chatId.isBlank() ? "default" : chatId.trim();
    }

    private String buildShowroomContext(String message) {
        if (!isShowroomQuestion(message)) {
            return "";
        }

        List<Showroom> showrooms = showroomRepository.findByActiveTrueOrderByDistrictAscNameAsc();
        if (showrooms.isEmpty()) {
            return "Hiện chưa có showroom hoạt động trong dữ liệu hệ thống.";
        }

        return showrooms.stream()
            .limit(8)
            .map(showroom -> "- " + showroom.getName()
                + " | " + showroom.getDistrict()
                + " | " + showroom.getAddress()
                + (showroom.getPhone() == null || showroom.getPhone().isBlank() ? "" : " | " + showroom.getPhone())
                + (showroom.getOpeningHours() == null || showroom.getOpeningHours().isBlank() ? "" : " | " + showroom.getOpeningHours()))
            .toList()
            .stream()
            .reduce((left, right) -> left + "\n" + right)
            .orElse("");
    }

    private boolean isShowroomQuestion(String message) {
        return containsAny(
            message,
            "showroom",
            "cửa hàng",
            "cua hang",
            "địa chỉ",
            "dia chi",
            "nhận xe",
            "nhan xe",
            "ở đâu",
            "o dau",
            "quận",
            "quan"
        );
    }

    private String buildOrderPaymentContext(String message) {
        if (!isOrderPaymentQuestion(message)) {
            return "";
        }

        return """
            Quy trình đặt hàng: khách hàng đăng nhập rồi nhập họ tên số điện thoại email, xác thực OTP email, chọn showroom nhận xe, địa chỉ cụ thể và ghi chú nếu có. Hệ thống không yêu cầu CCCD khi đặt hàng.
            Nhận xe: hệ thống hiện ưu tiên nhận xe tại showroom đã chọn trong TP.HCM.
            Báo giá checkout: phí đăng ký %s và ưu đãi showroom %s.
            Thanh toán: hỗ trợ lưu phương thức thanh toán theo đơn và có luồng VNPay. Khi thanh toán VNPay thành công hệ thống cập nhật payment PAID và đơn hàng CONFIRMED.
            VNPay IPN: backend nhận callback tại /api/v1/payments/vnpay/ipn. Return URL dùng để hiển thị kết quả cho khách hàng.
            """.formatted(formatCurrency(REGISTRATION_FEE_AMOUNT), formatCurrency(SHOWROOM_INCENTIVE_AMOUNT)).trim();
    }

    private boolean isOrderPaymentQuestion(String message) {
        return containsAny(
            message,
            "đặt hàng",
            "dat hang",
            "checkout",
            "thanh toán",
            "thanh toan",
            "vnpay",
            "phí đăng ký",
            "phi dang ky",
            "ưu đãi",
            "uu dai",
            "tổng thanh toán",
            "tong thanh toan",
            "otp",
            "giao dịch",
            "giao dich"
        );
    }

    private String describeProduct(Product product) {
        ProductSpecification specification = product.getSpecification();
        List<String> details = new ArrayList<>();
        if (product.getCategory() != null && product.getCategory().getName() != null) {
            details.add("danh mục " + product.getCategory().getName());
        }
        if (specification != null && specification.getVehicleType() != null) {
            details.add("loại " + specification.getVehicleType().name());
        }
        if (specification != null && specification.getMaxRangeKm() != null) {
            details.add("quãng đường tối đa khoảng " + specification.getMaxRangeKm().stripTrailingZeros().toPlainString() + " km");
        }
        if (specification != null && specification.getMaxSpeedKmh() != null) {
            details.add("tốc độ tối đa khoảng " + specification.getMaxSpeedKmh().stripTrailingZeros().toPlainString() + " km/h");
        }
        return details.isEmpty() ? "đang được bán trên hệ thống" : String.join(", ", details);
    }

    private String formatCurrency(BigDecimal amount) {
        return amount == null ? "đang cập nhật" : String.format("%,.0f VND", amount);
    }

    private String buildAiPrompt(ChatbotAnalysis analysis) {
        StringBuilder context = new StringBuilder();
        appendContextSection(
            context,
            "FAQ lien quan",
            analysis.faqMatch() == null
                ? ""
                : "- Cau hoi: " + analysis.faqMatch().question() + "\n- Tra loi: " + analysis.faqMatch().answer()
        );

        if (!analysis.recommendations().isEmpty()) {
            StringBuilder recommendations = new StringBuilder();
            for (ChatbotRecommendationDto recommendation : analysis.recommendations()) {
                recommendations.append("- ")
                    .append(recommendation.name())
                    .append(" | Gia: ")
                    .append(recommendation.price())
                    .append(" VND | Ly do: ")
                    .append(recommendation.reason())
                    .append('\n');
            }
            appendContextSection(context, "San pham goi y tu database", recommendations.toString().trim());
        }

        appendContextSection(context, "Showroom dang hoat dong", analysis.showroomContext());
        appendContextSection(context, "Thong tin dat hang va thanh toan", analysis.orderPaymentContext());
        appendContextSection(context, "Tai lieu PDF lien quan", analysis.pdfKnowledgeContext().combinedContext());
        appendContextSection(context, "Cau tra loi fallback neu thieu du lieu", analysis.ruleBasedResponse().answer());

        return """
            Ban la tro ly tu van xe dien cua Kinetic E-Bike.
            Nhiem vu cua ban la tra loi bang tieng Viet ro rang, day du, than thien va dung thong tin trong CONTEXT.
            Yeu cau bat buoc:
            - Khong dung markdown nhu **, ##, hoac tieu de dang dang.
            - Tra loi thanh 1 doan ngan hoac 3-5 bullet ro rang.
            - Neu cau hoi ve chinh sach, quy trinh, bao hanh, doi tra, sac pin: hay tom tat y chinh that cu the.
            - Neu thong tin trong tai lieu co dieu kien ap dung, phai neu ro dieu kien.
            - Neu CONTEXT chua du, hay noi ro phan chua chac va huong dan khach lien he showroom.
            - Khong bia dat thong so, gia, khuyen mai hoac chinh sach ngoai CONTEXT.

            CONTEXT:
            %s

            CAU HOI KHACH HANG:
            %s
            """.formatted(context.toString().trim(), analysis.userMessage());
    }

    private void appendContextSection(StringBuilder context, String title, String content) {
        if (content == null || content.isBlank()) {
            return;
        }
        if (!context.isEmpty()) {
            context.append("\n\n");
        }
        context.append(title).append(":\n").append(content.trim());
    }

    private ChatbotResponse buildPdfFallbackResponse(ChatbotAnalysis analysis) {
        StringBuilder answer = new StringBuilder("Minh da tim thay thong tin lien quan trong tai lieu noi bo cua Kinetic:\n");
        for (PdfKnowledgeBaseService.KnowledgeSnippet snippet : analysis.pdfKnowledgeContext().snippets().stream().limit(2).toList()) {
            answer.append("\n- Tham khao ")
                .append(snippet.sourceName())
                .append(" (trang ")
                .append(snippet.pageNumber())
                .append(").");
        }
        answer.append("\n\nBan hay hoi cu the hon, vi du: \"pin duoc bao hanh bao lau\", \"truong hop nao khong duoc bao hanh\", hoac \"dieu kien doi tra la gi\" de minh tra loi dung muc hon.");
        return new ChatbotResponse(answer.toString(), "pdf_knowledge", analysis.recommendations());
    }

    private String sanitizeAiAnswer(String text) {
        if (text == null) {
            return null;
        }
        String sanitized = text
            .replace("\r", "")
            .replace("**", "")
            .replaceAll("[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F]", "")
            .replaceAll("\\n{3,}", "\n\n")
            .trim();

        if (sanitized.endsWith(":") || sanitized.endsWith("-")) {
            sanitized = sanitized.substring(0, sanitized.length() - 1).trim();
        }
        return sanitized;
    }

    private boolean isUsableAiAnswer(String text) {
        if (text == null || text.isBlank()) {
            return false;
        }
        if (text.length() < 40) {
            return false;
        }
        String normalized = text.toLowerCase(Locale.ROOT);
        return !normalized.matches(".*\\b(ve|muc|phan|chinh sach|bao hanh)\\b\\s*$");
    }

    private record ChatbotAnalysis(
        String chatId,
        String userMessage,
        String normalizedMessage,
        FaqEntry faqMatch,
        List<ChatbotRecommendationDto> recommendations,
        String showroomContext,
        String orderPaymentContext,
        PdfKnowledgeBaseService.PdfKnowledgeContext pdfKnowledgeContext,
        ChatbotResponse ruleBasedResponse
    ) {
    }

    private boolean containsAny(String text, String... keywords) {
        for (String keyword : keywords) {
            if (text.contains(keyword.toLowerCase(Locale.ROOT))) {
                return true;
            }
        }
        return false;
    }

    private void loadFaqEntries() {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(
            new ClassPathResource("faq-data/faq.csv").getInputStream(),
            StandardCharsets.UTF_8
        ))) {
            reader.readLine();
            String line;
            while ((line = reader.readLine()) != null) {
                if (line.isBlank() || line.equals("...")) {
                    continue;
                }
                String[] parts = line.split(",", 6);
                if (parts.length < 6) {
                    continue;
                }
                faqEntries.add(new FaqEntry(
                    parts[1].trim(),
                    parts[2].trim(),
                    parts[3].trim(),
                    parts[4].trim(),
                    parts[5].trim()
                ));
            }
        } catch (IOException exception) {
            throw new IllegalStateException("Unable to load FAQ data", exception);
        }
    }

    private record FaqEntry(
        String category,
        String question,
        String answer,
        String keywords,
        String priority
    ) {
        boolean matches(String message) {
            String normalizedQuestion = question.toLowerCase(Locale.ROOT);
            if (message.contains(normalizedQuestion)) {
                return true;
            }
            for (String keyword : keywords.toLowerCase(Locale.ROOT).split(" ")) {
                if (!keyword.isBlank() && message.contains(keyword)) {
                    return true;
                }
            }
            return false;
        }

        int priorityScore() {
            return switch (priority.toLowerCase(Locale.ROOT)) {
                case "high" -> 3;
                case "medium" -> 2;
                default -> 1;
            };
        }
    }

    private record ScoredProduct(Product product, int score, String reason) {
    }
}
