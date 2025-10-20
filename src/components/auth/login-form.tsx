/**
 * ログインフォームコンポーネント
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signInWithEmail } from '@/lib/actions/auth';

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const result = await signInWithEmail(formData);

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
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          メールアドレス
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
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          パスワード
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="8文字以上"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember"
            name="remember"
            type="checkbox"
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
            ログイン状態を保持
          </label>
        </div>

        <Link
          href="/auth/forgot-password"
          className="text-sm text-primary hover:text-primary/80"
        >
          パスワードをお忘れの方
        </Link>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {loading ? 'ログイン中...' : 'ログイン'}
      </button>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          アカウントをお持ちでない方は
          <Link href="/auth/signup" className="text-primary hover:text-primary/80 font-medium ml-1">
            新規登録
          </Link>
        </p>
      </div>
    </form>
  );
}
