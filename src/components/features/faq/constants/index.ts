import type { FaqData, FaqStyles } from "../types";

export const faqData: FaqData = {
  heading: "よくあるご質問",
  subheading: "FAQ",
  lists: [
    {
      question: "予約の取り方を教えてください",
      answer:
        "ご予約はお電話またはオンラインにて承っております。お電話での対応時間は9時から18時までとなっておりますが、オンライン予約は営業時間外でも受け付けておりますので大変便利です。ぜひご利用ください。",
    },
    {
      question: "予約のキャンセルはできますか？",
      answer:
        "前日までのキャンセルは可能です。当日のキャンセルは予約料金の半額、ご連絡なしの場合は全額のご請求となります。なお、メールでのご連絡は確認が遅れる場合がございますので、キャンセルの際は必ずお電話にてご連絡ください。",
    },
    {
      question: "支払い方法どうなりますか？",
      answer:
        'こちらの支払い方法をご利用いただけます。<ul class="list-disc mt-4 pl-6 space-y-2 text-sm/normal"><li>現金</li><li>クレジットカード（VISA、MASTER CARD、AMERICAN EXPRESS、JCB）</li><li>QRコード決済（PayPay、d払い、楽天ペイ、au PAY、メルペイ、ベニpay）</li><li>電子マネー（iD）</li></ul>',
    },
    {
      question: "どのくらいの間隔で通えばよいですか？",
      answer:
        "多くの方は3週間から1ヶ月の間隔でいらっしゃいます。基本的にはお客様のペースに合わせていただいて問題ございません。強制することは一切ございませんのでご安心ください。",
    },
    {
      question: "来院時の服装や注意事項はありますか？",
      answer:
        "施術がしやすい服装でお越しください。首回りの施術範囲が制限されるパーカーやスーツ、ワイシャツ、伸縮性の低いパンツはお避けください。また、強い香りの香水もベッドに残る可能性があるためご遠慮くださいますようお願いいたします。",
    },
    {
      question: "駐車スペースはありますか？",
      answer:
        "玄関前に駐車スペースがございます。ほかの車両の出入りがスムーズに行えるよう、できるだけ玄関側に寄せてお停めいただきますようお願いいたします。",
    },
  ],
} as const;

export const faqStyles: FaqStyles = {
  container: {
    base: "mx-auto lg:w-[740px]",
  },
  accordion: {
    base: "mt-6 xl:mt-12 [&>div]:pb-6 [&>div:last-child]:pb-0",
  },
} as const;
