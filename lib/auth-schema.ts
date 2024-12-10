import { z } from "zod";
import { object, string } from "zod";

export const passwordValidation = z
  .string()
  .min(8, { message: "Password must be at least 8 characters." })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter.",
  })
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter.",
  })
  .regex(/[0-9]/, { message: "Password must contain at least one number." })
  .regex(/[\W_]/, {
    message: "Password must contain at least one special character.",
  });

const getPasswordSchema = (type: "password" | "confirmPassword") =>
  string({ required_error: `${type} is required` })
    .min(8, `${type} must be atleast 8 characters`)
    .max(32, `${type} can not exceed 32 characters`);




    const getUserNameSchema = () =>
      string()
        .min(4, { message: "Username must be at least 3 characters" })
        .max(20, { message: "Username must be at most 20 characters" })
        .regex(/^(?![_\.])[a-z0-9_]+(?<![_\.])$/, {
          message:
            "Username must be 4-20 characters, can only contain lowercase letters, numbers, and underscores, and cannot start or end with underscores or dots.",
        })
        .refine((username) => !["admin", "root", "superuser"].includes(username), {
          message: "This username is reserved and cannot be used.",
        });
    





const getEmailSchema = () =>
  string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email");

const getNameSchema = () =>
  string({ required_error: "Name is required" })
    .min(1, "Name is required")
    .max(50, "Name must be less than 50 characters");

    export const signUpSchema = object({
      name: getNameSchema(),
      username: getUserNameSchema(),
      email: getEmailSchema(),
      password: passwordValidation,
      confirmPassword: passwordValidation,
      avatar: z.union([z.instanceof(File), z.null()]).optional(), // Allows File or null
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
