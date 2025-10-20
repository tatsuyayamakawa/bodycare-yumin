/**
 * ログインページ
 */

import { Metadata } from 'next';
import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = {
  title: 'ログイン | ボディケアゆみん',
  description: 'ボディケアゆみんのログインページです。',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            ログイン
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            予約やご利用履歴の確認ができます
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
