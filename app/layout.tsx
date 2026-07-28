import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SlutWalk Denver',
  description: 'Password-gated community prototype for SlutWalk Denver.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}