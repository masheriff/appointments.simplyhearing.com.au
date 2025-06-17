// src/components/layout/Layout.tsx
import type { ReactNode } from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 h-[calc(100vh-64px)]">
        {children}
      </main>
    </div>
  );
};