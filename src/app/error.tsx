"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Error() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-8">
      <h2 className="font-bebas text-muted-foreground/50 text-[clamp(3rem,10vw,8rem)] leading-none tracking-wider">
        Error 500
      </h2>
      <p className="text-muted-foreground/50 text-[clamp(1rem,2.5vw,1.5rem)]">
        サーバーエラーが発生しました。
      </p>
      <Button variant="outline" size="lg" asChild>
        <Link href="/">トップページへ戻る</Link>
      </Button>
    </div>
  );
}
