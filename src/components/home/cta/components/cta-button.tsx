import { MoveRight } from "lucide-react";

import { ctaData } from "../constants";

import { Button } from "@/components/ui/button";

export default function CtaButton() {
  const { button } = ctaData;

  return (
    <Button
      variant="default"
      size="lg"
      className="mt-[var(--spacing-sm)] rounded-full bg-red-500 transition active:scale-105"
      asChild
    >
      <a href={button.url}>
        <MoveRight className="mr-2 h-5 w-5" />
        {button.text}
      </a>
    </Button>
  );
}
