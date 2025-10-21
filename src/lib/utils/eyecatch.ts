/**
 * アイキャッチ画像を生成する
 * @param title 記事のタイトル
 * @returns 生成されたアイキャッチ画像のURL
 */
export async function generateEyecatchImage(title: string): Promise<string> {
  const response = await fetch("/api/generate-eyecatch", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });

  if (!response.ok) {
    throw new Error("アイキャッチの生成に失敗しました");
  }

  const { imageUrl } = await response.json();
  return imageUrl;
}
