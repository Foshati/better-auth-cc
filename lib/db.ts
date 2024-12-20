import { PrismaClient } from '@prisma/client';

const dbClientSingleton = () => {
  return new PrismaClient();
};

declare const globalThis: {
  dbGlobal: ReturnType<typeof dbClientSingleton>;
} & typeof global;

const db = globalThis.dbGlobal ?? dbClientSingleton();

export default db;

if (process.env.NODE_ENV !== 'production') globalThis.dbGlobal = db;
