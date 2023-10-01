import { ScrollAnimator } from 'react-animate-observer';

import { Typography } from '@material-tailwind/react';
import Link from 'next/link';

import { ExternalLink } from './external-link';
import { Heading } from './heading';
import { observerOptions } from '../constants/observer-options';

export const PrivacyPolicy = () => {
  return (
    <>
      <div className="bg-secondary py-[6.25rem]">
        <div className="mx-5 lg:mx-auto lg:max-w-[53.875rem]">
          <nav aria-label="パンくずリスト" className="w-max">
            <ol className="mb-5 flex w-full items-center rounded-md bg-white px-4 py-2">
              <li className="flex cursor-pointer items-center">
                <Link className="text-blue-500 opacity-60" href="/">
                  <Typography as="button" variant="small">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                    </svg>
                  </Typography>
                </Link>
              </li>
              <li className="mx-2 text-gray-50">/</li>
              <li aria-current="page" className="flex items-center">
                <Typography variant="small" className="font-notojp font-medium text-gray-75">
                  プライバシーポリシー
                </Typography>
              </li>
            </ol>
          </nav>
        </div>
        <div className="mx-5 rounded-md bg-white py-10 lg:mx-auto lg:max-w-[53.875rem]">
          <Heading heading2="個人情報の取り扱いについて" heading3="Privacy&nbsp;policy" isAlign={true} />
          <ScrollAnimator start={{ opacity: 0 }} end={{ opacity: 1 }} observerOptions={observerOptions} className="mx-5 mb-10 flex flex-col gap-10 md:mx-10">
            <Typography variant="paragraph" className="font-notojp font-normal tracking-wide text-gray-75">
              手もみ整体
              癒眠（以下、当院と言います）は、お客様の個人情報について以下の通りプライバシーポリシーを定めます。これは、当院がどのような個人情報を取得し、どのように利用・管理するかをご説明するものです。
            </Typography>
            <Typography variant="h5" className="font-notojp font-semibold tracking-wide text-gray-75">
              個人情報の取得方法
            </Typography>
            <Typography variant="paragraph" className="font-notojp font-normal tracking-wide text-gray-75">
              当院は、以下の場合に適法かつ公正な手段によって個人情報を取得致します。
            </Typography>
            <ol className="list-decimal pl-5 font-notojp font-normal tracking-wide text-gray-75">
              <li>お客様の初来院時にアンケートをご記入いただき、氏名、住所、電話番号、その他の記述により、個人情報を取得します。</li>
              <li>ウェブ予約のご利用時に、氏名、メールアドレス、電話番号の記述により、個人情報を取得します。</li>
              <li>当サイトからのお問い合わせをご利用時に、氏名、メールアドレス、電話番号の記述により、個人情報を取得します。</li>
              <li>会員ページをご利用時に、氏名、メールアドレス、電話番号の記述、また画像データの登録により、個人情報を取得します。</li>
            </ol>
            <Typography variant="h5" className="font-notojp font-semibold tracking-wide text-gray-75">
              アクセス解析ツールについて
            </Typography>
            <Typography variant="paragraph" className="font-notojp font-normal tracking-wide text-gray-75">
              当サイトでは、Googleによるアクセス解析ツール「Googleアナリティクス」を使用しています。このGoogleアナリティクスはデータの収集のためにCookieを使用しています。このデータは匿名で収集されており、個人を特定するものではありません。
            </Typography>
            <Typography variant="paragraph" className="font-notojp font-normal tracking-wide text-gray-75">
              この機能はCookieを無効にすることで収集を拒否することが出来ますので、お使いのブラウザの設定をご確認ください。この規約に関しては以下の詳細ページをご覧ください。
            </Typography>
            <ul className="list-disc pl-5 font-notojp font-normal tracking-wide text-gray-75">
              <li>
                <ExternalLink url="https://marketingplatform.google.com/about/analytics/terms/jp/" ariaLabel="Googleアナリティクスサービス利用規約" icon={true}>
                  Googleアナリティクスサービス利用規約
                </ExternalLink>
              </li>
              <li>
                <ExternalLink url="https://policies.google.com/technologies/ads?hl=ja" ariaLabel="Googleポリシーと規約ページ" icon={true}>
                  Googleポリシーと規約ページ
                </ExternalLink>
              </li>
            </ul>
            <Typography variant="h5" className="font-notojp font-semibold tracking-wide text-gray-75">
              個人情報の利用について
            </Typography>
            <Typography variant="paragraph" className="font-notojp font-normal tracking-wide text-gray-75">
              当院は、取得した個人情報を以下に示す業務遂行上必要な範囲内で利用します。
            </Typography>
            <ol className="list-decimal pl-5 font-notojp font-normal tracking-wide text-gray-75">
              <li>お客様の属性データを分析し、業務改善に活かすため</li>
              <li>当院へのお問い合わせの回答のため</li>
            </ol>
            <Typography variant="h5" className="font-notojp font-semibold tracking-wide text-gray-75">
              個人情報の管理について
            </Typography>
            <Typography variant="paragraph" className="font-notojp font-normal tracking-wide text-gray-75">
              当院は、お客様の個人情報を不正アクセス・紛失・破損・改竄・漏洩から保護するため、セキュリティシステムの維持・管理を徹底します。
            </Typography>
            <Typography variant="h5" className="font-notojp font-semibold tracking-wide text-gray-75">
              個人情報の第三者への開示・提供について
            </Typography>
            <Typography variant="paragraph" className="font-notojp font-normal tracking-wide text-gray-75">
              当院は、お客様よりお預かりした個人情報を適切に管理し、法令に基づき開示する必要がある場合を除き、第三者への開示は致しません。また、お客様ご本人から個人情報の開示を求められたときは、遅延なくご本人に対しこれを開示します。個人情報の訂正、追加、削除、利用の停止、第三者への提供の停止を希望される方はお問い合わせフォームよりご連絡ください。
            </Typography>
            <Typography variant="paragraph" className="font-notojp font-normal tracking-wide text-gray-75">
              令和5年 9月 30日 手もみ整体 癒眠
              <br />
              代表 山川達也
            </Typography>
          </ScrollAnimator>
        </div>
      </div>
    </>
  );
};
