import Link from "next/link";

import { contactFormData } from "../../_lib/constants";

import type { FormFieldsProps } from "./types";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function FormFields({ form }: FormFieldsProps) {
  const { placeholders } = contactFormData;

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base/normal">
              お名前<span className="pl-1 text-red-500">*</span>
            </FormLabel>
            <FormControl className="mt-1">
              <Input
                placeholder={placeholders.name}
                {...field}
                className="h-10 shadow-none focus-visible:ring-1"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base/normal">
              メールアドレス
              <span className="pl-1 text-red-500">*</span>
            </FormLabel>
            <FormControl className="mt-1">
              <Input
                placeholder="seitai-taro@gmail.com"
                {...field}
                className="h-10 shadow-none focus-visible:ring-1"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="telephone"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base/normal">
              電話番号<span className="pl-1 text-red-500">*</span>
            </FormLabel>
            <FormControl className="mt-1">
              <Input
                placeholder="09012345678"
                {...field}
                className="h-10 shadow-none focus-visible:ring-1"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="body"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base/normal">
              お問い合わせ内容
              <span className="pl-1 text-red-500">*</span>
            </FormLabel>
            <FormControl className="mt-1">
              <Textarea
                {...field}
                className="h-[200px] w-full resize-none shadow-none focus-visible:ring-1"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="terms"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center space-x-2">
              <FormControl>
                <Input
                  type="checkbox"
                  {...field}
                  value={field.value ? "true" : "false"}
                  className="h-4 w-4"
                  checked={field.value}
                />
              </FormControl>
              <FormLabel className="text-base/normal">
                <Link
                  href="/privacy"
                  target="_blank"
                  className="underline hover:no-underline"
                >
                  プライバシーポリシー
                </Link>
                に同意する
                <span className="pl-1 text-red-500">*</span>
              </FormLabel>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
