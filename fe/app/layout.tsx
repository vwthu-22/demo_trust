import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Naisu Store - Bán giày chính hãng',
  description: 'Khám phá bộ sưu tập Naisu mới nhất với những đôi giày chính hãng, chất lượng cao',
  keywords: 'Naisu, giày Naisu, Naisu chính hãng, Naisu Store, giày thể thao',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
