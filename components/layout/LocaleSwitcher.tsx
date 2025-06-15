"use client";

import { useLocale, usePathname } from "next-intl";
import Link from "next-intl/link";

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 text-sm">
      <Link href={pathname} locale="en" className={locale === "en" ? "font-semibold underline" : ""}>
        EN
      </Link>
      <span>|</span>
      <Link href={pathname} locale="es" className={locale === "es" ? "font-semibold underline" : ""}>
        ES
      </Link>
    </div>
  );
}
