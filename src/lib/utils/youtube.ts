/**
 * YouTube URL関連のユーティリティ関数
 */

// YouTube URLの正規表現パターン
const YOUTUBE_PATTERNS = [
  // 通常のYouTube URL: https://www.youtube.com/watch?v=VIDEO_ID
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/g,
  // 短縮URL: https://youtu.be/VIDEO_ID
  /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]{11})/g,
  // 埋め込みURL: https://www.youtube.com/embed/VIDEO_ID
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/g,
];

/**
 * YouTube URLからビデオIDを抽出
 */
export function extractYouTubeVideoId(url: string): string | null {
  for (const pattern of YOUTUBE_PATTERNS) {
    const match = pattern.exec(url);
    if (match && match[1]) {
      pattern.lastIndex = 0; // グローバルフラグのリセット
      return match[1];
    }
  }
  return null;
}

/**
 * ビデオIDから埋め込み用URLを生成
 */
export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
}

/**
 * YouTube URLが含まれているかチェック
 */
export function containsYouTubeUrl(text: string): boolean {
  return YOUTUBE_PATTERNS.some(pattern => {
    const result = pattern.test(text);
    pattern.lastIndex = 0; // グローバルフラグのリセット
    return result;
  });
}

/**
 * テキスト内のYouTube URLを埋め込み用のHTMLに変換
 */
export function convertYouTubeUrls(content: string): string {
  let convertedContent = content;

  YOUTUBE_PATTERNS.forEach(pattern => {
    convertedContent = convertedContent.replace(pattern, (match, videoId) => {
      if (!videoId) return match;
      
      const embedUrl = getYouTubeEmbedUrl(videoId);
      return `
        <div class="youtube-embed-wrapper" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin: 1.5rem 0;">
          <iframe
            src="${embedUrl}"
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            loading="lazy"
          ></iframe>
        </div>
      `;
    });
    pattern.lastIndex = 0; // グローバルフラグのリセット
  });

  return convertedContent;
}

/**
 * ReactコンポーネントとしてYouTube埋め込みを生成するためのデータを抽出
 */
export function extractYouTubeEmbeds(content: string): Array<{
  originalUrl: string;
  videoId: string;
  embedUrl: string;
}> {
  const embeds: Array<{
    originalUrl: string;
    videoId: string;
    embedUrl: string;
  }> = [];

  YOUTUBE_PATTERNS.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const videoId = match[1];
      if (videoId) {
        embeds.push({
          originalUrl: match[0],
          videoId,
          embedUrl: getYouTubeEmbedUrl(videoId),
        });
      }
    }
    pattern.lastIndex = 0; // グローバルフラグのリセット
  });

  return embeds;
}