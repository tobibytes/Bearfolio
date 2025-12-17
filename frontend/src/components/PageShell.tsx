import { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const PageShell = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-surface text-ink">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">{children}</main>
      <Footer />
    </div>
  );
};
