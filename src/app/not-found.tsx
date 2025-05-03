import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-8">
      <h2 className="font-bebas-neue text-muted-foreground/50 text-[clamp(3rem,10vw,8rem)]/none tracking-wider">
        404 Not Found
      </h2>
      <p className="text-muted-foreground/50 text-[clamp(1rem,2.5vw,1.5rem)]/normal">
        お探しのページは見つかりませんでした。
      </p>
      <Button variant="outline" size="lg" asChild>
        <Link href="/">トップページへ戻る</Link>
      </Button>
    </div>
  );
}
