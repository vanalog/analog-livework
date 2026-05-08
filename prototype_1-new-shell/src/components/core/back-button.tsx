"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BackButtonProps {
  href?: string;
  label?: string;
}

export function BackButton(props: BackButtonProps) {
  const router = useRouter();

  function handleBack() {
    if (props.href) {
      router.push(props.href);
    } else {
      router.back();
    }
  }

  return (
    <Button variant="ghost" onClick={handleBack}>
      <ArrowLeft />
      {props.label || "Back"}
    </Button>
  );
}
