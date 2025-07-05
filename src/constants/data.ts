// アプリケーションの基本情報
export type AppInfo = {
  name: string;
  title: string;
  description: string;
  domain: string;
};

// 連絡先情報
export type ContactInfo = {
  phoneNumber: string;
  email: string;
};

// アプリケーション情報
export const appInfo: AppInfo = {
  name: "手もみ整体 癒眠",
  title: "手もみ整体 癒眠 - 山形県山形市の自律神経を整える整体サロン",
  description:
    "手もみ整体 癒眠では、日々のストレスや不規則な生活習慣で乱れがちな自律神経の調整と健康な体を取り戻すためのお手伝いをいたします",
  domain: "bodycare-yumin.com",
};

// 連絡先情報
export const contactInfo: ContactInfo = {
  phoneNumber: "080-6294-5177",
  email: "info@bodycare-yumin.com",
};
