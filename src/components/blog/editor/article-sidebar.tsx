"use client";

import { EyecatchSection } from "./sections/eyecatch-section";
import { PublishSection } from "./sections/publish-section";
import { SEOSection } from "./sections/seo-section";
import { SlugSection } from "./sections/slug-section";

// ========================================
// 型定義
// ========================================

interface ArticleSidebarProps {
  // 基本情報
  title: string;
  slug: string;
  onSlugChange: (slug: string) => void;
  slugError?: string;

  // 公開設定
  status: string;
  onStatusChange: (status: string) => void;
  scheduledAt?: string;
  onScheduledAtChange: (date: string) => void;

  // SEO設定
  metaDescription: string;
  onMetaDescriptionChange: (description: string) => void;

  // アイキャッチ設定
  featuredImage?: string;
  onFeaturedImageChange: (url?: string) => void;

  // アクション
  isSubmitting: boolean;
  onSave: () => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

// ========================================
// コンポーネント
// ========================================

/**
 * 記事編集画面のサイドバーコンポーネント
 * 公開設定、スラッグ、アイキャッチ、SEO設定を管理
 */
export function ArticleSidebar({
  title,
  slug,
  onSlugChange,
  slugError,
  status,
  onStatusChange,
  scheduledAt,
  onScheduledAtChange,
  metaDescription,
  onMetaDescriptionChange,
  featuredImage,
  onFeaturedImageChange,
  isSubmitting,
  onSave,
  onCancel,
  isEditing = false,
}: ArticleSidebarProps) {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* 公開設定 */}
      <PublishSection
        status={status}
        onStatusChange={onStatusChange}
        scheduledAt={scheduledAt}
        onScheduledAtChange={onScheduledAtChange}
        isSubmitting={isSubmitting}
        onSave={onSave}
        onCancel={onCancel}
        isEditing={isEditing}
      />

      {/* モバイル: グリッド表示 / デスクトップ: 縦並び */}
      <div className="grid grid-cols-1 gap-4 md:block md:space-y-6">
        <SlugSection
          slug={slug}
          onSlugChange={onSlugChange}
          slugError={slugError}
        />

        <EyecatchSection
          title={title}
          featuredImage={featuredImage}
          onFeaturedImageChange={onFeaturedImageChange}
          isSubmitting={isSubmitting}
        />

        <SEOSection
          title={title}
          metaDescription={metaDescription}
          onMetaDescriptionChange={onMetaDescriptionChange}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
