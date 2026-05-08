"use client";

import { useRouter } from "next/navigation";
import { Lock, Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "../_components/onboarding-provider";
import { useUser } from "@/hooks/use-user";

export default function WelcomePage() {
  const { user } = useUser();
  const router = useRouter();
  const { update } = useOnboarding();

  const firstName = user?.name?.split(" ")[0];

  function handleGetStarted() {
    if (user?.email) {
      update({ email: user.email });
    }
    router.push("/onboarding/verify-identity");
  }

  return (
    <div className="flex flex-col items-center flex-1 px-4 pt-12 pb-8">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">
            {firstName ? `Welcome, ${firstName}` : "Welcome!"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Your university has invited you to set up your Analog account to
            receive payments under your Benefits Pool agreement.
          </p>
        </div>

        <div className="bg-muted/40 rounded-lg p-4 text-left space-y-3">
          <p className="text-sm font-medium">
            This takes about 5 minutes. You will need:
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-green-500 shrink-0" />
              Your Social Security number
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-green-500 shrink-0" />
              Your bank account login (to connect for transfers)
            </div>
          </div>
        </div>

        <div className="border bg-muted/30 rounded-lg p-4 flex items-start gap-3 text-left">
          <Lock className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            Your information is encrypted and secured by Huntington National
            Bank. Analog never stores your credentials.
          </p>
        </div>

        <Button className="w-full" onClick={handleGetStarted}>
          Get Started
          <ChevronRight className="w-4 h-4" />
        </Button>

        <p className="text-xs text-muted-foreground">
          By continuing, you agree to Analog&apos;s{" "}
          <a href="#" className="underline underline-offset-2">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline underline-offset-2">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
