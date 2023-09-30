import { ScrollAnimator } from 'react-animate-observer';

import { Typography } from '@material-tailwind/react';

import { Heading } from './heading';
import { observerOptions } from '../constants/observer-options';

export const PrivacyPolicy = () => {
  return (
    <>
      <div className="bg-secondary py-[6.25rem]">
        <div className="mx-5 rounded-md bg-white py-10 lg:mx-auto lg:max-w-[53.875rem]">
          <Heading heading2="個人情報の取り扱いについて" heading3="Privacy&nbsp;policy" isAlign={true} />
          <ScrollAnimator
            start={{ opacity: 0 }}
            end={{ opacity: 1 }}
            observerOptions={observerOptions}
            className="mx-5 mb-10 flex flex-col gap-10 md:mx-10"
          >
            <Typography variant="paragraph" className="font-notojp font-normal text-gray-75">
              手もみ整体
              癒眠（以下、当院と言います）は、お客様の個人情報について以下の通りプライバシーポリシーを定めます。これは、当院がどのような個人情報を取得し、どのように利用・管理するかをご説明するものです。
            </Typography>
            <Typography variant="h5" className="font-notojp font-semibold text-gray-75">
              個人情報の取得方法
            </Typography>
            <Typography variant="paragraph" className="font-notojp font-normal text-gray-75">
              当院は、以下の場合に適法かつ公正な手段によって個人情報を取得致します。
            </Typography>
            <ol className="list-decimal pl-5 font-notojp font-normal text-gray-75">
              <li>お客様の初来院時にアンケートをご記入いただき、氏名、住所、電話番号、その他の記述により、個人情報を取得します。</li>
              <li>ウェブ予約のご利用時に、氏名、メールアドレス、電話番号の記述により、個人情報を取得します。</li>
              <li>ウェブサイトからのお問い合わせをご利用時に、氏名、メールアドレス、電話番号の記述により、個人情報を取得します。</li>
              <li>ウェブサイトからのお問い合わせをご利用時に、氏名、メールアドレス、電話番号の記述により、個人情報を取得します。</li>
            </ol>
            <Typography variant="h5" className="font-notojp font-semibold text-gray-75">
              個人情報の利用について
            </Typography>
            <Typography variant="paragraph" className="font-notojp font-normal text-gray-75">
              当院は、取得した個人情報を以下に示す業務遂行上必要な範囲内で利用します。
            </Typography>
            <ol className="list-decimal pl-5 font-notojp font-normal text-gray-75">
              <li>お客様の属性データを分析し、業務改善に活かすため</li>
              <li>当院へのお問い合わせの回答のため</li>
            </ol>
            <Typography variant="h5" className="font-notojp font-semibold text-gray-75">
              個人情報の管理について
            </Typography>
            <Typography variant="paragraph" className="font-notojp font-normal text-gray-75">
              当院は、お客様の個人情報を不正アクセス・紛失・破損・改竄・漏洩から保護するため、セキュリティシステムの維持・管理を徹底します。
            </Typography>
            <Typography variant="h5" className="font-notojp font-semibold text-gray-75">
              個人情報の第三者への開示・提供について
            </Typography>
            <Typography variant="paragraph" className="font-notojp font-normal text-gray-75">
              当院は、お客様よりお預かりした個人情報を適切に管理し、法令に基づき開示する必要がある場合を除き、第三者への開示は致しません。また、お客様ご本人から個人情報の開示を求められたときは、遅延なくご本人に対しこれを開示します。個人情報の訂正、追加、削除、利用の停止、第三者への提供の停止を希望される方はお問い合わせフォームよりご連絡ください。
            </Typography>
            <Typography variant="paragraph" className="font-notojp font-normal text-gray-75">
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
