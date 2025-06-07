import { Logo } from "@/components/layout/Logo";

export default function LayoutAuth({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm text-center space-y-6">
        <Logo />
        <h1 className="text-2xl font-semibold text-foreground">
          Welcome to VendCore!
        </h1>
        {children}
      </div>
    </div>
  );
}
