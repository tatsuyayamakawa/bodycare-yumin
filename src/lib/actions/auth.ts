/**
 * 認証関連のServer Actions
 */

'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createClient as createClientHelper } from '@/lib/supabase/client-helpers';

/**
 * メールアドレスでサインアップ
 */
export async function signUpWithEmail(formData: FormData) {
  const supabase = createClientHelper();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string | null;

  // バリデーション
  if (!email || !password || !name) {
    return {
      success: false,
      error: 'メールアドレス、パスワード、お名前は必須です',
    };
  }

  if (password.length < 8) {
    return {
      success: false,
      error: 'パスワードは8文字以上で入力してください',
    };
  }

  // Supabase Authでユーザー作成
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        phone,
      },
    },
  });

  if (authError) {
    console.error('Sign up error:', authError);
    return {
      success: false,
      error: authError.message === 'User already registered'
        ? 'このメールアドレスは既に登録されています'
        : 'アカウントの作成に失敗しました',
    };
  }

  if (!authData.user) {
    return {
      success: false,
      error: 'アカウントの作成に失敗しました',
    };
  }

  // customersテーブルにレコード作成
  const adminSupabase = createClient();
  const { error: customerError } = await adminSupabase
    .from('customers')
    .insert({
      user_id: authData.user.id,
      email,
      name,
      phone,
    });

  if (customerError) {
    console.error('Customer creation error:', customerError);
    // 認証は成功しているが、顧客レコード作成に失敗
    // ログイン後に再試行できるようにする
  }

  revalidatePath('/');
  redirect('/booking/services');
}

/**
 * メールアドレスでサインイン
 */
export async function signInWithEmail(formData: FormData) {
  const supabase = createClientHelper();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return {
      success: false,
      error: 'メールアドレスとパスワードを入力してください',
    };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Sign in error:', error);
    return {
      success: false,
      error: 'メールアドレスまたはパスワードが正しくありません',
    };
  }

  revalidatePath('/');
  redirect('/booking/services');
}

/**
 * サインアウト
 */
export async function signOut() {
  const supabase = createClientHelper();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Sign out error:', error);
    return {
      success: false,
      error: 'サインアウトに失敗しました',
    };
  }

  revalidatePath('/');
  redirect('/');
}

/**
 * 現在のユーザー情報を取得
 */
export async function getCurrentUser() {
  const supabase = createClientHelper();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  // customersテーブルから詳細情報を取得
  const adminSupabase = createClient();
  const { data: customer } = await adminSupabase
    .from('customers')
    .select('*')
    .eq('user_id', user.id)
    .single();

  return {
    id: user.id,
    email: user.email!,
    name: user.user_metadata.name || customer?.name || '',
    phone: user.user_metadata.phone || customer?.phone || null,
    customer,
  };
}

/**
 * パスワードリセットメールを送信
 */
export async function sendPasswordResetEmail(formData: FormData) {
  const supabase = createClientHelper();

  const email = formData.get('email') as string;

  if (!email) {
    return {
      success: false,
      error: 'メールアドレスを入力してください',
    };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
  });

  if (error) {
    console.error('Password reset error:', error);
    return {
      success: false,
      error: 'パスワードリセットメールの送信に失敗しました',
    };
  }

  return {
    success: true,
    message: 'パスワードリセット用のメールを送信しました',
  };
}

/**
 * パスワードを更新
 */
export async function updatePassword(formData: FormData) {
  const supabase = createClientHelper();

  const password = formData.get('password') as string;

  if (!password) {
    return {
      success: false,
      error: 'パスワードを入力してください',
    };
  }

  if (password.length < 8) {
    return {
      success: false,
      error: 'パスワードは8文字以上で入力してください',
    };
  }

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    console.error('Password update error:', error);
    return {
      success: false,
      error: 'パスワードの更新に失敗しました',
    };
  }

  revalidatePath('/');
  redirect('/booking/services');
}
