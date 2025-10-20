"use client";

import { useRouter } from "next/navigation";

import { ArticleForm } from "@/components/blog/editor/article-form";
import { Article } from "@/lib/supabase/types";

interface EditArticleClientProps {
  article: Article;
}

export function EditArticleClient({ article }: EditArticleClientProps) {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/admin/articles");
  };

  return <ArticleForm article={article} onSuccess={handleSuccess} />;
}