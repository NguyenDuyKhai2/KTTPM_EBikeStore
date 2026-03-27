import type { FormEvent, KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { Loader, MessageSquare, Send } from "lucide-react";

type Sender = "bot" | "user";
type ConversationStage = "initial" | "understanding" | "recommending";
type TopicKey = keyof typeof faqDatabase;

type ChatMessage = {
  id: number;
  sender: Sender;
  text: string;
  timestamp: Date;
};

type Recommendation = {
  category: string;
  models: string[];
  reason: string;
};

const faqDatabase = {
  range: "Xe điện của chúng tôi có tầm 50-150km tùy thuộc vào mô hình. Xe Urban Motion: 50-70km, Street Performance: 80-150km, Student Smart: 55-60km.",
  charge: "Thời gian sạc khác nhau: Urban Motion (2-3,5 giờ), Street Performance (3-5 giờ), Student Smart (2,5-3 giờ) tùy thuộc vào dung lượng pin.",
  weight: "Trọng lượng từ 13kg (nhẹ nhất) đến 25kg (mô hình hiệu năng nặng nhất). Urban Motion: 14-17kg, Student Smart: 13-15kg, Street Performance: 20-25kg.",
  price: "Giá: Student Smart ($250-280), Urban Motion ($350-520), Street Performance ($650-899).",
  warranty: "Chúng tôi cung cấp bảo hành sản xuất 2 năm bao gồm các khiếm khuyết động cơ, pin và khung. Các gói hỗ trợ bổ sung có sẵn.",
  delivery: "Vận chuyển miễn phí cho đơn hàng trên $300. Giao hàng tiêu chuẩn: 5-7 ngày làm việc. Giao hàng nhanh có sẵn ở các khu vực được chọn.",
  battery: "Tất cả xe điện của chúng tôi sử dụng pin lithium-ion với BMS thông minh (Hệ thống quản lý pin) để đảm bảo an toàn và tuổi thọ.",
  maintenance: "Bảo dưỡng thường xuyên: kiểm tra áp suất lốp hàng tháng, làm sạch chuỗi và lấy dịch vụ chuyên nghiệp hàng năm.",
  safety: "Các tính năng bao gồm đèn LED, phanh đĩa và vật liệu phản xạ sáng. Mũ bảo hiểm và thiết bị bảo vệ được khuyên dù.",
  returning: "Chính sách hoàn trả 30 ngày với hoàn lại toàn bộ tiền nếu sản phẩm chưa sử dụng và trong điều kiện ban đầu. Phí tái kho sẽ được áp dụng cho trường hợp khác."
};

const questionKeywords: Record<TopicKey, string[]> = {
  range: ["bao xa", "tầm", "km", "khoảng cách", "dặm", "tuổi thọ pin"],
  charge: ["sạc", "thời gian sạc", "bao lâu", "giờ", "pin"],
  weight: ["trọng lượng", "nặng", "kg", "nhẹ", "di động"],
  price: ["giá", "chi phí", "mắc tiền", "rẻ", "giá rẻ"],
  warranty: ["bảo hành", "đảm bảo", "bảo vệ", "bao phủ"],
  delivery: ["giao hàng", "vận chuyển", "giao", "đến", "nhanh"],
  battery: ["pin", "lithium", "bms", "năng lượng"],
  maintenance: ["bảo dưỡng", "chăm sóc", "dịch vụ", "làm sạch", "chăm sóc"],
  safety: ["an toàn", "an toàn", "nón", "đèn", "phanh"],
  returning: ["trả lại", "hoàn tiền", "trao đổi", "thay thế", "quay lại"]
};

const initialMessage: ChatMessage = {
  id: 1,
  sender: "bot",
  text: "Xin chào! Chào mừng bạn đến với Cố vấn thông minh xe điện của chúng tôi. Tôi ở đây để giúp bạn tìm chiếc xe điện hoàn hảo cho nhu cầu của bạn.\n\nHãy cho tôi biết:\n1. Ngân sách của bạn là bao nhiêu?\n2. Trường hợp sử dụng chính của bạn là gì (đi lại, giải trí, v.v.)?\n3. Có tính năng cụ thể nào bạn quan tâm không?",
  timestamp: new Date()
};

const quickQuestions = [
  "Tôi cần một chiếc xe điện để đi lại",
  "Tùy chọn ngân sách sinh viên",
  "Hãy cho tôi biết về tầm",
  "Xe hiệu suất cao"
];

const ChatbotPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationStage, setConversationStage] = useState<ConversationStage>("initial");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const findAnswerInFAQ = (userMessage: string): string | null => {
    const lowerMessage = userMessage.toLowerCase();

    for (const [topic, keywords] of Object.entries(questionKeywords) as [TopicKey, string[]][]) {
      if (keywords.some((keyword) => lowerMessage.includes(keyword))) {
        return faqDatabase[topic];
      }
    }

    return null;
  };

  const generateRecommendation = (userMessage: string): Recommendation | null => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes("budget") || lowerMessage.includes("$")) {
      if (lowerMessage.includes("300") || lowerMessage.includes("cheap") || lowerMessage.includes("affordable")) {
        return {
          category: "Sinh viên thông minh",
          models: ["Campus Rider ($250)", "Student Budget Plus ($280)"],
          reason: "Đây là những tùy chọn giá rẻ nhất của chúng tôi, hoàn hảo cho sinh viên và những người mua hàng có ý thức tiết kiệm."
        };
      }
      if (lowerMessage.includes("500") || lowerMessage.includes("mid")) {
        return {
          category: "Đô thị di động",
          models: ["City Cruiser Lite ($350)", "Urban Commuter Pro ($450)", "eco-Rider 2000 ($520)"],
          reason: "Các tùy chọn tầm trung tuyệt vời với hiệu năng cân bằng và các tính năng cho di chuyển hàng ngày."
        };
      }
      if (lowerMessage.includes("700") || lowerMessage.includes("800") || lowerMessage.includes("high")) {
        return {
          category: "Hiệu suất đường phố",
          models: ["Performance Max ($650)", "Street Beast 3000 ($750)", "Extended Range Pro ($899)"],
          reason: "Các mô hình hiệu năng cao cấp với động cơ mạnh mẽ và tầm mở rộng."
        };
      }
    }

    if (lowerMessage.includes("commute") || lowerMessage.includes("office") || lowerMessage.includes("work")) {
      return {
        category: "Đô thị di động",
        models: ["Urban Commuter Pro", "City Cruiser Lite"],
        reason: "Những chiếc xe này được tối ưu hóa để đi lại trong thành phố với xử lý nhanh nhẹn và tầm thực tế."
      };
    }

    if (lowerMessage.includes("student") || lowerMessage.includes("campus") || lowerMessage.includes("college")) {
      return {
        category: "Sinh viên thông minh",
        models: ["Campus Rider", "Student Budget Plus"],
        reason: "Nhẹ nhàng và giá rẻ, hoàn hảo cho cuộc sống trong khuôn viên và ngân sách sinh viên."
      };
    }

    if (lowerMessage.includes("performance") || lowerMessage.includes("fast") || lowerMessage.includes("speed")) {
      return {
        category: "Hiệu suất đường phố",
        models: ["Street Beast 3000", "Performance Max"],
        reason: "Các mô hình hiệu năng cao với động cơ mạnh mẽ cho những ai yêu thích cảm giác mạnh."
      };
    }

    return null;
  };

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const submittedInput = input.trim();
    const userMessage: ChatMessage = {
      id: messages.length + 1,
      sender: "user",
      text: submittedInput,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    let botResponse = "";
    const faqAnswer = findAnswerInFAQ(submittedInput);

    if (faqAnswer) {
      botResponse = faqAnswer;
    } else {
      const recommendation = generateRecommendation(submittedInput);
      if (recommendation) {
        botResponse = `Lựa chọn tuyệt vời! Dựa trên những gì bạn đang tìm kiếm, tôi khuyên bạn nên sử dụng bộ sưu tập **${recommendation.category}** của chúng tôi.\n\nMô hình được đề xuất:\n${recommendation.models.map((model) => `- ${model}`).join("\n")}\n\nTại sao: ${recommendation.reason}\n\nBạn có muốn biết thêm chi tiết về bất kỳ mô hình cụ thể nào không?`;
        setConversationStage("recommending");
      } else {
        const genericResponses = [
          "Đó là thông tin tuyệt vời! Để giúp bạn tốt hơn, bạn có thể cho tôi biết thêm về khoảng ngân sách, cách bạn dự định sử dụng xe điện và các tính năng cụ thể bạn cần không?",
          "Tôi hiểu. Tôi sẽ giúp bạn tìm ra những kết quả hoàn hảo. Bạn có đi lại hàng ngày hay sử dụng nó để giải trí, khoảng giá cả của bạn là bao nhiêu, và bạn thường đi xa bao nhiêu?",
          "Cảm ơn bạn đã chia sẻ! Hầu hết khách hàng trong tình huống của bạn thích sự cân bằng tốt giữa giá cả và hiệu năng, phạm vi đáng tin cậy cho sử dụng hàng ngày và bảo dưỡng dễ dàng. Cái gì quan trọng nhất với bạn?"
        ];
        botResponse = genericResponses[Math.floor(Math.random() * genericResponses.length)];
        setConversationStage("understanding");
      }
    }

    const botMessage: ChatMessage = {
      id: messages.length + 2,
      sender: "bot",
      text: botResponse,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, botMessage]);
    setIsLoading(false);
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      return;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <div className="bg-slate-800/50 border-b border-slate-700 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Cố vấn thông minh</h1>
              <p className="text-sm text-slate-400">Khuyến nghị xe điện được cung cấp bởi AI</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-md px-6 py-4 rounded-2xl ${
                    message.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-slate-700 text-slate-100 rounded-bl-none"
                  } shadow-lg`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                  <span className="text-xs opacity-70 mt-2 block">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-700 text-slate-100 px-6 py-4 rounded-2xl rounded-bl-none shadow-lg">
                  <div className="flex items-center gap-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Đang suy nghĩ...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 border-t border-slate-700 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {conversationStage === "initial" && (
            <div className="mb-6">
              <p className="text-xs text-slate-400 uppercase font-semibold mb-3">Các câu hỏi nhanh:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                {quickQuestions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => handleQuickQuestion(question)}
                    className="text-left px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-600 text-slate-300 hover:text-white text-sm transition duration-200"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSendMessage} className="flex gap-4">
            <input
              type="text"
              placeholder="Nhập câu hỏi hoặc sở thích của bạn..."
              className="flex-1 px-6 py-3 bg-slate-700 border border-slate-600 rounded-full text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleInputKeyDown}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-full font-semibold transition duration-200"
            >
              <Send className="w-5 h-5" />
              <span className="hidden sm:inline">Gửi</span>
            </button>
          </form>

          <p className="text-xs text-slate-500 mt-4 text-center">
            Hỏi tôi về thông số kỹ thuật, khuyến nghị, giá cả, giao hàng hoặc bất kỳ thứ gì khác về xe điện của chúng tôi.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
