import { z } from "zod";

export const E164PhoneNumberSchema = z.string().regex(/^\+[1-9]\d{1,14}$/, {
  message:
    "Invalid phone number format. Must be in E.164 format (e.g. +18001234567)",
});
