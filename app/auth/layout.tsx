import { Logo } from "@/components/layout/Logo";
import { useTranslations } from "next-intl";

export default function LayoutAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("AuthLayout");
  return (
    <div className="min-h-screen flex flex-col items-center text-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex justify-center">
          <Logo />
        </div>
        <h1 className="text-2xl font-semibold text-foreground">
          {t("welcome")}
        </h1>
        {children}
      </div>
    </div>
  );
}
