import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { Globe, Phone } from "lucide-react";

import { appInfo, contactInfo } from "@/constants/data";
import { getBaseURL } from "@/lib/utils";
import type { ContactFormData } from "@/schema/contact-form-schema";

const baseUrl = getBaseURL();
const currentYear = new Date().getFullYear();

export const EmailTemplate = ({
  name,
  email,
  telephone,
  body,
}: ContactFormData): React.ReactNode => {
  const { name: appName } = appInfo;
  const { phoneNumber } = contactInfo;

  return (
    <Html>
      <Head />
      <Preview>お問い合わせ内容のご確認です</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto my-6 w-[580px] max-w-full">
            <Section>
              <div className="mx-auto h-auto w-fit rounded-full bg-zinc-50">
                <Img
                  src="https://bodycare-yumin.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fhero-symbol.f0833dfd.png&w=640&q=75"
                  width="100"
                  height="100"
                  className="my-5 p-5"
                  alt={`${appName}のロゴ`}
                />
              </div>
            </Section>
            <Heading className="my-4 text-center text-2xl/normal font-bold text-neutral-900">
              お問い合わせありがとうございます
            </Heading>
            <Section className="mt-4 text-neutral-900">
              <Text className="mb-4 text-base/normal">{name} 様</Text>
              <Text className="mb-6 text-base/normal">
                下記の内容で受け付けました。
              </Text>
            </Section>
            <Section className="mt-4 rounded-lg bg-neutral-50 px-6 py-4 shadow-sm">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Text className="text-sm/normal font-medium text-neutral-900">
                      お名前
                    </Text>
                    <Text className="text-base/normal text-neutral-600">
                      {name}
                    </Text>
                  </div>
                  <div>
                    <Text className="text-sm/normal font-medium text-neutral-900">
                      メールアドレス
                    </Text>
                    <Text className="text-base/normal text-neutral-600">
                      {email}
                    </Text>
                  </div>
                  <div>
                    <Text className="text-sm/normal font-medium text-neutral-900">
                      電話番号
                    </Text>
                    <Text className="text-base/normal text-neutral-600">
                      {telephone}
                    </Text>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Text className="text-sm/normal font-medium text-neutral-900">
                      お問い合わせ内容
                    </Text>
                    <Text className="text-base/normal whitespace-pre-wrap text-neutral-600">
                      {body}
                    </Text>
                  </div>
                </div>
              </div>
            </Section>
            <Section className="mt-8 space-y-4 text-neutral-600">
              <Text className="text-base/normal">
                後ほど担当者よりご連絡いたします。お急ぎの場合は、下記の電話番号にご連絡ください。
              </Text>
              <Text className="text-base/normal">
                ご予約希望の方はオンラインもご利用ください。
              </Text>
              <div className="my-4">
                <Button
                  href={process.env.NEXT_PUBLIC_SQUARE_BOOKING}
                  className="block rounded-full bg-red-500 px-8 py-4 text-center text-lg/normal font-bold text-white no-underline shadow-sm transition-colors hover:bg-red-600"
                >
                  オンライン予約
                </Button>
              </div>
            </Section>
            <Hr className="my-8 w-full border border-solid border-neutral-300" />
            <Section className="space-y-2">
              <Text className="text-xs/normal text-neutral-600">{appName}</Text>
              <Text className="flex items-center text-xs/normal text-neutral-600">
                <Phone className="mr-2 h-4 w-4" />
                {phoneNumber}
              </Text>
              <Text className="flex items-center text-xs/normal text-neutral-600">
                <Globe className="mr-2 h-4 w-4" />
                <Link href={baseUrl} className="text-blue-500">
                  {baseUrl}
                </Link>
              </Text>
              <Text className="text-xs/normal text-neutral-600">
                このメールは送信専用のメールアドレスから送信されています。恐れ入りますが、このメールには返信しないようお願いいたします。
              </Text>
              <Text className="mt-4 text-center text-xs/normal text-neutral-500">
                © {currentYear} {appName}. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
