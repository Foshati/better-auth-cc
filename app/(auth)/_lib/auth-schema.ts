import { z } from "zod";

const getPasswordSchema = (type: "password" | "confirmPassword") =>
  z
    .string({ required_error: `${type} is required` })
    .trim()
    .min(8, `${type} must be at least 8 characters`)
    .max(32, `${type} cannot exceed 32 characters`)
    .refine(
      (value) => /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_])/.test(value),
      {
        message: `${type} must include uppercase, lowercase, number, and special character`,
      }
    );

const getEmailSchema = () =>
  z
    .string({ required_error: "Email is required" })
    .trim()
    .min(1, "Email is required")
    .email("Invalid email format");

const getNameSchema = () =>
  z
    .string({ required_error: "Name is required" })
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(20, "Name must be less than 20 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces");

const getUsernameSchema = () =>
  z
    .string({ required_error: "Username is required" })
    .trim()
    .min(5, "Username must be at least 5 characters long")
    .max(21, "Username must be less than 21 characters");

export const signUpSchema = z
  .object({
    name: getNameSchema(),
    email: getEmailSchema(),
    username: getUsernameSchema(),
    password: getPasswordSchema("password"),
    confirmPassword: getPasswordSchema("confirmPassword"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: getEmailSchema(),
  password: getPasswordSchema("password"),
});

export const forgotPasswordSchema = z.object({
  email: getEmailSchema(),
});

export const resetPasswordSchema = z
  .object({
    password: getPasswordSchema("password"),
    confirmPassword: getPasswordSchema("confirmPassword"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
