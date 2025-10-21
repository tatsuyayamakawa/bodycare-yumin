# ブログ機能追加 要件定義書

## プロジェクト概要
bodycare-yumin サイトにブログ機能を追加し、情報発信力を強化する。

## 技術仕様

### 使用技術
- **エディタ**: Tiptap（リッチテキストエディタ）
- **データベース**: Supabase
- **外部連携**: MCP（Model Context Protocol）でSupabase接続
- **認証**: ベーシック認証（管理ページのみ）
- **アーキテクチャ**: Server Components重視（Next.js App Router）

## 機能要件

### 1. ブログ記事管理機能

#### 1.1 記事作成・編集
- **エディタ機能**
  - 見出し（H1-H6）
  - 太字、斜体、下線
  - 箇条書き（番号付き・番号なし）
  - リンク挿入
  - 画像挿入・アップロード
  - コードブロック
  - 引用
  - テーブル
  - 文字色・背景色
  - テキスト配置（左寄せ、中央、右寄せ）

#### 1.2 記事メタデータ
- タイトル（必須）
- スラッグ（URL用、自動生成 or 手動設定）
- 公開日時
- **予約投稿日時**（未来日時設定可能）
- 更新日時
- 公開状態（下書き・公開・非公開・**予約投稿**）
- アイキャッチ画像
- メタディスクリプション（SEO用）
- タグ・カテゴリ

### 2. 管理機能

#### 2.1 管理ページアクセス
- **認証方式**: ベーシック認証
- **対象**: 管理人1名のみ
- **アクセス範囲**: `/admin/*` 配下

#### 2.2 管理画面機能
- 記事一覧表示（ステータス別フィルタ）
- 記事の新規作成
- 記事の編集・更新
- 記事の削除
- 下書き保存機能
- **予約投稿設定機能**
- **予約投稿一覧・管理**
- プレビュー機能

### 3. フロントエンド表示機能

#### 3.1 ナビゲーション
- メインナビゲーションに「ブログ」リンクを追加
- URL: `/blog`

#### 3.2 ブログ一覧ページ
- **表示形式**: カード形式のレイアウト
- **カード要素**:
  - アイキャッチ画像
  - 記事タイトル
  - 投稿日
  - メタディスクリプション（抜粋）
  - 「続きを読む」ボタン
- **機能**:
  - ページネーション
  - 公開記事のみ表示（**予約投稿は公開日時到達後に自動表示**）
  - 新着順表示

#### 3.3 記事詳細ページ
- 記事タイトル
- 投稿日・更新日
- 記事本文（Tiptapで作成されたリッチコンテンツ）
- ソーシャルシェアボタン
- 前後の記事へのナビゲーション

## データベース設計

### テーブル構成（Supabase）

#### articles テーブル
```sql
CREATE TABLE articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  content JSONB NOT NULL, -- Tiptapのコンテンツ形式
  meta_description TEXT,
  featured_image_url VARCHAR,
  status VARCHAR CHECK (status IN ('draft', 'published', 'private', 'scheduled')) DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  scheduled_at TIMESTAMPTZ, -- 予約投稿日時
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_articles_status_published_at ON articles(status, published_at DESC);
CREATE INDEX idx_articles_scheduled_at ON articles(scheduled_at) WHERE status = 'scheduled';
CREATE INDEX idx_articles_slug ON articles(slug);

-- 予約投稿自動公開用のファンクション
CREATE OR REPLACE FUNCTION publish_scheduled_articles()
RETURNS void AS $
BEGIN
  UPDATE articles 
  SET status = 'published', 
      published_at = NOW()
  WHERE status = 'scheduled' 
    AND scheduled_at <= NOW();
END;
$ LANGUAGE plpgsql;
```

## 技術的実装要件

### 1. MCP（Model Context Protocol）連携
- **Supabase MCP Server**の設定
- データベース操作の抽象化
- 型安全なデータアクセス
- リアルタイム機能の活用

### 2. Server Components最適化
- **データフェッチング**:
  - Server Componentsでの初期データ取得
  - Client Componentsは必要最小限に限定
  - React Server Components（RSC）の活用
- **パフォーマンス最適化**:
  - Streaming SSR
  - Partial Prerendering（PPR）
  - 静的サイト生成（ISR）での記事ページ
  - Edge Runtime活用

### 3. 予約投稿システム
- **Cron Job実装**:
  - Vercel Cron or Supabase Edge Functions
  - 定期実行による予約投稿の自動公開
  - エラーハンドリングとログ機能
- **リアルタイム更新**:
  - Supabase Realtime機能
  - 管理画面での投稿ステータスの即座反映

### 4. Tiptap設定
- Client Componentとして独立実装
- 必要な拡張機能の導入
- カスタムスタイリング対応
- 画像アップロード機能の実装
- レスポンシブ対応

### 5. Supabase連携
- 記事データのCRUD操作
- 画像ファイルのストレージ機能活用
- Row Level Security（RLS）の設定
- Database Functions活用

### 6. 認証実装
- 管理ページのベーシック認証
- 環境変数での認証情報管理

## 開発フェーズ

### Phase 1: 基盤構築
- データベーステーブル作成
- MCP Server設定とSupabase接続
- 基本的なCRUD API実装（Server Actions）
- 管理ページの認証実装

### Phase 2: 予約投稿システム
- 予約投稿機能のデータベース設計
- Cron Job実装
- 自動公開システム構築
- リアルタイム更新機能

### Phase 3: エディタ機能
- Tiptapエディタの実装（Client Component）
- 画像アップロード機能
- 下書き保存機能
- 予約投稿UI実装

### Phase 4: フロントエンド最適化
- Server Componentsでのブログ一覧実装
- ISRでの記事詳細ページ実装
- ナビゲーション追加
- Streaming SSR対応

### Phase 5: 管理機能
- 管理画面UI実装（Server Components + Client Components）
- 記事管理機能
- 予約投稿管理機能
- プレビュー機能

## 非機能要件

### パフォーマンス
- **Server Components活用**:
  - 初期ページ読み込み速度: 1.5秒以内
  - Core Web Vitals指標の最適化
  - バンドルサイズの最小化
- **キャッシュ戦略**:
  - ISR（Incremental Static Regeneration）
  - CDN活用
  - Database Connection Pooling
- **画像最適化**:
  - Next.js Image Component
  - WebP/AVIF形式対応
  - Responsive Images

### SEO対応
- メタタグの動的生成
- 構造化データの実装
- サイトマップの自動生成

### セキュリティ
- 管理ページの適切な認証
- XSS対策
- SQLインジェクション対策

## 参考技術ドキュメント
- [Tiptap公式ドキュメント](https://tiptap.dev/)
- [Supabase公式ドキュメント](https://supabase.com/docs)
- [Next.js公式ドキュメント](https://nextjs.org/docs)（フレームワーク使用時）