const { createClient } = require('@supabase/supabase-js')

// 環境変数を直接設定してテスト
// 実際の値に置き換えてください
const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseServiceKey = 'YOUR_SUPABASE_SERVICE_KEY'

console.log('環境変数を確認してから実行してください:')
console.log('SUPABASE_URL:', supabaseUrl)
console.log('SERVICE_KEY:', supabaseServiceKey ? '設定済み' : '未設定')

if (supabaseUrl === 'YOUR_SUPABASE_URL' || supabaseServiceKey === 'YOUR_SUPABASE_SERVICE_KEY') {
  console.error('❌ 環境変数を設定してください')
  console.log('このファイルを編集して実際のSupabase URLとService Keyを設定してください')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testConnection() {
  console.log('🔗 データベース接続テストを開始...')
  
  try {
    // ユーザー一覧取得
    const { data: users, error: userError } = await supabase
      .from('admin_users')
      .select('id, email, name, role, is_active, created_at')

    if (userError) {
      console.error('❌ ユーザー取得エラー:', userError.message)
      return
    }

    console.log('✅ ユーザーデータ取得成功:')
    if (users && users.length > 0) {
      users.forEach(user => {
        console.log(`  - ${user.name} (${user.email}) - ${user.role}`)
      })
    } else {
      console.log('  ユーザーが見つかりません')
    }

    console.log('🎉 テスト完了！')

  } catch (error) {
    console.error('❌ 予期しないエラー:', error.message)
  }
}

testConnection()