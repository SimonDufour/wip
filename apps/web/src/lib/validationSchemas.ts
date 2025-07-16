import { z } from "zod";

export const emailSchema = z
  .string()
  .email({ message: "Adresse e-mail invalide" });

export const passwordSchema = z
  .string()
  .min(6, { message: "Le mot de passe doit contenir au moins 8 caractères" });

export const loginFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signUpFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const resetPasswordFormSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
