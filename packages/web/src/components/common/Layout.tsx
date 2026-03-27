import type { PropsWithChildren } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }: PropsWithChildren) => (
  <div className="flex flex-col min-h-screen">
    <Header showSearch />
    <main className="flex-1 bg-gradient-to-b from-gray-50 to-white">
      {children ?? <Outlet />}
    </main>
    <Footer />
  </div>
);

export default Layout;

