import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();
const allowedUrl = process.env.ALLOWED_ORIGIN ? `${process.env.ALLOWED_ORIGIN }, http://localhost:3000`: "http://localhost:3000";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
    },
  trustedOrigins: [allowedUrl],
});