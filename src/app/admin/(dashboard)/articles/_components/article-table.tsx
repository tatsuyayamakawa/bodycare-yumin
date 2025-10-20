"use client";

import type { ArticleSearchProps } from "../_lib";
import { statusColors, statusLabels } from "../_lib";
import { ArticleActions } from "./article-actions";
import { EyecatchPreview } from "./eyecatch-preview";


import type { Article } from "@/lib/supabase/types";

interface ArticleTableProps {
  articles: Article[];
  isPending: boolean;
  statusFilter?: string;
  searchTerm: string;
  currentUser?: ArticleSearchProps["currentUser"];
}

/**
 * テキストを指定の長さで切り詰める
 */
function truncateText(text: string, maxLength: number): string {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}

/**
 * 空の状態メッセージを取得
 */
function getEmptyMessage(searchTerm: string, statusFilter?: string): string {
  return searchTerm.trim() || (statusFilter && statusFilter !== "all")
    ? "条件に一致する記事はありません。"
    : "記事がありません。";
}

/**
 * 記事一覧テーブル（デスクトップ・モバイル対応）
 */
export function ArticleTable({
  articles,
  statusFilter,
  searchTerm,
  currentUser,
}: ArticleTableProps) {
  const emptyMessage = getEmptyMessage(searchTerm, statusFilter);

  return (
    <>
      {/* デスクトップ用テーブル */}
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-1/3 px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                タイトル
              </th>
              <th className="w-24 px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                公開日
              </th>
              <th className="w-24 px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                編集日
              </th>
              <th className="w-32 px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                スラッグ
              </th>
              <th className="w-32 px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                アイキャッチ
              </th>
              <th className="w-32 px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                SEO説明文
              </th>
              <th className="w-32 px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                ステータス
              </th>
              <th className="w-32 px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                アクション
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {articles.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center">
                  <p className="text-sm text-gray-500">{emptyMessage}</p>
                </td>
              </tr>
            ) : (
              articles.map((article, index) => {
                const isLast = index === articles.length - 1;
                const imageSrc =
                  article.featured_image_url || article.eyecatch_default;

                return (
                  <tr key={article.id} className="group hover:bg-gray-50">
                    <td
                      className={`px-6 py-3 whitespace-nowrap ${isLast ? "group-hover:rounded-bl-lg" : ""}`}
                    >
                      <h3
                        className="truncate font-medium text-gray-900"
                        title={article.title}
                      >
                        {truncateText(article.title, 35)}
                      </h3>
                    </td>

                    <td className="px-6 py-3 text-sm whitespace-nowrap text-gray-500">
                      <div className="max-w-20">
                        {new Date(article.created_at).toLocaleDateString(
                          "ja-JP",
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-3 text-sm whitespace-nowrap text-gray-500">
                      <div className="max-w-20">
                        {new Date(article.updated_at).toLocaleDateString(
                          "ja-JP",
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-3 text-sm whitespace-nowrap text-gray-400">
                      <div className="truncate" title={article.slug}>
                        /{truncateText(article.slug, 20)}
                      </div>
                    </td>

                    <td className={"px-6 py-3 whitespace-nowrap"}>
                      <div className="max-w-12">
                        <EyecatchPreview
                          imageSrc={imageSrc}
                          title={article.title}
                          size="desktop"
                        />
                      </div>
                    </td>

                    <td className="px-6 py-3 whitespace-nowrap">
                      {article.meta_description?.trim() ? (
                        <span className="inline-flex h-6 items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          設定済み
                        </span>
                      ) : (
                        <span className="inline-flex h-6 items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                          未設定
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[article.status]}`}
                      >
                        {statusLabels[article.status]}
                      </span>
                    </td>

                    <td
                      className={`px-6 py-3 whitespace-nowrap ${isLast ? "group-hover:rounded-br-lg" : ""}`}
                    >
                      <ArticleActions
                        article={article}
                        currentUser={currentUser}
                        variant="desktop"
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* モバイル用カードレイアウト */}
      <div className="space-y-4 p-4 md:hidden">
        {articles.length === 0 ? (
          <div className="py-8 text-center text-gray-500">{emptyMessage}</div>
        ) : (
          articles.map((article) => {
            const imageSrc =
              article.featured_image_url || article.eyecatch_default;

            return (
              <div
                key={article.id}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
              >
                {/* ヘッダー: タイトルとステータス */}
                <div className="mb-3 flex items-start justify-between">
                  <h3 className="flex-1 pr-2 leading-5 font-medium text-gray-900">
                    {article.title}
                  </h3>
                  <span
                    className={`inline-flex flex-shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[article.status]}`}
                  >
                    {statusLabels[article.status]}
                  </span>
                </div>

                {/* アイキャッチ画像 */}
                {imageSrc && (
                  <div className="mb-3">
                    <EyecatchPreview
                      imageSrc={imageSrc}
                      title={article.title}
                      size="mobile"
                    />
                  </div>
                )}

                {/* メタ情報 */}
                <div className="mb-3 space-y-2 text-sm text-gray-500">
                  <div className="flex justify-between">
                    <span>公開日</span>
                    <span>
                      {new Date(article.created_at).toLocaleDateString("ja-JP")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>編集日</span>
                    <span>
                      {new Date(article.updated_at).toLocaleDateString("ja-JP")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>スラッグ</span>
                    <span className="text-gray-400">/{article.slug}</span>
                  </div>
                </div>

                {/* SEO説明文 */}
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-gray-600">SEO説明文</span>
                  {article.meta_description?.trim() ? (
                    <span className="inline-flex h-6 items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      設定済み
                    </span>
                  ) : (
                    <span className="inline-flex h-6 items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                      未設定
                    </span>
                  )}
                </div>

                {/* アクションボタン */}
                <ArticleActions
                  article={article}
                  currentUser={currentUser}
                  variant="mobile"
                />
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
