import type { QuestionItemProps } from 'src/@types/global';

export const questions: QuestionItemProps[] = [
  {
    id: 1,
    question: 'どれくらいのペースで通えばいいですか？',
    answer:
      'お客様のお好きなペースで通っていただいて構いません。こちらから次回予約を強制することもございません。\n\nペースを決められないので決めてほしいという方もいらっしゃいますので、そういった方には3週間～1ヵ月置きをお勧めしています。体に症状が出てからではなく、一定間隔でメンテナンスをおこなっていただくのがベストです。',
  },
  {
    id: 2,
    question: '支払方法はどうなりますか？',
    answer: '以下の支払方法に対応しております\n\n・現金\n・クレジットカード（VISA、MASTER CARD、AMERICAN EXPRESS、JCB）\n・QRコード決済（PayPay、楽天ペイ）\n・電子マネー（iD）',
  },
  {
    id: 3,
    question: '当日予約はできますか？',
    answer: 'Web予約は希望時間の2時間前まで有効です。\n\nその他、空き時間のご確認はLINEトークより直接お問い合わせください。',
  },
  {
    id: 4,
    question: '急な予約時間の変更、キャンセルはできますか？',
    answer: '2時間前までは変更・キャンセル可能です。LINEにてご連絡ください。\n\n2時間を過ぎた場合は1,500円、無連絡キャンセルは3,000円のキャンセル料金を請求させていただきます。',
  },
  {
    id: 5,
    question: '服装は自由ですか？',
    answer: '以下の服装はなるべくご遠慮いただけますと幸いです。\n\n・スカート、スーツ（下肢の施術がしにくいため）\n・パーカー（首周りの施術がしにくいため）',
  },
  {
    id: 6,
    question: '駐車スペースはありますか？',
    answer: '玄関前に駐車していただいて構いません。\n\nあまり広くないため、なるべく玄関側に寄せて車が出入りできるスペースを確保していただけますと大変助かります。',
  },
];
