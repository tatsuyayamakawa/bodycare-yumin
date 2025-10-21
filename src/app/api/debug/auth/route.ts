import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  // 開発環境でのみ実行
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  try {
    const { email, password } = await request.json()

    console.log('🔍 Debug Auth - Email:', email)
    console.log('🔍 Debug Auth - Password:', password)

    // ユーザーを取得
    const { data: user, error } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single()

    if (error || !user) {
      console.log('❌ User not found:', error?.message)
      return NextResponse.json({
        found: false,
        error: error?.message || 'User not found'
      })
    }

    console.log('✅ User found:', {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      is_active: user.is_active
    })

    console.log('🔐 Stored hash:', user.password_hash)

    // パスワード検証
    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    console.log('🔓 Password verification result:', isValidPassword)

    // テスト用の新しいハッシュを生成
    const newHash = await bcrypt.hash(password, 12)
    console.log('🆕 New hash for comparison:', newHash)

    return NextResponse.json({
      found: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        is_active: user.is_active
      },
      passwordValid: isValidPassword,
      storedHash: user.password_hash,
      newHashExample: newHash
    })

  } catch (error) {
    console.error('Debug auth error:', error)
    return NextResponse.json({ 
      error: 'Debug failed',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}