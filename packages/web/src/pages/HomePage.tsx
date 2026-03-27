import { BatteryCharging, ChevronRight, MessageSquare, ShieldCheck, Sparkles, Zap, TrendingUp, Users } from "lucide-react";
import { NavLink } from "react-router-dom";

const heroHighlights = [
  { value: "120 km", label: "Tầm đường tối đa" },
  { value: "3.5 h", label: "Sạc nhanh thông minh" },
  { value: "36", label: "Điểm bảo hành liên kết" }
];

const newProducts = [
  {
    title: "YADEA OSTA",
    subtitle: "Thanh lịch, nhẹ nhàng, hợp gu đi chuyển trong phố.",
    tone:
      "bg-[linear-gradient(180deg,rgba(205,220,235,0.18),rgba(205,220,235,0.18)),linear-gradient(180deg,#a5b1ba_0%,#cfd9e5_36%,#e6d7b8_100%)]"
  },
  {
    title: "YADEA VELAX SOOBIN",
    subtitle: "Ngoài hình nổi bật cho người thích phong cách hiện đại.",
    tone:
      "bg-[linear-gradient(180deg,rgba(51,137,173,0.08),rgba(244,188,124,0.22)),linear-gradient(135deg,#5f2d23_0%,#6c3f2c_18%,#91c6d9_52%,#f4e0be_100%)]"
  }
];

const supportFeatures = [
  {
    icon: <BatteryCharging size={22} />,
    title: "Pin bền bỉ cho lịch trình dài",
    description: "Hệ thống quản lý pin tối ưu cho di chuyển hàng ngày và tiết kiệm năng lượng."
  },
  {
    icon: <ShieldCheck size={22} />,
    title: "Bảo hành và hỗ trợ rõ ràng",
    description: "Thông tin chính sách, bảo dưỡng và hướng dẫn sử dụng được sắp xếp gọn gàng."
  },
  {
    icon: <MessageSquare size={22} />,
    title: "Tư vấn sản phẩm nhanh hơn",
    description: "Kết hợp chatbot và giao diện sản phẩm để người dùng ra quyết định dễ dàng."
  }
];

const whyChooseUs = [
  {
    icon: <Zap size={24} />,
    title: "Công nghệ tiên tiến",
    description: "Động cơ đạo động mạnh mẽ, bộ pin lithium-ion chất lượng cao"
  },
  {
    icon: <TrendingUp size={24} />,
    title: "Giá cạnh tranh",
    description: "Chất lượng cao nhưng giá bán phải chăng cho mọi đối tượng"
  },
  {
    icon: <Users size={24} />,
    title: "Cộng đồng sử dụng lớn",
    description: "Hơn 50,000 khách hàng hài lòng trên toàn quốc"
  }
];

const HomePage = () => (
  <div className="flex flex-col bg-[#f4f4f2]">
    {/* Hero Section */}
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#e5ddcf_0%,#efe7d8_18%,#f5f4ef_55%,#f5f5f3_100%)] px-4 pb-14 pt-9 sm:px-6 lg:px-14">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),transparent_28%),radial-gradient(circle_at_18%_22%,rgba(255,255,255,0.7),transparent_22%),radial-gradient(circle_at_82%_20%,rgba(255,255,255,0.48),transparent_20%)]" />
      <div className="relative z-[1] grid min-h-[620px] grid-cols-1 items-end gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(320px,620px)]">
        <div className="flex max-w-[680px] flex-col gap-[22px] pt-12">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/70 px-3.5 py-2 text-[0.8rem] font-bold uppercase tracking-[0.12em] text-[#b44c00]">
            <Sparkles size={14} />
            Xe Điện Việt Nam
          </span>
          <h1 className="max-w-[10ch] [font-family:Bahnschrift,'Arial_Narrow',sans-serif] text-[clamp(3.2rem,7vw,6.6rem)] font-extrabold leading-[0.92] text-[#111] max-lg:max-w-none animate-slideInUp">
            Giải pháp di chuyển thân thiện môi trường
          </h1>
          <p className="m-0 text-[1.02rem] leading-[1.7] text-[#595959] animate-slideInUp animation-delay-200">
            Khám phá những chiếc xe điện YADEA chất lượng cao với công nghệ tiên tiến, giá cạnh tranh và dịch vụ bảo hành toàn diện trên toàn quốc.
          </p>

          <div className="flex flex-wrap gap-3.5">
            <NavLink
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#ff7a00_0%,#de4d00_100%)] px-[18px] font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
              to="/products"
            >
              Xem sản phẩm
            </NavLink>
            <NavLink
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[rgba(17,17,17,0.08)] bg-white/80 px-[18px] font-bold text-[#202020] transition hover:-translate-y-0.5 hover:bg-white"
              to="/chatbot"
            >
              Tư vấn ngay
            </NavLink>
          </div>

          <div className="grid grid-cols-1 gap-3.5 md:grid-cols-3">
            {heroHighlights.map((item) => (
              <div key={item.label} className="rounded-[20px] bg-black/5 p-4 hover:bg-black/10 transition">
                <strong className="mb-1.5 block text-[1.35rem] font-bold text-[#111]">{item.value}</strong>
                <span className="text-[#6a6a6a]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-end justify-center animate-slideInRight" aria-hidden="true">
          <div className="relative min-h-[380px] w-full overflow-hidden rounded-[32px] bg-[linear-gradient(180deg,rgba(255,255,255,0.52),rgba(255,255,255,0.08)),linear-gradient(160deg,#d8cfbf_0%,#cebda3_42%,#b19167_100%)] sm:min-h-[540px] shadow-lg">
            <div className="absolute right-[66px] top-[54px] h-[180px] w-[180px] rounded-full bg-[radial-gradient(circle,rgba(255,244,214,0.92),rgba(255,244,214,0)_72%)]" />
            <div className="absolute inset-x-[-10%] bottom-0 h-[150px] bg-[linear-gradient(180deg,rgba(121,91,48,0),rgba(121,91,48,0.25)_24%,rgba(104,77,39,0.6)_100%)]" />
            <div className="absolute bottom-[72px] left-1/2 h-[52px] w-[300px] -translate-x-1/2 rounded-full bg-[rgba(38,27,10,0.22)] blur-[12px]" />
            <div className="absolute bottom-[86px] left-1/2 h-[180px] w-[300px] -translate-x-1/2 sm:h-[250px] sm:w-[420px]">
              <span className="absolute bottom-0 left-[34px] h-[110px] w-[110px] rounded-full border-[9px] border-[#292929] bg-[radial-gradient(circle,#d6d6d6_0_18%,#4f4f4f_19%_24%,transparent_25%),radial-gradient(circle,transparent_0_48%,#141414_49%_100%)]" />
              <span className="absolute bottom-0 right-[28px] h-[110px] w-[110px] rounded-full border-[9px] border-[#292929] bg-[radial-gradient(circle,#d6d6d6_0_18%,#4f4f4f_19%_24%,transparent_25%),radial-gradient(circle,transparent_0_48%,#141414_49%_100%)]" />
              <span className="absolute bottom-[54px] left-[90px] right-[104px] h-[108px] rounded-[60px_78px_44px_34px] bg-[linear-gradient(135deg,#f8f0dd_0%,#eee1c5_40%,#c7b08d_100%)] shadow-[inset_0_-16px_22px_rgba(98,75,39,0.18)]" />
              <span className="absolute left-[170px] top-[40px] h-6 w-28 rotate-[-3deg] rounded-full bg-[#5c4630]" />
              <span className="absolute right-[86px] top-[26px] h-[148px] w-[84px] skew-x-[-10deg] rounded-[40px] bg-[linear-gradient(180deg,#f8f0dd_0%,#efe1c4_58%,#cfb28b_100%)]" />
            </div>
            <div className="absolute bottom-5 right-6 text-[0.9rem] uppercase tracking-[0.08em] text-black/60">
              Hình minh họa sản phẩm
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Featured Products Section */}
    <section className="bg-[#f4f4f2] px-4 pb-[92px] pt-[76px] sm:px-6 lg:px-14" id="experience">
      <div className="mx-auto mb-[42px] flex max-w-[920px] flex-col items-center gap-3 text-center">
        <span className="inline-block text-[0.74rem] uppercase tracking-[0.16em] text-[#d71920] animate-slideInDown">Sản Phẩm Nổi Bật</span>
        <h1 className="[font-family:Bahnschrift,'Arial_Narrow',sans-serif] text-[clamp(2rem,4vw,3.4rem)] font-extrabold leading-[0.96] text-[#111] animate-slideInUp">
          Những dòng xe phổ biến
        </h1>
        <p className="m-0 leading-[1.7] text-[#6a6a6a] animate-slideInUp">
          Khám phá các mẫu xe điện được yêu thích nhất của YADEA, thiết kế đầy sức hút với công nghệ tiên tiến.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-[22px] lg:grid-cols-2">
        {newProducts.map((product, idx) => (
          <article 
            key={product.title} 
            className={`relative min-h-[400px] overflow-hidden lg:min-h-[540px] transition hover:shadow-xl ${product.tone} animate-slideInUp`}
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),transparent_32%,rgba(0,0,0,0.24)_100%),radial-gradient(circle_at_24%_80%,rgba(255,255,255,0.24),transparent_28%)]" />
            <div className="relative z-[1] flex flex-col items-center gap-4 px-9 py-[52px] text-center h-full justify-center">
              <h2 className="[font-family:Bahnschrift,'Arial_Narrow',sans-serif] text-[clamp(2rem,3vw,3rem)] font-extrabold text-white">
                {product.title}
              </h2>
              <p className="max-w-[34ch] text-white/80">{product.subtitle}</p>
              <NavLink className="inline-flex items-center gap-1.5 font-bold text-white hover:translate-x-1 transition" to="/products">
                Tìm hiểu thêm
                <ChevronRight size={16} />
              </NavLink>
            </div>
          </article>
        ))}
      </div>
    </section>

    {/* Why Choose Us Section */}
    <section className="bg-white px-4 py-[72px] sm:px-6 lg:px-14">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-12 text-center">
          <h2 className="[font-family:Bahnschrift,'Arial_Narrow',sans-serif] text-[clamp(2rem,4vw,3.4rem)] font-extrabold text-[#111] mb-4">
            Tại sao chọn YADEA?
          </h2>
          <p className="text-[#6a6a6a] text-lg max-w-2xl mx-auto">
            Chúng tôi cam kết cung cấp những sản phẩm chất lượng cao nhất với dịch vụ khách hàng tuyệt vời
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {whyChooseUs.map((item, idx) => (
            <article 
              key={item.title}
              className="text-center p-6 rounded-[24px] hover:shadow-lg transition animate-slideInUp"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-[16px] bg-[#ff7a00]/10 text-[#ff7a00] mb-6">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold text-[#111] mb-3">{item.title}</h3>
              <p className="text-[#6a6a6a]">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    {/* Features Section */}
    <section className="bg-[#f4f4f2] px-4 pb-[72px] pt-[72px] sm:px-6 lg:px-14">
      <div className="grid grid-cols-1 gap-6 rounded-[32px] bg-[linear-gradient(135deg,#101010_0%,#1d1d1d_100%)] p-[34px] text-white lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="flex flex-col gap-[18px]">
          <span className="inline-block text-[0.74rem] uppercase tracking-[0.16em] text-white">Về YADEA</span>
          <h2 className="[font-family:Bahnschrift,'Arial_Narrow',sans-serif] text-[clamp(2rem,4vw,3.4rem)] font-extrabold leading-[0.96]">
            Thương hiệu xe điện hàng đầu Việt Nam
          </h2>
          <p className="leading-[1.7] text-white/80">
            YADEA là nhà sản xuất và nhà phân phối xe điện uy tín, mang đến các sản phẩm công nghệ cao, thiết kế tinh tế và dịch vụ tốt nhất cho khách hàng.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {supportFeatures.map((feature) => (
            <article
              key={feature.title}
              className="rounded-[24px] border border-white/10 bg-white/[0.04] p-6 hover:bg-white/[0.08] transition"
            >
              <div className="mb-[18px] inline-flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#ff7a00]/15 text-[#ff8b28]">
                {feature.icon}
              </div>
              <h3 className="mb-2.5 text-[1.1rem] font-semibold text-white">{feature.title}</h3>
              <p className="text-white/70">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    {/* CTA Section */}
    <section className="bg-[linear-gradient(135deg,#ff7a00_0%,#de4d00_100%)] px-4 py-[72px] sm:px-6 lg:px-14">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="[font-family:Bahnschrift,'Arial_Narrow',sans-serif] text-[clamp(2rem,4vw,3.4rem)] font-extrabold text-white mb-6">
          Sẵn sàng bắt đầu hành trình của bạn?
        </h2>
        <p className="text-white/90 text-lg mb-8">
          Hãy khám phá bộ sưu tập đầy đủ của chúng tôi hoặc trò chuyện với cố vấn thông minh của chúng tôi
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <NavLink
            to="/products"
            className="px-8 py-3 bg-white text-[#ff7a00] font-bold rounded-full hover:bg-gray-100 transition"
          >
            Xem tất cả sản phẩm
          </NavLink>
          <NavLink
            to="/chatbot"
            className="px-8 py-3 border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition"
          >
            Tư vấn miễn phí
          </NavLink>
        </div>
      </div>
    </section>
  </div>
);

export default HomePage;
