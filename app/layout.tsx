import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Writer's Room Pinboard - Derivation Story Canvas",
  description: "A tactile pinboard interface for AI story pipeline derivation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
