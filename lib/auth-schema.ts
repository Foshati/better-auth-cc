// schema.ts

import { z } from "zod";
import { object, string } from "zod";

export const passwordValidation = z
  .string()
  .min(8, { message: "❌Password must be at least 8 characters." })
  .regex(/[A-Z]/, {
    message: "❌Password must contain at least one uppercase letter.",
  })
  .regex(/[a-z]/, {
    message: "❌Password must contain at least one lowercase letter.",
  })
  .regex(/[0-9]/, { message: "❌Password must contain at least one number." })
  .regex(/[\W_]/, {
    message: "❌Password must contain at least one special character.",
  });

const getPasswordSchema = (type: "password" | "confirmPassword") =>
  z
    .string({ required_error: `${type} is required` })
    .min(8, `${type} must be atleast 8 characters`)
    .max(32, `${type} can not exceed 32 characters`);

const getEmailSchema = () =>
  z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email");

const getNameSchema = () =>
  z
    .string({ required_error: "Name is required" })
    .min(3, "Username must be atleast 3 characters")
    .max(20, "Name must be less than 20 characters");

    const getUserName = () =>
      z
        .string()
        .min(5, "❌ Username must be at least 5 characters long.") // Include @ in the length
        .max(21, "❌ Username must be less than 21 characters."); // Include @ in the length
    
    export const signUpSchema = z.object({
      name: getNameSchema(),
      email: getEmailSchema(),
      username: getUserName(),
      password: getPasswordSchema("password"),
      confirmPassword: getPasswordSchema("confirmPassword"),
      avatar: z.string().optional(), // اینجا avatar به صورت اختیاری است
    }).refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });
    

export const signInSchema = object({
  email: getEmailSchema(),
  password: getPasswordSchema("password"),
});

export const forgotPasswordSchema = object({
  email: getEmailSchema(),
});

export const resetPasswordSchema = object({
  password: getPasswordSchema("password"),
  confirmPassword: getPasswordSchema("confirmPassword"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
