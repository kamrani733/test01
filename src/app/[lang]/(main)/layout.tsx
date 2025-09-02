import { ReactNode } from 'react';

import Header from '@/components/main/Header/Header';
import Footer from '@/components/main/footer/Footer';

export default async function MainLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <div className="min-h-screen">{children}</div>
      <Footer />
    </main>
  );
}
