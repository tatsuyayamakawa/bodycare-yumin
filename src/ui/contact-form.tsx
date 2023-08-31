import React, { useState } from 'react';

import emailjs from '@emailjs/browser';
import { Input, Button, Typography, Textarea, Dialog, DialogBody } from '@material-tailwind/react';

export const ContactForm = ({ isOpen, handler }: { isOpen: boolean; handler: () => void }) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [emailStatusMessage, setEmailStatusMessage] = useState<string>('');

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    sendMail();
  };

  const sendMail = () => {
    const serviceId = process.env.EMAILJS_SERVICE_ID || '';
    const templateId = process.env.EMAILJS_TEMPLATE_ID || '';
    const publicKey = process.env.EMAILJS_PUBLIC_KEY || '';

    const templateParams = {
      user_name: name,
      user_email: email,
      message: message,
    };

    emailjs
      .send(serviceId, templateId, templateParams, publicKey)
      .then((response) => {
        console.log('Email sent seccessfully!', response);
        setName('');
        setEmail('');
        setMessage('');
        setEmailStatusMessage('メッセージが送信されました！返信をお待ちください。');
      })
      .catch((error) => {
        console.error('Error sending email:', error);
        setEmailStatusMessage('メッセージ送信時にエラーが発生しました！もう一度送信をお試しください。');
      });
  };

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
        <form className="flex flex-col gap-6">
          <Input variant="static" size="lg" color="blue-gray" label="お名前" value={name} onChange={(e) => setName(e.target.value)} />
          <Input variant="static" size="lg" color="blue-gray" label="メールアドレス" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Textarea variant="static" size="lg" color="blue-gray" label="内容" value={message} onChange={(e) => setMessage(e.target.value)} />
          {emailStatusMessage && (
            <Typography variant="paragraph" className="font-notojp text-base font-normal">
              {emailStatusMessage}
            </Typography>
          )}
          <Button variant="filled" size="lg" color="blue-gray" ripple={true} fullWidth={true} onClick={handleSubmit} disabled={disableSend}>
            <Typography variant="lead" className="font-notojp text-lg font-medium">
              内容を送信する
            </Typography>
          </Button>
        </form>
      </DialogBody>
    </Dialog>
  );
};
