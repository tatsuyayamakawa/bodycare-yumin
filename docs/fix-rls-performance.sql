-- RLSパフォーマンス警告を修正するためのスクリプト

-- 1. 既存のポリシーを削除
DROP POLICY IF EXISTS "Admin users can view activity logs" ON activity_logs;
DROP POLICY IF EXISTS "Admin users can insert activity logs" ON activity_logs;

-- 2. 最適化されたポリシーを作成
-- auth.uid()をサブクエリで囲むことで、各行ごとの再実行を防ぐ
CREATE POLICY "Admin users can view activity logs" ON activity_logs
    FOR SELECT USING (
        (SELECT auth.uid()) IN (
            SELECT id FROM admin_users WHERE is_active = true
        )
    );

CREATE POLICY "Admin users can insert activity logs" ON activity_logs
    FOR INSERT WITH CHECK (
        (SELECT auth.uid()) IN (
            SELECT id FROM admin_users WHERE is_active = true
        )
    );

-- 3. 確認用クエリ（実行後に結果を確認）
-- ポリシーが正しく設定されているかチェック
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'activity_logs';