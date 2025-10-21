# GA4 Analytics Dashboard 実装計画

## 概要
Google Analytics 4 (GA4) のリアルタイムデータを取得し、管理画面でアクセス数グラフとページ別アクセス数リストを表示するダッシュボードを実装する。

## 実装するページ
- URL: `/admin/analytics`
- 管理者のみアクセス可能

## 必要な機能

### 1. リアルタイムアクセス数グラフ
- 時系列でアクティブユーザー数を表示
- 過去24時間または直近の数時間のデータ
- チャートライブラリを使用（Recharts推奨）

### 2. ページ別アクセス数リスト
- ページパス別のアクセス数
- アクセス数順でソート
- 視覚的に分かりやすいUI

## 技術要件

### GA4 API設定
1. **Google Cloud Console設定**
   - プロジェクト作成
   - Google Analytics Data API有効化
   - サービスアカウント作成
   - 認証キー（JSON）ダウンロード

2. **GA4プロパティ設定**
   - サービスアカウントをGA4プロパティに追加
   - 閲覧者権限付与

### 環境変数
```env
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json
GA4_PROPERTY_ID=your-property-id
```

### 必要なパッケージ
```json
{
  "@google-analytics/data": "^4.0.0",
  "recharts": "^2.8.0"
}
```

## 実装手順

### Phase 1: API設定とバックエンド
1. **Google Cloud & GA4設定**
   - サービスアカウント作成
   - 認証キー設定
   - GA4プロパティ接続

2. **API Route作成**
   - `/api/analytics/realtime` - リアルタイムデータ取得
   - `/api/analytics/pages` - ページ別アクセス数取得

3. **データ取得ロジック**
   - GA4 Data API クライアント初期化
   - リアルタイムレポート取得関数
   - ページビューデータ取得関数

### Phase 2: フロントエンド実装
1. **ページ作成**
   - `src/app/admin/analytics/page.tsx`
   - 認証チェック機能

2. **コンポーネント作成**
   - `RealtimeChart` - アクセス数グラフ
   - `PageAccessList` - ページ別リスト
   - `AnalyticsDashboard` - メインダッシュボード

3. **データフェッチング**
   - SWR または React Query使用
   - 自動更新機能（30秒〜1分間隔）

### Phase 3: UI/UX改善
1. **レスポンシブデザイン**
   - モバイル対応
   - グリッドレイアウト

2. **ローディング状態**
   - スケルトンローダー
   - エラーハンドリング

3. **フィルタリング機能**
   - 時間範囲選択
   - ページタイプフィルター

## ファイル構成
```
src/
├── app/
│   └── admin/
│       └── analytics/
│           ├── page.tsx
│           └── components/
│               ├── realtime-chart.tsx
│               ├── page-access-list.tsx
│               └── analytics-dashboard.tsx
├── api/
│   └── analytics/
│       ├── realtime/
│       │   └── route.ts
│       └── pages/
│           └── route.ts
└── lib/
    └── ga4-client.ts
```

## セキュリティ考慮事項
- サービスアカウントキーの安全な管理
- 管理者権限チェック
- API レート制限対策
- 環境変数の適切な設定

## 無料枠内での運用
- 月25,000リクエスト以内
- 1時間あたり約34リクエスト以下
- 2分間隔での更新推奨

## 今後の拡張可能性
- より詳細な分析データ
- カスタムイベント追跡
- レポート機能
- データエクスポート機能