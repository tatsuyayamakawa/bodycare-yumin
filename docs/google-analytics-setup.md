# Google Analytics 4 連携セットアップガイド

## 概要
このガイドでは、ブログシステムにGoogle Analytics 4 (GA4) APIを統合し、リアルタイムのアクセス数をダッシュボードに表示する方法を説明します。

## 前提条件
- Google Analytics 4プロパティが設定済み
- Google Cloud Projectへのアクセス権限
- Supabaseデータベースへのアクセス権限

## セットアップ手順

### 1. Google Cloud Console での設定

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 新しいプロジェクトを作成するか、既存のプロジェクトを選択
3. **APIs & Services > Library** で "Google Analytics Reporting API" と "Google Analytics Data API" を有効化
4. **APIs & Services > Credentials** でサービスアカウントを作成
5. サービスアカウントキー（JSON）をダウンロード

### 2. Google Analytics での設定

1. GA4プロパティの管理画面にアクセス
2. **管理 > プロパティアクセス管理** でサービスアカウントのメールアドレスを追加
3. 「閲覧者」権限を付与
4. プロパティIDをメモ（例：123456789）

### 3. 環境変数の設定

`.env.local` ファイルに以下を追加：

```env
# Google Analytics 4
GA4_PROPERTY_ID=your_property_id
GOOGLE_ANALYTICS_CREDENTIALS='{"type":"service_account","project_id":"your-project","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}'

# Cron認証（オプション）
CRON_SECRET=your_random_secret_string
```

**注意**: `GOOGLE_ANALYTICS_CREDENTIALS` はダウンロードしたJSONファイルの内容を1行にして設定してください。

### 4. データベースマイグレーション

提供されたSQLファイルを実行してGA4用のカラムを追加：

```bash
# Supabaseの場合
psql -h your-supabase-host -U postgres -d postgres -f scripts/add-analytics-columns.sql
```

### 5. 依存関係のインストール

```bash
npm install
# または
bun install
```

### 6. 動作確認

```bash
# 開発サーバーを起動
npm run dev

# 手動同期テスト
curl -X POST http://localhost:3000/api/cron/sync-analytics \
  -H "Authorization: Bearer your_cron_secret"

# 同期状況確認
curl -X GET http://localhost:3000/api/cron/sync-analytics \
  -H "Authorization: Bearer your_cron_secret"
```

## 自動同期の設定

### Vercel Cron Jobs（推奨）

`vercel.json` に以下を追加：

```json
{
  "crons": [
    {
      "path": "/api/cron/sync-analytics",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

### 外部Cronサービス

1. [cron-job.org](https://cron-job.org) などのサービスを利用
2. 以下のURLを6時間ごとに実行するよう設定：
   ```
   POST https://your-domain.com/api/cron/sync-analytics
   Authorization: Bearer your_cron_secret
   ```

## 使用方法

### ダッシュボードでの確認
- 管理画面（`/admin`）で人気記事のアクセス数を確認
- GA4データが利用可能な場合は「GA」バッジが表示されます

### 手動同期
```typescript
import { syncAnalyticsData } from '@/lib/actions/sync-analytics';

const result = await syncAnalyticsData();
console.log(`${result.data?.syncedCount} articles synced`);
```

### 単一記事の同期
```typescript
import { syncSingleArticleAnalytics } from '@/lib/actions/sync-analytics';

const result = await syncSingleArticleAnalytics('article-id');
```

## トラブルシューティング

### よくある問題

1. **認証エラー**
   - サービスアカウントのJSONが正しく設定されているか確認
   - GA4プロパティにサービスアカウントが追加されているか確認

2. **データが表示されない**
   - プロパティIDが正しいか確認
   - 記事のスラッグがURLパスと一致しているか確認

3. **API制限エラー**
   - GA4 APIには1日の制限があります
   - 同期頻度を調整してください

### ログの確認

```bash
# Vercelの場合
vercel logs

# ローカル開発の場合
# コンソールログを確認
```

## セキュリティ考慮事項

- サービスアカウントキーは安全に保管
- CRON_SECRETは推測困難な文字列を使用
- 本番環境では環境変数を暗号化して保存
- 定期的にサービスアカウントキーをローテーション

## パフォーマンス最適化

- 大量の記事がある場合は、バッチサイズを調整
- 同期頻度を記事の更新頻度に合わせて調整
- キャッシュ戦略を検討

## 制限事項

- GA4 APIには1日のリクエスト制限があります
- リアルタイムデータは約24-48時間の遅延があります
- 過去のデータは制限があります（通常14ヶ月）