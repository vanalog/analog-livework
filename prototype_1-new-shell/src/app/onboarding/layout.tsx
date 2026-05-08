import Image from "next/image";
import { HelpCircle } from "lucide-react";
import { OnboardingProvider } from "./_components/onboarding-provider";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OnboardingProvider>
      <div className="min-h-screen flex flex-col">
        <header className="border-b">
          <div className="flex max-w-lg mx-auto items-center justify-between px-6 py-4">
            <Image
              src="/logo-black.svg"
              alt="Analog"
              width={120}
              height={24}
              priority
            />
            <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <HelpCircle className="w-4 h-4" />
              Need help?
            </button>
          </div>
        </header>
        <main className="flex-1 flex flex-col">{children}</main>
      </div>
    </OnboardingProvider>
  );
}
