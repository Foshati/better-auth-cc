
// api/auth/[...all]/route.ts
import { auth } from "@/app/(auth)/_lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
 
export const { POST, GET } = toNextJsHandler(auth);