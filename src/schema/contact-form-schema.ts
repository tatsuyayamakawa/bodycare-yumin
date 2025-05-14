import { z } from "zod";

export const ContactFormSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "お名前は必須の項目です。",
    })
    .describe("お名前"),
  email: z
    .string()
    .min(1, {
      message: "メールアドレスは必須の項目です。",
    })
    .email({ message: "正しいメールアドレスの形式で入力してください。" })
    .describe("メールアドレス"),
  telephone: z
    .string()
    .min(1, {
      message: "電話番号は必須の項目です。",
    })
    .regex(
      /^(0[5-9]0[-(]?[0-9]{4}[-)]?[0-9]{4}|0120[-]?\d{1,3}[-]?\d{4}|050[-]?\d{4}[-]?\d{4}|0[1-9][-]?\d{1,4}[-]?\d{1,4}[-]?\d{4})*$/,
      { message: "正しい電話番号の形式で入力してください。" },
    )
    .describe("電話番号"),
  body: z
    .string()
    .min(1, {
      message: "お問い合わせ内容は必須の項目です。",
    })
    .describe("お問い合わせ内容"),
  terms: z
    .boolean()
    .refine((value) => value === true, {
      message: "プライバシーポリシーの同意が必要です。",
    })
    .describe("プライバシーポリシーに同意する"),
});

export type ContactFormData = z.infer<typeof ContactFormSchema>;
