# コンポーネント構造ガイド

## 基本方針

プロジェクト全体で、コンポーネントは **`index.tsx` 方式** で統一する。

## ディレクトリ構造

### components/ 配下

```
components/
  blog/
    article-card/
      index.tsx           # メインコンポーネント
      types.ts            # このコンポーネント専用の型定義
      constants.ts        # このコンポーネント専用の定数
      utils.ts            # ヘルパー関数（必要に応じて）
      index.test.tsx      # テストファイル（必要に応じて）
    article-list/
      index.tsx
      types.ts
```

### app/ 配下

Next.jsの特殊ファイル（`page.tsx`, `layout.tsx` など）は**フレームワークの規約に従う**。

ローカルコンポーネントは `components/` と同じ `index.tsx` 方式を採用。

```
app/
  admin/
    (dashboard)/
      layout.tsx                    # Next.js規約ファイル（そのまま）
      page.tsx                      # Next.js規約ファイル（そのまま）
      _components/                  # または (components)/
        dashboard-header/
          index.tsx                 # index.tsx方式で統一
          types.ts
          constants.ts
        dashboard-sidebar/
          index.tsx
          types.ts
```

## 命名規則

### フォルダ名
- ケバブケース（`article-card`, `dashboard-header`）

### コンポーネント名
- PascalCase（`ArticleCard`, `DashboardHeader`）
- 名前付きエクスポートを使用

```tsx
// ✅ 推奨
export const ArticleCard = () => { ... }

// ❌ 避ける
export default ArticleCard
```

## メリット

### 1. コロケーション（関連ファイルの近接配置）
関連するファイルが物理的に近くにあるため、認知負荷が低い

### 2. スコープの明確化
- `article-card/types.ts` → このコンポーネント専用と一目瞭然
- `types/article-card.ts` → グローバルな型定義と混同しやすい

### 3. 削除・移動が安全
フォルダごと削除すれば関連ファイルも一緒に消える。孤立ファイル（orphan files）が発生しにくい

### 4. インポートパスがクリーン
```tsx
import { ArticleCard } from '@/components/blog/article-card'
```

## ファイル検索の改善（VSCode設定）

`index.tsx` が大量に並ぶ問題を解決するため、以下の設定を追加:

```json
// .vscode/settings.json
{
  "workbench.editor.customLabels.patterns": {
    "**/index.tsx": "${dirname}/${filename}.${extname}"
  }
}
```

エディタのタブに `article-card/index.tsx` のように表示されるようになります。

## 例外

### Next.js App Routerの特殊ファイル
以下はフレームワークの規約に従い、`index.tsx` にしない:
- `page.tsx`
- `layout.tsx`
- `loading.tsx`
- `error.tsx`
- `not-found.tsx`
- `route.ts`
- その他Next.jsが認識する特殊ファイル

### シンプルなコンポーネント（オプション）
単一ファイルで完結し、今後も型定義や定数が増える見込みがない場合は、フラット構造も許容:

```
components/
  ui/
    button.tsx          # 非常にシンプルな場合のみ
```

ただし、基本的には**最初からフォルダ化**しておく方が、後からファイルを追加する際に楽。

## 移行作業のチェックリスト

- [ ] `components/` 配下のフラットなコンポーネントをフォルダ化
- [ ] `app/` 配下のローカルコンポーネントをフォルダ化
- [ ] インポートパスの更新
- [ ] VSCode設定の追加（`.vscode/settings.json`）
- [ ] テスト実行・動作確認

## 参考

- [Next.js App Router - File Conventions](https://nextjs.org/docs/app/building-your-application/routing#file-conventions)
- [Colocation - Grouping files by feature](https://nextjs.org/docs/app/building-your-application/routing/colocation)
