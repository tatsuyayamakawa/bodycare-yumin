import { z } from "zod";

/**
 * 記事フォームのバリデーションスキーマ
 */
export const articleSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  slug: z
    .string()
    .min(1, "スラッグは必須です")
    .regex(
      /^[a-z0-9-]+$/,
      "スラッグは英小文字、数字、ハイフンのみ使用可能です",
    ),
  meta_description: z.string().optional(),
  featured_image_url: z.string().optional(),
  eyecatch_default: z.string().optional(),
  status: z.enum(["draft", "published", "private", "scheduled"]),
  scheduled_at: z.string().optional(),
});

export type ArticleFormData = z.infer<typeof articleSchema>;
