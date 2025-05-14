"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { ExternalToast } from "sonner";
import { toast } from "sonner";
import type { z } from "zod";

import sendEmail from "../../_lib/action";
import { contactFormData } from "../../_lib/constants";

import FormFields from "./form-fields";
import SubmitButton from "./submit-button";

import Breadcrumb from "@/components/common/breadcrumb";
import Heading from "@/components/common/heading";
import Section from "@/components/common/section";
import { Form } from "@/components/ui/form";
import { Toaster } from "@/components/ui/sonner";
import { ContactFormSchema } from "@/schema/contact-form-schema";

type FormValues = z.infer<typeof ContactFormSchema>;

// カスタムCSS変数を持つスタイル
const customErrorStyle: React.CSSProperties = {
  backgroundColor: "rgb(220, 38, 38)", // bg-red-600に相当する赤色
  color: "white",
  border: "1px solid rgba(255, 255, 255, 0.1)",
};

// エラー時のカスタムToastオプション
const errorToastOptions: ExternalToast = {
  duration: 5000,
  style: customErrorStyle,
};

export default function ContactForm() {
  const { title, messages } = contactFormData;

  const form = useForm<FormValues>({
    mode: "onChange",
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      telephone: "",
      body: "",
      terms: false,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const loadingToastId = toast.loading(messages.loading.title);

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
      const result = await sendEmail(formData);

      if (result?.success) {
        toast.success(messages.success.title, {
          description: messages.success.description,
        });
        form.reset();
      } else {
        // エラーメッセージの取得
        let customErrorMessage: string | undefined;

        if (result?.error && "message" in result.error) {
          customErrorMessage = result.error.message as string;
          console.error("送信エラー:", result.error);
        }

        // エラー時はカスタムスタイルでエラーメッセージを表示
        toast.error(messages.error.title, {
          description: customErrorMessage || messages.error.description,
          ...errorToastOptions,
        });
      }
    } catch (error) {
      console.error("予期せぬエラー:", error);

      // 予期せぬエラー時もカスタムスタイルでエラーメッセージを表示
      toast.error(messages.error.title, {
        description: messages.error.description,
        ...errorToastOptions,
      });
    } finally {
      toast.dismiss(loadingToastId);
    }
  });

  return (
    <div className="lg:bg-brand-secondary mt-[64px] md:mt-[76px] md:p-[var(--spacing-md)] lg:mt-[100px]">
      <Section className="bg-background py-[var(--spacing-xs)] md:rounded-lg lg:max-w-5xl lg:p-[var(--spacing-md)]">
        <Breadcrumb>{title.heading}</Breadcrumb>
        <Heading heading={title.heading} subheading={title.subheading} center />
        <div className="xl:border-border mt-[var(--spacing-sm)] rounded-lg xl:mt-[var(--spacing-md)] xl:border xl:p-[var(--spacing-md)]">
          <Toaster richColors />
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-[var(--spacing-xs)]">
              <FormFields form={form} />
              <SubmitButton
                isValid={form.formState.isValid}
                isSubmitting={form.formState.isSubmitting}
              />
            </form>
          </Form>
        </div>
      </Section>
    </div>
  );
}
