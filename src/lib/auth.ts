import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";
import bcrypt from "bcrypt"

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: "",
      from: "no-reply@srsabueso.com",
      async sendVerificationRequest({ identifier, url }) {
        await resend.emails.send({
          to: identifier,
          from: "no-reply@srsabueso.com",
          subject: "Login en Sr. Sabueso",
          html: `<p>Haz clic en este enlace para ingresar: <a href="${url}">${url}</a></p>`,
        });
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const user = await prisma.user.findUnique({
          where: { username: credentials?.username },
        });

        if (!user) return null;
      
        if (user && user.password && credentials && await bcrypt.compare(credentials.password, user.password)) {
          return {
            ...user,
            id: user.id.toString(), // 👈 Convertir a string
          };
        }
      
        return null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "database",
  },
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
