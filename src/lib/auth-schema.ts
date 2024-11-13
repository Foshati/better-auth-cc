import { z } from "zod";

export const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "The name must be more than three letters " })
    .max(20, { message: "The name can be a maximum of 20 letters" }),

  email: z
    .string()
    .email({ message: "please enter a valid email" })
    .min(3, { message: "The email must be more than three letters " })
    .max(20, { message: "The email can be a maximum of 20 letters" }),

  password: z
    .string()
    .min(8, { message: "The password must be more than eight letters " })
    .max(50, { message: "The password can be a maximum of 50 letters" }),
});



export const formSchemaSignin=formSchema.pick({
    email:true,
    password:true
})