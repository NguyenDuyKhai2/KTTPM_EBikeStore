import type { ReactNode } from "react";
import { Mail, MapPin, Phone, Heart, MessageCircle, Camera, Play } from "lucide-react";
import { Link } from "react-router-dom";

const footerSections = [
  {
    title: "Sản Phẩm",
    links: [
      { label: "YADEA Vekoo", href: "#" },
      { label: "YADEA Velax", href: "#" },
      { label: "YADEA Oris", href: "#" },
      { label: "YADEA Voltguard", href: "#" },
      { label: "YADEA Ossy", href: "#" }
    ]
  },
  {
    title: "Về Chúng Tôi",
    links: [
      { label: "Về YADEA", href: "#" },
      { label: "Cửa Hàng", href: "#" },
      { label: "Công Nghệ", href: "#" },
      { label: "Tin Tức", href: "#" },
      { label: "Tuyển Dụng", href: "#" }
    ]
  },
  {
    title: "Hỗ Trợ",
    links: [
      { label: "Hỗ Trợ & Bảo Hành", href: "#" },
      { label: "Phương Thức Thanh Toán", href: "#" },
      { label: "Phương Thức Vận Chuyển", href: "#" },
      { label: "Chính Sách Đổi Trả", href: "#" },
      { label: "Liên Hệ", href: "#" }
    ]
  }
];

const socialLinks = [
  { icon: Heart, href: "#", label: "Facebook" },
  { icon: MessageCircle, href: "#", label: "Twitter" },
  { icon: Camera, href: "#", label: "Instagram" },
  { icon: Play, href: "#", label: "YouTube" }
];

export const Footer = (): ReactNode => {
  return (
    <footer className="bg-gray-900 text-gray-100">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800 bg-gradient-to-r from-orange-600 to-orange-500 px-4 py-12 sm:px-6 lg:px-14">
        <div className="mx-auto max-w-md">
          <h3 className="text-xl font-bold text-white mb-4">Nhận Thông Tin Mới Nhất</h3>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Email của bạn"
              className="flex-1 rounded-lg bg-white/20 px-4 py-3 text-white placeholder-white/70 backdrop-blur-sm transition focus:bg-white/30 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-lg bg-white px-6 py-3 font-semibold text-orange-600 transition hover:bg-gray-100"
            >
              Đăng Ký
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="px-4 py-14 sm:px-6 lg:px-14">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-[18px_18px_18px_4px] bg-gradient-to-br from-orange-500 to-orange-600 text-lg font-extrabold text-white">
                E
              </div>
              <div className="flex flex-col gap-0">
                <span className="text-xs font-semibold uppercase tracking-widest text-orange-400">
                  E-Bike
                </span>
                <strong className="text-sm font-bold">YADEA</strong>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Công ty TNHH Khoa Học Kỹ Thuật YADEA (Việt Nam)
            </p>
            <p className="text-xs text-gray-500 mb-2">Mã số thuế: 2400966553</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Địa chỉ: Lô CN-02, Khu công nghiệp Tân Hùng, Xã Lạng Giang, Tỉnh Bắc Ninh, Việt Nam
            </p>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-400 transition hover:text-orange-400 hover:translate-x-0.5"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact & Social Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Contact Info */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
                Thông Tin Liên Hệ
              </h4>
              <div className="space-y-3">
                <a
                  href="tel:1900636803"
                  className="inline-flex items-center gap-2.5 text-sm text-gray-400 transition hover:text-orange-400 group"
                >
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-orange-400/10 group-hover:bg-orange-400/20 transition">
                    <Phone size={16} className="text-orange-400" />
                  </div>
                  <span>1900636803</span>
                </a>
                <a
                  href="mailto:market@yadea.com.vn"
                  className="inline-flex items-center gap-2.5 text-sm text-gray-400 transition hover:text-orange-400 group"
                >
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-orange-400/10 group-hover:bg-orange-400/20 transition">
                    <Mail size={16} className="text-orange-400" />
                  </div>
                  <span>market@yadea.com.vn</span>
                </a>
                <div className="inline-flex items-start gap-2.5 text-sm text-gray-400">
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-orange-400/10 flex-shrink-0 mt-0.5">
                    <MapPin size={16} className="text-orange-400" />
                  </div>
                  <span>Bắc Ninh, Việt Nam</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
                Theo Dõi Chúng Tôi
              </h4>
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 text-gray-400 transition hover:bg-orange-500 hover:text-white"
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>

              {/* Certification Badge */}
              <div className="mt-6 inline-block rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-xs font-semibold text-white">
                ✓ Đã thông báo Bộ Công Thương
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800 bg-black/40 px-4 py-6 sm:px-6 lg:px-14">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 text-center md:text-left">
            © 2026 Bản quyền thuộc về Công ty TNHH Electric Motorcycle Yadea Việt Nam. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-gray-500">
            <a href="#" className="transition hover:text-orange-400">
              Chính Sách Bảo Mật
            </a>
            <span className="text-gray-700">•</span>
            <a href="#" className="transition hover:text-orange-400">
              Điều Khoản Dịch Vụ
            </a>
            <span className="text-gray-700">•</span>
            <a href="#" className="transition hover:text-orange-400">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
