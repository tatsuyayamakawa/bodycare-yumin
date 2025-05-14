export const contactFormData = {
  title: {
    heading: "お問い合わせ",
    subheading: "Contact",
  },
  placeholders: {
    name: "整体 太郎",
    email: "seitai-taro@gmail.com",
    telephone: "09012345678",
  },
  messages: {
    loading: {
      title: "メッセージを送信しています...",
      description: "ブラウザを閉じずにそのままお待ちください。",
    },
    success: {
      title: "お問い合わせを受け付けました。",
      description: "内容確認メールをお届けしております。",
    },
    error: {
      title: "送信に失敗しました。",
      description: "再度お試しいただくか、お電話でご連絡ください。",
    },
  },
} as const;
