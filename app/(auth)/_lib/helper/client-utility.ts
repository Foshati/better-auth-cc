import { client } from "../auth-client";

export async function getClientSession() {
  const session = await client.getSession();
  return session;
}
