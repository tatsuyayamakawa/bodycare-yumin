import { z } from 'zod';

const name: z.ZodString = z
  .string({ required_error: '入力が必須の項目です' })
  .min(1, { message: '入力が必須の項目です' })
  .max(20, { message: '20文字以内で入力してください' });
const email: z.ZodString = z
  .string({ required_error: '入力が必須の項目です' })
  .min(1, { message: '入力が必須の項目です' })
  .max(255, { message: '255文字以内で入力してください' })
  .email({ message: 'メールアドレスの形式で入力してください' });
const telephone: z.ZodString = z
  .string({ required_error: '入力が必須の項目です' })
  .min(10, { message: '電話番号を入力してください' })
  .max(14, { message: '14文字以内で入力してください' });
const message: z.ZodString = z
  .string({ required_error: '入力が必須の項目です' })
  .min(1, { message: '入力が必須の項目です' })
  .max(255, { message: '255文字以内で入力してください' });
const agree: z.ZodLiteral<string> = z.literal('true', {
  errorMap: () => ({ message: '同意が必須です' }),
});

export const ContactSchema = z.object({
  name: name,
  email: email,
  telephone: telephone,
  message: message,
  agree: agree,
});

export type ContactType = z.infer<typeof ContactSchema>;
