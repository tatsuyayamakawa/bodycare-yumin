// テストユーザー作成スクリプト
const bcrypt = require('bcryptjs')

async function generateHash() {
  const password = 'admin123'
  const hash = await bcrypt.hash(password, 12)
  
  console.log('パスワード:', password)
  console.log('ハッシュ:', hash)
  console.log('\n以下のSQLをSupabaseで実行してください:')
  console.log(`
-- 既存ユーザーのパスワードを更新
UPDATE admin_users 
SET password_hash = '${hash}'
WHERE email = 'admin@bodycare-yumin.com';

-- または新しいテストユーザーを作成
INSERT INTO admin_users (email, name, password_hash, role) 
VALUES (
  'test@bodycare-yumin.com',
  'テスト管理者',
  '${hash}',
  'admin'
) ON CONFLICT (email) DO UPDATE SET 
  password_hash = EXCLUDED.password_hash;
`)
}

generateHash().catch(console.error)