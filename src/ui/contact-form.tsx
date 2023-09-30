'use client';

import { useEffect, useState } from 'react';
import { ScrollAnimator } from 'react-animate-observer';
import { SubmitHandler, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Typography } from '@material-tailwind/react';
import axios from 'axios';
import { FaCircleCheck, FaCircleXmark } from 'react-icons/fa6';

import { ContactSchema, ContactType } from '@/schema/contact';

import { Heading } from './heading';
import { Toast } from './toast';
import { observerOptions } from '../constants/observer-options';

export const ContactForm = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [telephone, setTelephone] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [alertResult, setAlertResult] = useState<boolean>(true);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertColor, setAlertColor] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleOnSubmit: SubmitHandler<ContactType> = (data) => {
    console.log(data);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(sendMail());
      }, 3000);
    });
  };

  const sendMail = async () => {
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';

    const data = {
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: {
        user_name: name,
        user_email: email,
        user_telephone: telephone,
        message: message,
      },
    };

    try {
      const res = await axios.post('https://api.emailjs.com/api/v1.0/email/send', data);
      console.log(res.data);
      setAlertResult(true);
      setAlertMessage('メッセージが送信されました。返信をお待ちください。');
      setAlertColor('border-green-500 bg-green-500/10 text-green-500');
    } catch (error) {
      console.error(error);
      setAlertResult(false);
      setAlertMessage('送信時にエラーが発生しました。もう一度お試しください。');
      setAlertColor('border-red-500 bg-red-500/10 text-red-500');
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: formatError, isValid, isSubmitting, isSubmitSuccessful },
  } = useForm<ContactType>({
    mode: 'onBlur',
    resolver: zodResolver(ContactSchema),
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        name: '',
        email: '',
        telephone: '',
        message: '',
        agree: '',
      });
    }
  }, [isSubmitSuccessful, reset]);

  useEffect(() => {
    if (alertMessage) {
      setTimeout(() => {
        setAlertMessage('');
      }, 3000);
    }
  }, [alertMessage]);

  useEffect(() => {
    if (alertColor) {
      setTimeout(() => {
        setAlertColor('');
      }, 3000);
    }
  }, [alertColor]);

  return (
    <div className="bg-secondary py-[6.25rem]">
      <div className="mx-5 rounded-md bg-white pb-20 pt-10 lg:mx-auto lg:max-w-[53.875rem]">
        <Heading heading2="お問い合わせ" heading3="Contact" isAlign={true} />
        <ScrollAnimator start={{ opacity: 0 }} end={{ opacity: 1 }} observerOptions={observerOptions}>
          <form
            onSubmit={(e) => {
              void handleSubmit(handleOnSubmit)(e);
            }}
          >
            <div className="mx-5 mb-10 flex flex-col gap-10 md:mx-10 md:flex-row">
              <div className="basis-1/2 space-y-6">
                <div>
                  <label htmlFor="name" className="mb-2 block font-notojp text-base font-semibold text-gray-75">
                    お名前
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="山田 太郎"
                    required
                    {...register('name')}
                    autoComplete="on"
                    className="w-full rounded-md bg-secondary p-3 outline outline-2 outline-gray-25/60 transition-all duration-300 ease-in-out focus:outline-gray-25"
                    onChange={(e) => setName(e.target.value)}
                  />
                  {formatError.name && <div className="mt-2 font-notojp text-sm text-red-500">{formatError.name.message}</div>}
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block font-notojp text-base font-semibold text-gray-75">
                    メールアドレス
                  </label>
                  <input
                    type="text"
                    id="email"
                    placeholder="example@mail.com"
                    required
                    {...register('email')}
                    autoComplete="on"
                    className="w-full rounded-md bg-secondary p-3 outline outline-2 outline-gray-25/60 transition-all duration-300 ease-in-out focus:outline-gray-25"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {formatError.email && <div className="mt-2 font-notojp text-sm text-red-500">{formatError.email.message}</div>}
                </div>
                <div>
                  <label htmlFor="telephone" className="mb-2 block font-notojp text-base font-semibold text-gray-75">
                    電話番号
                  </label>
                  <input
                    type="text"
                    id="telephone"
                    placeholder="09012345678"
                    required
                    {...register('telephone')}
                    autoComplete="on"
                    className="w-full rounded-md bg-secondary p-3 outline outline-2 outline-gray-25/60 transition-all duration-300 ease-in-out focus:outline-gray-25"
                    onChange={(e) => setTelephone(e.target.value)}
                  />
                  {formatError.telephone && <div className="mt-2 font-notojp text-sm text-red-500">{formatError.telephone.message}</div>}
                </div>
              </div>
              <div className="basis-1/2">
                <label htmlFor="message" className="mb-2 block font-notojp text-base font-semibold text-gray-75">
                  お問い合わせ内容
                </label>
                <textarea
                  id="telephone"
                  required
                  {...register('message')}
                  className="h-[89%] w-full resize-none rounded-md bg-secondary p-3 outline outline-2 outline-gray-25/60 transition-all duration-300 ease-in-out focus:outline-gray-25"
                  onChange={(e) => setMessage(e.target.value)}
                />
                {formatError.message && <div className="mt-2 font-notojp text-sm text-red-500">{formatError.message.message}</div>}
              </div>
            </div>
            <div className="mb-10 text-center">
              <input type="checkbox" id="agree" value="true" {...register('agree')} />
              <label htmlFor="agree">
                <Typography variant="paragraph" className="ml-2 inline font-notojp font-normal text-gray-75">
                  <Typography
                    as="button"
                    variant="paragraph"
                    color="blue"
                    className="inline font-notojp font-normal hover:underline hover:underline-offset-4"
                    onClick={handleClick}
                  >
                    個人情報の取り扱い
                  </Typography>
                  に同意する
                </Typography>
              </label>
              {formatError.agree && <div className="text-center font-notojp text-sm text-red-500">{formatError.agree.message}</div>}
            </div>
            <Dialog size="md" open={isOpen} handler={handleClick}>
              <DialogHeader>
                <Typography variant="h4" className="font-notojp tracking-wide text-gray-75">
                  個人情報の取り扱いについて
                </Typography>
              </DialogHeader>
              <DialogBody divider className="h-[30rem] space-y-5 overflow-scroll p-5">
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
              </DialogBody>
              <DialogFooter>
                <Button size="lg" variant="text" color="blue" onClick={handleClick} className="font-notojp">
                  閉じる
                </Button>
              </DialogFooter>
            </Dialog>
            {!alertMessage && (
              <div className="flex justify-center">
                <Button variant="filled" size="lg" color="blue" type="submit" ripple={true} disabled={!isValid} className="flex items-center">
                  {isSubmitting && (
                    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="mr-3 inline animate-spin">
                      <path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25" className="fill-white" />
                      <path
                        d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
                        className="fill-white"
                      />
                    </svg>
                  )}
                  <Typography variant="lead" className="inline font-notojp text-lg font-semibold">
                    内容を送信する
                  </Typography>
                </Button>
              </div>
            )}
          </form>
        </ScrollAnimator>
        {alertMessage && (
          <Toast className={`${alertColor} mx-5 w-auto md:mx-10`}>
            {alertResult ? (
              <FaCircleCheck size="24" className="mr-3 inline text-green-500" />
            ) : (
              <FaCircleXmark size="24" className="mr-3 inline text-red-500" />
            )}
            {alertMessage}
          </Toast>
        )}
      </div>
    </div>
  );
};
