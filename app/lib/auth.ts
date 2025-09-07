import Credentials from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import prisma from "@/prisma";

export const authOptions: NextAuthOptions = {
   providers: [
      Credentials({
         credentials: {
            phoneNumber: { label: "Phone Number", type: "tel", placeholder: "9823984234" },
            password: { label: "Password", type: "password" },
         },
         async authorize(credentials) {
            console.log(credentials, "Credentials");

            if (!credentials) return null;

            const { phoneNumber, password } = credentials;

            const foundUser = await prisma.user.findUnique({
               where: { phoneNumber },
            });

            if (!foundUser || foundUser.password !== password) {
               return null;
            }

            return {
               id: String(foundUser.id),
               name: foundUser.username ?? null,
               phone: foundUser.phoneNumber ?? null,
            };
         },
      }),
   ],

   callbacks: {
      async redirect({  baseUrl }) {
         return baseUrl;
      },
      async session({ session, token }) {
         if (session.user) {
            session.user.id = token.id as string;
            session.user.phone=token.phone as string;
         }
         return session;
      },

      async jwt({ token, user }) {
         if (user) {
            token.id = user.id as string;
         }
         return token;
      },
   },

   pages: {
      signIn: "/signin",
   },
};
