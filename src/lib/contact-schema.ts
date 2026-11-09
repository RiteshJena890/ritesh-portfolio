import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80, "Please keep your name under 80 characters."),
  email: z.string().trim().email("Please enter a valid email address.").max(160),
  subject: z.string().trim().max(120, "Please keep the subject under 120 characters.").optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(20, "Please write at least 20 characters so I know what you need.")
    .max(4000, "Please keep the message under 4,000 characters."),
  // Honeypot: real visitors never see or fill this field.
  company: z.string().max(0).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;
