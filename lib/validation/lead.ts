import { z } from "zod";

const stripHtml = (value: string) =>
  value.replace(/<[^>]*>/g, "").replace(/[\u0000-\u001f\u007f]/g, "");

export const leadCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Укажите имя (минимум 2 символа)")
    .max(100)
    .transform(stripHtml),
  phone: z
    .string()
    .trim()
    .min(10, "Укажите корректный телефон")
    .max(24)
    .regex(/^[\d\s+()-]+$/, "Некорректный формат телефона"),
  email: z
    .string()
    .trim()
    .max(200)
    .optional()
    .transform((v) => (v === "" ? undefined : v))
    .pipe(z.union([z.email("Некорректный email"), z.undefined()])),
  description: z
    .string()
    .trim()
    .max(5000)
    .optional()
    .transform((v) => (v === "" ? undefined : stripHtml(v ?? ""))),
  consent: z
    .boolean()
    .refine((v) => v === true, "Необходимо согласие на обработку персональных данных"),
  website: z
    .string()
    .max(0)
    .optional()
    .describe("Honeypot — must be empty"),
});

export const leadStatusSchema = z.enum(["new", "in_progress", "done", "rejected"]);

export const loginSchema = z.object({
  username: z.string().trim().min(1).max(64),
  password: z.string().min(8).max(128),
});

export type LeadCreateInput = z.infer<typeof leadCreateSchema>;
