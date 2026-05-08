"use client";

import { CheckCircle } from "lucide-react";
import { ProgressHeader } from "../_components/progress-header";
import { useOnboarding } from "../_components/onboarding-provider";

export default function ConfirmationPage() {
  const { data } = useOnboarding();

  return (
    <div className="flex flex-col flex-1">
      <div className="border-b px-6 py-4">
        <ProgressHeader currentStep={4} />
      </div>
      <div className="flex-1 flex justify-center py-8 px-4">
        <div className="w-full max-w-xl space-y-6">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-50">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold">You&apos;re All Set!</h1>
            <p className="text-sm text-muted-foreground">
              Your Analog account is active and ready to receive payments.
            </p>
          </div>

          <div className="space-y-3">
            <div className="border rounded-lg p-4 space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Analog Wallet
              </p>
              <p className="text-sm font-semibold">Huntington National Bank</p>
              <p className="text-sm text-muted-foreground">
                Connected Deposits Account
              </p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-sm text-muted-foreground">
                  {/* TODO update this to get the actual account mask from HNB/Bonilla */}
                  Account ····7291
                </p>
                <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Active
                </span>
              </div>
            </div>

            {data.connectedBank && (
              <div className="border rounded-lg p-4 space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Connected Bank
                </p>
                <p className="text-sm font-semibold">
                  {data.connectedBank.name}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-muted-foreground capitalize">
                    {data.connectedBank.type} ····{data.connectedBank.mask}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    For transfers out
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2 bg-muted/30 p-4">
            <p className="text-sm font-semibold">What happens next:</p>
            <p className="text-sm text-muted-foreground">
              Your university will process payments per your contract schedule.
              You&apos;ll receive an email each time a payment is deposited to
              your Analog wallet.
            </p>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            You can close this page. Your university will be notified that your
            account is ready.
          </p>
        </div>
      </div>
    </div>
  );
}
