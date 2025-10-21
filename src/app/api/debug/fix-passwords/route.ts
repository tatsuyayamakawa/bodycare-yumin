import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function POST() {
  // 開発環境でのみ実行
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  try {
    console.log('🔄 Fixing password hashes...')

    // admin123のハッシュを生成
    const adminHash = await bcrypt.hash('admin123', 12)
    console.log('Generated admin hash:', adminHash)

    // editor123のハッシュを生成
    const editorHash = await bcrypt.hash('editor123', 12)
    console.log('Generated editor hash:', editorHash)

    // 管理者のパスワードハッシュを更新
    const { error: adminError } = await supabaseAdmin
      .from('admin_users')
      .update({ password_hash: adminHash })
      .eq('email', 'admin@bodycare-yumin.com')

    if (adminError) {
      console.error('Admin update error:', adminError)
      return NextResponse.json({ error: 'Failed to update admin password' }, { status: 500 })
    }

    // 編集者のパスワードハッシュを更新
    const { error: editorError } = await supabaseAdmin
      .from('admin_users')
      .update({ password_hash: editorHash })
      .eq('email', 'editor@bodycare-yumin.com')

    if (editorError) {
      console.error('Editor update error:', editorError)
      return NextResponse.json({ error: 'Failed to update editor password' }, { status: 500 })
    }

    console.log('✅ Password hashes updated successfully')

    return NextResponse.json({
      success: true,
      message: 'Password hashes updated successfully',
      hashes: {
        admin: adminHash,
        editor: editorHash
      }
    })

  } catch (error) {
    console.error('Fix passwords error:', error)
    return NextResponse.json({ 
      error: 'Failed to fix passwords',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}