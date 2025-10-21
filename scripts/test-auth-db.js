// データベース接続テストスクリプト
// 使用方法: node scripts/test-auth-db.js

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// .env.localファイルを読み込み
const envPath = path.join(__dirname, '..', '.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')

const envVars = {}
envContent.split('
').forEach(line => {
  const [key, ...valueParts] = line.split('=')
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim()
  }
})

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Supabase環境変数が設定されていません')
  console.log('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl)
  console.log('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey)
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testConnection() {
  console.log('🔗 データベース接続テストを開始...')
  
  try {
    // テーブル存在確認
    const { data: tables, error: tableError } = await supabase
      .from('admin_users')
      .select('count', { count: 'exact', head: true })

    if (tableError) {
      console.error('❌ テーブルアクセスエラー:', tableError.message)
      return
    }

    console.log('✅ admin_usersテーブルにアクセス成功')

    // ユーザー一覧取得
    const { data: users, error: userError } = await supabase
      .from('admin_users')
      .select('id, email, name, role, is_active, created_at')

    if (userError) {
      console.error('❌ ユーザー取得エラー:', userError.message)
      return
    }

    console.log('✅ ユーザーデータ取得成功:')
    users.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) - ${user.role}`)
    })

    // セッションテーブル確認
    const { data: sessions, error: sessionError } = await supabase
      .from('admin_sessions')
      .select('count', { count: 'exact', head: true })

    if (sessionError) {
      console.error('❌ セッションテーブルエラー:', sessionError.message)
      return
    }

    console.log('✅ admin_sessionsテーブルにアクセス成功')

    // 招待テーブル確認
    const { data: invitations, error: invitationError } = await supabase
      .from('admin_invitations')
      .select('count', { count: 'exact', head: true })

    if (invitationError) {
      console.error('❌ 招待テーブルエラー:', invitationError.message)
      return
    }

    console.log('✅ admin_invitationsテーブルにアクセス成功')
    console.log('🎉 すべてのテストが成功しました！')

  } catch (error) {
    console.error('❌ 予期しないエラー:', error.message)
  }
}

testConnection()