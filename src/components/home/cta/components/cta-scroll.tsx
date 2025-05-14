import { ChevronDown } from "lucide-react";

export default function Scroll() {
  return (
    <div className="mt-6 flex items-center justify-center opacity-70">
      <div className="flex flex-col items-center">
        <span className="text-muted-foreground text-xs font-medium tracking-wider">
          SCROLL DOWN
        </span>
        <ChevronDown className="text-muted-foreground mt-1 h-5 w-5 animate-bounce" />
      </div>
    </div>
  );
}
