import React, { useEffect, useState } from 'react';

import { Input, Button, Typography, Textarea, Dialog, DialogBody } from '@material-tailwind/react';
import axios from 'axios';

import { Toast } from './toast';

export const ContactForm = ({ isOpen, handler }: { isOpen: boolean; handler: () => void }) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [alertMessage, setAlertMessage] = useState<string>('');

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    sendMail();
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
        message: message,
      },
    };

    try {
      const res = await axios.post('https://api.emailjs.com/api/v1.0/email/send', data);
      console.log(res.data);
      setName('');
      setEmail('');
      setMessage('');
      setAlertMessage('メッセージが送信されました！返信をお待ちください。');
    } catch (error) {
      console.error(error);
      setAlertMessage('メッセージ送信時にエラーが発生しました！もう一度送信をお試しください。');
    }
  };

  useEffect(() => {
    if (alertMessage) {
      setTimeout(() => {
        setAlertMessage('');
      }, 3000);
    }
  }, [alertMessage]);

  const disableSend = name === '' || email === '' || message === '';

  return (
    <Dialog size={'sm'} open={isOpen as boolean} handler={handler as () => void}>
      <DialogBody className="m-5">
        <Typography variant="h4" className="mb-5 font-notojp font-semibold text-gray-75">
          お問い合わせ
        </Typography>
        <Typography variant="paragraph" className="mb-10 font-notojp font-normal">
          すべての項目を入力後、送信ボタンを押してください
        </Typography>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <Input variant="static" size="lg" color="blue-gray" label="お名前" value={name} required onChange={(e) => setName(e.target.value)} />
          <Input variant="static" size="lg" color="blue-gray" label="メールアドレス" value={email} required onChange={(e) => setEmail(e.target.value)} />
          <Textarea variant="static" size="lg" color="blue-gray" label="内容" value={message} required onChange={(e) => setMessage(e.target.value)} />
          {alertMessage && (
            <Toast variant="paragraph" className="font-notojp text-base font-normal">
              {alertMessage}
            </Toast>
          )}
          <Button variant="filled" size="lg" color="blue-gray" type="submit" ripple={true} fullWidth={true} disabled={disableSend}>
            <Typography variant="lead" className="font-notojp text-lg font-medium">
              内容を送信する
            </Typography>
          </Button>
        </form>
      </DialogBody>
    </Dialog>
  );
};
