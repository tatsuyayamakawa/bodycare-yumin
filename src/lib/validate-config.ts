import { z } from "zod";

const raw = {
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  PORTAL_CODE: process.env.NEXT_PUBLIC_PORTAL_CODE,
  ADDRESS: process.env.NEXT_PUBLIC_ADDRESS,
  BUSINESS_DAYS: process.env.NEXT_PUBLIC_BUSINESS_DAYS,
  BUSINESS_HOURS: process.env.NEXT_PUBLIC_BUSINESS_HOURS,
  PHONE_NUMBER: process.env.NEXT_PUBLIC_PHONE_NUMBER,
};

const schema = z.object({
  APP_NAME: z.string().min(1, "App name is not set"),
  PORTAL_CODE: z.string().min(1, "Portal code is not set"),
  ADDRESS: z.string().min(1, "Address is not set"),
  BUSINESS_DAYS: z.string().min(1, "Business days is not set"),
  BUSINESS_HOURS: z.string().min(1, "Business hours is not set"),
  PHONE_NUMBER: z.string().min(1, "Phone number is not set"),
});

export const config = schema.parse(raw);
export type Config = z.infer<typeof schema>;
