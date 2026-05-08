"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "../_components/header";
import { ProcessingScreen } from "./_components/processing-screen";

const STEPS = [
  "Mapping contract term to fiscal periods...",
  "Calculating payment schedule...",
  "Building obligation index...",
  "Ready to review",
];

export default function Generate() {
  const router = useRouter();
  const params = useSearchParams();
  const agreementUUID = params.get("agreement_uuid");
  const beneficiaryPartyUUID = params.get("beneficiary_party_uuid");

  function onComplete() {
    router.replace(
      `/contracts/negotiation/review?agreement_uuid=${agreementUUID}&beneficiary_party_uuid=${beneficiaryPartyUUID}`,
    );
  }

  return (
    <>
      <div className="border-b px-6 pb-4">
        <Header step={1} />
      </div>
      <ProcessingScreen labels={STEPS} onComplete={onComplete} />
    </>
  );
}
