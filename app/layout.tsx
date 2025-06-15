import type { Metadata } from "next";
import { Noto_Sans_Display } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { cookies } from "next/headers";
import { Providers } from "@/components/Providers";

import "./globals.css";

const noto = Noto_Sans_Display({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VENDCORE",
  description: "VENDCORE is a ERP system for managing your business.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = cookies().get("NEXT_LOCALE")?.value || "en";
  const messages = (await import(`../messages/${locale}.json`)).default;
  return (
    <html lang={locale}>
      <body className={noto.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
