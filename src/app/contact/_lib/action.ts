"use server";

import { Resend } from "resend";

import { EmailTemplate } from "../(components)/email-template";

import { appInfo, contactInfo } from "@/constants/data";
import { ContactFormSchema } from "@/schema/contact-form-schema";

type SendEmailResponse =
  | { success: true; data: unknown }
  | { success: false; error: { message: string; details?: unknown } };

export default async function sendEmail(
  data: FormData,
): Promise<SendEmailResponse> {
  const { name, domain } = appInfo;
  const { email } = contactInfo;
  const parsedData = Object.fromEntries(
    Array.from(data.entries()).map(([key, value]) => [
      key,
      key === "terms" ? value === "true" : value.toString(),
    ]),
  );
  const result = ContactFormSchema.safeParse(parsedData);

  if (!result.success) {
    return {
      success: false,
      error: {
        message: "入力内容に問題があります。",
        details: result.error.format(),
      },
    };
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data: emailData, error } = await resend.emails.send({
      from: `${name} <thanks@${domain}>`,
      to: [result.data.email, email],
      subject: "お問い合わせを受け付けました",
      react: EmailTemplate(result.data),
    });

    if (error) {
      console.error("Resend API エラー:", error);
      return {
        success: false,
        error: {
          message: "メール送信に失敗しました。" + (error.message || ""),
          details: error,
        },
      };
    }

    return { success: true, data: emailData };
  } catch (error) {
    console.error("メール送信エラー:", error);
    const errorMessage =
      error instanceof Error ? error.message : "不明なエラーが発生しました";

    return {
      success: false,
      error: {
        message: "メール送信に失敗しました。" + errorMessage,
        details: error,
      },
    };
  }
}
