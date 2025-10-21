"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ArticleContentEditor } from "../article-content-editor";
import { ArticleSidebar } from "../article-sidebar";
import { articleSchema, type ArticleFormData } from "./schemas";
import type { ArticleFormProps } from "./types";

import { createArticle, updateArticle } from "@/lib/actions/articles";
import type { CreateArticleData, UpdateArticleData } from "@/lib/supabase/types";

export function ArticleForm({ article, onSuccess }: ArticleFormProps) {
  const [content, setContent] = useState(article?.content);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: article?.title || "",
      slug: article?.slug || "",
      meta_description: article?.meta_description || "",

      featured_image_url: article?.featured_image_url || "",
      eyecatch_default: article?.eyecatch_default || "",
      status: article?.status || "draft",
      scheduled_at: article?.scheduled_at
        ? new Date(
            new Date(article.scheduled_at).getTime() + 9 * 60 * 60 * 1000,
          )
            .toISOString()
            .slice(0, 16)
        : "",
    },
  });

  const watchedTitle = watch("title");
  const watchedSlug = watch("slug");
  const watchedStatus = watch("status");
  const watchedMetaDescription = watch("meta_description");

  const watchedFeaturedImage = watch("featured_image_url");
  const watchedScheduledAt = watch("scheduled_at");

  // タイトルからスラッグを自動生成
  useEffect(() => {
    if (!article && watchedTitle) {
      const slug = watchedTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setValue("slug", slug);
    }
  }, [watchedTitle, setValue, article]);

  const onSubmit = async (data: ArticleFormData) => {
    if (!content) {
      toast.error("記事本文を入力してください");
      return;
    }

    setIsSubmitting(true);

    try {
      const articleData = {
        ...data,
        content,
        meta_description: data.meta_description,

        scheduled_at:
          data.status === "scheduled" ? data.scheduled_at : null,
      };

      let result;
      if (article) {
        result = await updateArticle({
          ...articleData,
          id: article.id,
        } as UpdateArticleData);
      } else {
        result = await createArticle(articleData as CreateArticleData);
      }

      if ('error' in result) {
        toast.error(result.error);
      } else {
        toast.success(article ? "記事を更新しました" : "記事を作成しました");
        onSuccess?.();
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("エラーが発生しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 lg:flex-row lg:gap-8"
    >
      {/* メインコンテンツエリア */}
      <div className="min-w-0 flex-1">
        <ArticleContentEditor
          title={watchedTitle}
          onTitleChange={(title) => setValue("title", title)}
          content={content}
          onContentChange={(c) => setContent(c)}
          titleError={errors.title?.message}
        />
      </div>

      {/* サイドバー */}
      <div className="lg:w-80 lg:flex-shrink-0">
        <div className="sticky top-4">
          <ArticleSidebar
            slug={watchedSlug}
            onSlugChange={(slug) => setValue("slug", slug)}
            slugError={errors.slug?.message}
            status={watchedStatus}
            onStatusChange={(status) =>
              setValue(
                "status",
                status as "draft" | "published" | "private" | "scheduled",
              )
            }
            metaDescription={watchedMetaDescription || ""}
            onMetaDescriptionChange={(description) =>
              setValue("meta_description", description)
            }
            featuredImage={watchedFeaturedImage}
            onFeaturedImageChange={(url) =>
              setValue("featured_image_url", url || "")
            }
            scheduledAt={watchedScheduledAt}
            onScheduledAtChange={(date) => setValue("scheduled_at", date)}
            isSubmitting={isSubmitting}
            onSave={handleSubmit(onSubmit)}
            onCancel={onSuccess}
            isEditing={!!article}
            title={watchedTitle}
          />
        </div>
      </div>
    </form>
  );
}
