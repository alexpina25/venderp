import type { Metadata } from "next";
import { Noto_Sans_Display } from "next/font/google";
import { Providers } from "@/components/Providers";

import "./globals.css";

const noto = Noto_Sans_Display({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VENDCORE",
  description: "VENDCORE is a ERP system for managing your business.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={noto.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
