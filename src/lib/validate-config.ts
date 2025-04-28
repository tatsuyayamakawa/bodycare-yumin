import { z } from "zod";

const raw = {
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
};

const schema = z.object({
  APP_NAME: z.string().min(1, "App name is not set"),
});

export const config = schema.parse(raw);
export type Config = z.infer<typeof schema>;
