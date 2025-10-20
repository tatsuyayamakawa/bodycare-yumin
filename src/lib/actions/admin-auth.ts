/**
 * 管理画面用認証関連のServer Actions
 */

'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase/server';
import { verifyPassword, generateSessionToken, setSessionCookie, clearSessionCookie } from '@/lib/auth/session';
import { logLoginSuccess, logLogout, logLoginFailure } from '@/lib/utils/login-log';

/**
 * 管理者ログイン
 */
export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return {
      success: false,
      error: 'メールアドレスとパスワードを入力してください',
    };
  }

  try {
    // ユーザーを取得
    const { data: user, error: userError } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .single();

    if (userError || !user) {
      await logLoginFailure(email, 'User not found');
      return {
        success: false,
        error: 'メールアドレスまたはパスワードが正しくありません',
      };
    }

    if (!user.is_active) {
      await logLoginFailure(email, 'User is inactive');
      return {
        success: false,
        error: 'このアカウントは無効化されています',
      };
    }

    // パスワード検証
    const isValidPassword = await verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      await logLoginFailure(email, 'Invalid password');
      return {
        success: false,
        error: 'メールアドレスまたはパスワードが正しくありません',
      };
    }

    // セッショントークン生成
    const token = generateSessionToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24時間後

    // セッションを保存
    const { error: sessionError } = await supabaseAdmin
      .from('admin_sessions')
      .insert({
        user_id: user.id,
        token,
        expires_at: expiresAt.toISOString(),
      });

    if (sessionError) {
      console.error('Session creation error:', sessionError);
      return {
        success: false,
        error: 'セッションの作成に失敗しました',
      };
    }

    // Cookieにセッショントークンを設定
    const sessionCookie = setSessionCookie(token);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.options
    );

    // ログイン成功を記録
    await logLoginSuccess(user.id);

    return {
      success: true,
      message: 'ログインしました',
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'ログインに失敗しました',
    };
  }
}

/**
 * 管理者ログアウト
 */
export async function logoutAction() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('admin-session')?.value;

    if (token) {
      // セッションを取得してユーザーIDを確認
      const { data: session } = await supabaseAdmin
        .from('admin_sessions')
        .select('user_id')
        .eq('token', token)
        .single();

      // セッションを削除
      await supabaseAdmin
        .from('admin_sessions')
        .delete()
        .eq('token', token);

      // ログアウトを記録
      if (session?.user_id) {
        await logLogout(session.user_id);
      }
    }

    // Cookieをクリア
    const sessionCookie = clearSessionCookie();
    cookieStore.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.options
    );

    return {
      success: true,
      message: 'ログアウトしました',
    };
  } catch (error) {
    console.error('Logout error:', error);
    return {
      success: false,
      error: 'ログアウトに失敗しました',
    };
  }
}

/**
 * 管理者認証が必要なページで使用
 */
export async function requireAdminAuth() {
  const cookieStore = cookies();
  const token = cookieStore.get('admin-session')?.value;

  if (!token) {
    redirect('/admin/login');
  }

  // セッションを確認
  const { data: session, error: sessionError } = await supabaseAdmin
    .from('admin_sessions')
    .select('*')
    .eq('token', token)
    .single();

  if (sessionError || !session) {
    redirect('/admin/login');
  }

  // セッションの有効期限を確認
  if (new Date(session.expires_at) < new Date()) {
    // 期限切れセッションを削除
    await supabaseAdmin
      .from('admin_sessions')
      .delete()
      .eq('token', token);
    
    redirect('/admin/login');
  }

  // ユーザー情報を取得
  const { data: user, error: userError } = await supabaseAdmin
    .from('admin_users')
    .select('*')
    .eq('id', session.user_id)
    .single();

  if (userError || !user || !user.is_active) {
    redirect('/admin/login');
  }

  return user;
}

/**
 * ユーザー招待
 */
export async function inviteUserAction(formData: FormData) {
  const email = formData.get('email') as string;
  const name = formData.get('name') as string;
  const role = formData.get('role') as 'admin' | 'editor';

  if (!email || !name || !role) {
    return {
      success: false,
      error: '全ての項目を入力してください',
    };
  }

  try {
    // 既存ユーザーチェック
    const { data: existingUser } = await supabaseAdmin
      .from('admin_users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return {
        success: false,
        error: 'このメールアドレスは既に登録されています',
      };
    }

    // 招待トークン生成
    const { generateInvitationToken } = await import('@/lib/auth/session');
    const token = generateInvitationToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7日後

    // 招待を保存
    const { error: inviteError } = await supabaseAdmin
      .from('admin_invitations')
      .insert({
        email,
        name,
        role,
        token,
        expires_at: expiresAt.toISOString(),
      });

    if (inviteError) {
      console.error('Invitation creation error:', inviteError);
      return {
        success: false,
        error: '招待の作成に失敗しました',
      };
    }

    // TODO: メール送信処理を追加
    const inviteUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/admin/register?token=${token}`;

    return {
      success: true,
      message: '招待メールを送信しました',
      inviteUrl,
    };
  } catch (error) {
    console.error('Invite user error:', error);
    return {
      success: false,
      error: 'ユーザー招待に失敗しました',
    };
  }
}

/**
 * 招待トークンの検証
 */
export async function verifyInvitationAction(token: string) {
  try {
    const { data: invitation, error } = await supabaseAdmin
      .from('admin_invitations')
      .select('*')
      .eq('token', token)
      .single();

    if (error || !invitation) {
      return {
        success: false,
        error: '無効な招待リンクです',
      };
    }

    if (invitation.used_at) {
      return {
        success: false,
        error: 'この招待リンクは既に使用されています',
      };
    }

    if (new Date(invitation.expires_at) < new Date()) {
      return {
        success: false,
        error: '招待リンクの有効期限が切れています',
      };
    }

    return {
      success: true,
      invitation: {
        email: invitation.email,
        name: invitation.name,
        role: invitation.role,
      },
    };
  } catch (error) {
    console.error('Verify invitation error:', error);
    return {
      success: false,
      error: '招待の確認に失敗しました',
    };
  }
}

/**
 * ユーザー登録
 */
export async function registerAction(formData: FormData) {
  const token = formData.get('token') as string;
  const password = formData.get('password') as string;

  if (!token || !password) {
    return {
      success: false,
      error: '必要な情報が不足しています',
    };
  }

  if (password.length < 8) {
    return {
      success: false,
      error: 'パスワードは8文字以上で入力してください',
    };
  }

  try {
    // 招待を確認
    const { data: invitation, error: inviteError } = await supabaseAdmin
      .from('admin_invitations')
      .select('*')
      .eq('token', token)
      .single();

    if (inviteError || !invitation || invitation.used_at) {
      return {
        success: false,
        error: '無効または使用済みの招待です',
      };
    }

    // パスワードをハッシュ化
    const { hashPassword } = await import('@/lib/auth/session');
    const passwordHash = await hashPassword(password);

    // ユーザーを作成
    const { error: userError } = await supabaseAdmin
      .from('admin_users')
      .insert({
        email: invitation.email,
        name: invitation.name,
        role: invitation.role,
        password_hash: passwordHash,
        is_active: true,
      });

    if (userError) {
      console.error('User creation error:', userError);
      return {
        success: false,
        error: 'ユーザーの作成に失敗しました',
      };
    }

    // 招待を使用済みにする
    await supabaseAdmin
      .from('admin_invitations')
      .update({ used_at: new Date().toISOString() })
      .eq('token', token);

    return {
      success: true,
      message: 'アカウントを作成しました',
    };
  } catch (error) {
    console.error('Register error:', error);
    return {
      success: false,
      error: 'アカウント作成に失敗しました',
    };
  }
}
