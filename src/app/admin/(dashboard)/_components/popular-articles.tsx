import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getPopularArticlesThisMonth } from "@/lib/actions/article-views";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
};

const formatViewCount = (
  internalCount: number | undefined,
  gaCount?: number | undefined,
) => {
  const count =
    gaCount !== undefined && gaCount >= 0 ? gaCount : internalCount || 0;
  return count === 0 ? "0" : count.toLocaleString();
};

export async function PopularArticles() {
  const result = await getPopularArticlesThisMonth(3);

  const articles = result.success && result.data ? result.data : [];
  const hasError = !result.success;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <CardTitle className="text-lg">人気記事（今月）</CardTitle>
            <CardDescription>
              今月よく読まれている人気記事です。
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {articles.length === 0 ? (
          <div className="py-4 text-center">
            <p className="text-sm text-gray-500">
              {hasError
                ? "記事の読み込みに失敗しました"
                : "公開記事がありません"}
            </p>
            {hasError && result.error && (
              <p className="mt-1 text-xs text-red-500">{result.error}</p>
            )}
          </div>
        ) : (
          <ul className="space-y-2.5">
            {articles.map((article) => (
              <li
                key={article.id}
                className="flex items-center justify-between text-xs sm:text-sm"
              >
                <div className="min-w-0 flex-1 pr-2">
                  <p className="truncate font-medium text-gray-900">
                    {article.title}
                  </p>
                  <time className="text-xs text-gray-500">
                    {article.published_at
                      ? formatDate(article.published_at)
                      : formatDate(article.created_at)}
                  </time>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <span className="text-xs font-medium">
                    {formatViewCount(
                      article.monthly_views || article.view_count,
                      article.ga_monthly_views,
                    )}
                  </span>
                  {article.ga_monthly_views !== undefined && (
                    <span className="text-xs text-blue-500 no-underline">
                      View
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
