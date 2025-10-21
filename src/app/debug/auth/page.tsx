"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AuthDebugPage() {
  const [email, setEmail] = useState("editor@bodycare-yumin.com");
  const [password, setPassword] = useState("editor123");
  const [result, setResult] = useState<unknown | null>(null);
  const [loading, setLoading] = useState(false);
  const [fixResult, setFixResult] = useState<unknown | null>(null);
  const [fixing, setFixing] = useState(false);

  const testAuth = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/debug/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: "Request failed", details: String(error) });
    } finally {
      setLoading(false);
    }
  };

  const fixPasswords = async () => {
    setFixing(true);
    try {
      const response = await fetch("/api/debug/fix-passwords", {
        method: "POST",
      });

      const data = await response.json();
      setFixResult(data);
    } catch (error) {
      setFixResult({ error: "Fix failed", details: String(error) });
    } finally {
      setFixing(false);
    }
  };

  // 開発環境でのみ表示
  if (process.env.NODE_ENV !== "development") {
    return (
      <div className="p-8">
        <h1>This page is only available in development mode</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-2xl px-4">
        <h1 className="mb-8 text-3xl font-bold">認証デバッグツール</h1>

        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={testAuth} disabled={loading} className="flex-1">
                {loading ? "テスト中..." : "認証をテスト"}
              </Button>
              <Button
                onClick={fixPasswords}
                disabled={fixing}
                variant="outline"
                className="flex-1"
              >
                {fixing ? "修正中..." : "パスワードハッシュを修正"}
              </Button>
            </div>
          </div>
        </Card>

        {!!result && (
          <Card className="mt-6 p-6">
            <h2 className="mb-4 text-xl font-semibold">テスト結果</h2>
            <pre className="overflow-x-auto bg-gray-100 p-4 text-sm whitespace-pre-wrap">
              {JSON.stringify(result, null, 2)}
            </pre>
          </Card>
        )}

        {!!fixResult && (
          <Card className="mt-6 p-6">
            <h2 className="mb-4 text-xl font-semibold">パスワード修正結果</h2>
            <pre className="overflow-x-auto bg-gray-100 p-4 text-sm whitespace-pre-wrap">
              {JSON.stringify(fixResult, null, 2)}
            </pre>
          </Card>
        )}

        <div className="mt-6 rounded-lg bg-blue-50 p-4">
          <h3 className="font-semibold text-blue-900">テスト用アカウント</h3>
          <div className="mt-2 text-sm text-blue-700">
            <p>
              <strong>管理者:</strong> admin@bodycare-yumin.com / admin123
            </p>
            <p>
              <strong>編集者:</strong> editor@bodycare-yumin.com / editor123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
