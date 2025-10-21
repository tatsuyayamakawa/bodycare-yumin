● spacing変数の使用箇所まとめ:

--spacing-xs: 24px (使用箇所: 7ファイル)

- contact-form: フォーム要素のpadding、spacing
- privacy-policy: ページレイアウト
- heading/constants: フォントスタイリング
- schedule-table: セルpadding
- review-card: カード幅計算
- price-card: カード幅計算
- treatment-policy/constants: 段落マージン

--spacing-sm: 36px (使用箇所: 12ファイル)

最も多く使用されている

- contact-form, privacy-policy: レイアウトマージン
- access/store-info: 店舗情報レイアウト
- customer-voice: カードレイアウト
- faq-item: アコーディオンpadding
- flow-chart-content: セクション間隔
- price-card: カードpadding
- profile: プロフィール要素
- empathy-list: 見出しマージン
- hero: ヒーロー要素
- nav/constants: ナビゲーション

--spacing-md: 48px (使用箇所: 8ファイル)

- contact-form, privacy-policy: ページレイアウト
- flow-chart-content: セクション間隔
- profile: プロフィール要素
- treatment-policy: 見出し・レイアウト
- hero: モバイル・デスクトップレイアウト
- header: ヘッダーpadding

--spacing-lg: 72px (使用箇所: 5ファイル)

- flow-chart-content: レスポンシブ間隔
- profile: プロフィールレイアウト
- treatment-policy: セクション間隔
- hero/desktop: ヒーローレイアウト

--spacing-xl: 144px (使用箇所: 1ファイルのみ)

- flow-chart-content: XLブレイクポイントでのマージンのみ

結論:

- --spacing-xlは最も使用頻度が低く、削除の影響が最小
- --spacing-smが最も広く使用されている
- 削除するなら--spacing-xlが最も安全
