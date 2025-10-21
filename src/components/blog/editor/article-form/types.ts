import type { Article } from "@/lib/supabase/types";

export interface ArticleFormProps {
  article?: Article;
  onSuccess?: () => void;
}
