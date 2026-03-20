import type { PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren) => (
  <div className="app-shell">
    <header className="app-header">
      <h1>E-Bike Web</h1>
      <p>Shared architecture scaffold for the React storefront.</p>
    </header>
    <main>{children}</main>
  </div>
);

export default Layout;
