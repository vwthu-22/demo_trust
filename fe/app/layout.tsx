import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nike Store - Bán giày chính hãng',
  description: 'Khám phá bộ sưu tập Nike mới nhất với những đôi giày chính hãng, chất lượng cao và thiết kế đẳng cấp',
  keywords: 'Nike, giày Nike, Nike chính hãng, Nike Store, giày thể thao',
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
