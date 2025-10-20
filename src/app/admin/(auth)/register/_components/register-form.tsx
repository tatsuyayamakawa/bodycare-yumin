"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import PasswordInput from "./password-input";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { registerAction } from "@/lib/actions/admin-auth";

const registerFormSchema = z
  .object({
    name: z.string().min(1, "お名前を入力してください"),
    password: z.string().min(8, "パスワードは8文字以上で入力してください"),
    confirmPassword: z.string().min(1, "パスワード確認を入力してください"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerFormSchema>;

interface RegisterFormProps {
  token: string;
}

export default function RegisterForm({ token }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (values: RegisterFormData) => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("password", values.password);
      formData.append("confirmPassword", values.confirmPassword);
      formData.append("token", token);

      const result = await registerAction(formData);

      if (result.success) {
        toast.success(result.message);
        router.push("/admin");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Register error:", error);
      toast.error("アカウント作成に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="mt-10" aria-labelledby="register-form-heading">
      <h2 id="register-form-heading" className="sr-only">
        アカウント登録フォーム
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  お名前
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="山田太郎"
                    autoComplete="name"
                    disabled={isLoading}
                    className="h-12 rounded-lg"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  パスワード
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    placeholder="8文字以上で入力"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  パスワード確認
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    placeholder="パスワードを再入力"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-8">
            <Button
              type="submit"
              disabled={isLoading}
              className="h-12 w-full rounded-lg bg-gradient-to-r from-green-600 to-blue-600 text-sm font-semibold"
            >
              {isLoading ? (
                <>
                  <div
                    className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                    aria-hidden="true"
                  />
                  作成中...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" aria-hidden="true" />
                  アカウント作成
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>

      <footer className="mt-10 text-center">
        <p className="mb-2 text-xs text-gray-500">
          既にアカウントをお持ちの場合は
          <Link
            href="/admin/login"
            className="ml-1 font-medium text-blue-600 hover:text-blue-800"
          >
            ログイン
          </Link>
        </p>
      </footer>
    </section>
  );
}
