"use client";

import React from "react";

type ConnectedBank = {
  name: string;
  mask: string;
  type: string;
};

type OnboardingData = {
  firstName: string;
  lastName: string;
  dob: string;

  streetAddress: string;
  extendedAddress: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;

  regulatedIdentityUuid: string;
  accountUuid: string;

  bankConnected: boolean;
  connectedBank: ConnectedBank | null;
};

type OnboardingContextType = {
  data: Partial<OnboardingData>;
  update: (values: Partial<OnboardingData>) => void;
  ssnRef: React.RefObject<string>;
};

const OnboardingContext = React.createContext<OnboardingContextType | null>(
  null,
);

// Holds onboarding form state across pages in memory for the duration of the session.
function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = React.useState<Partial<OnboardingData>>({});
  const ssnRef = React.useRef<string>("");

  function update(values: Partial<OnboardingData>) {
    setData((prev) => ({ ...prev, ...values }));
  }

  return (
    <OnboardingContext.Provider value={{ data, update, ssnRef }}>
      {children}
    </OnboardingContext.Provider>
  );
}

function useOnboarding() {
  const ctx = React.useContext(OnboardingContext);
  if (!ctx) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }
  return ctx;
}

export { OnboardingProvider, useOnboarding };
