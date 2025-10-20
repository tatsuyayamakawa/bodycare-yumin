/**
 * 新規登録フォームコンポーネント
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signUpWithEmail } from '@/lib/actions/auth';

export function SignUpForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError('パスワードが一致しません');
      setLoading(false);
      return;
    }

    const result = await signUpWithEmail(formData);

    if (result && !result.success) {
      setError(result.error);
      setLoading(false);
    }
    // 成功時はリダイレクトされるのでローディング状態は解除しない
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          お名前 <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="山田 太郎"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          メールアドレス <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="example@email.com"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
          電話番号
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="090-1234-5678"
        />
        <p className="mt-1 text-xs text-gray-500">
          予約確認のご連絡に使用します
        </p>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          パスワード <span className="text-red-500">*</span>
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="8文字以上"
        />
        <p className="mt-1 text-xs text-gray-500">
          8文字以上で入力してください
        </p>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
          パスワード（確認） <span className="text-red-500">*</span>
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="パスワードを再入力"
        />
      </div>

      <div className="flex items-start">
        <input
          id="terms"
          name="terms"
          type="checkbox"
          required
          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mt-1"
        />
        <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
          <Link href="/privacy" className="text-primary hover:text-primary/80">
            プライバシーポリシー
          </Link>
          に同意します
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {loading ? '登録中...' : '新規登録'}
      </button>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          既にアカウントをお持ちの方は
          <Link href="/auth/login" className="text-primary hover:text-primary/80 font-medium ml-1">
            ログイン
          </Link>
        </p>
      </div>
    </form>
  );
}
