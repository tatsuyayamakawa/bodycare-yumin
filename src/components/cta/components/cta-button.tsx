import { MoveRight } from "lucide-react";

import { Button } from "../../ui/button";
import { CTA_DATA } from "../data";

export default function CtaButton() {
  const { button } = CTA_DATA;

  return (
    <Button
      variant="default"
      size="lg"
      className="mt-6 rounded-full bg-red-500 transition active:scale-105"
      asChild
    >
      <a href={CTA_DATA.button.url}>
        <MoveRight className="mr-2 h-5 w-5" />
        {button.text}
      </a>
    </Button>
  );
}
