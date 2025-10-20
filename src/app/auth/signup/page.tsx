/**
 * 新規登録ページ
 */

import { Metadata } from 'next';
import { SignUpForm } from '@/components/auth/signup-form';

export const metadata: Metadata = {
  title: '新規登録 | ボディケアゆみん',
  description: 'ボディケアゆみんの新規会員登録ページです。',
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            新規会員登録
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            アカウントを作成して予約を始めましょう
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}
