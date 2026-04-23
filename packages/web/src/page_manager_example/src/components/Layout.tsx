import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <TopNav />
      <main className="pl-65 pt-16">
        <div className="p-8 max-w-7x1 mx-auto min-h-[calc(100vh-64px)]">
          {children}
        </div>
      </main>
    </div>
  );
}
