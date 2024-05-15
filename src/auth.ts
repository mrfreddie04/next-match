import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import { prisma } from "./lib/prisma";

export const { handlers: { GET, POST }, signIn, signOut, auth } = NextAuth({
  callbacks: {
    // async jwt({token}) {
    //   console.log("TOKEN",{token});
    //   return token;
    // },
    async session({token, session}) {
      // console.log("SESSION",{session});
      // console.log("TOKEN",{token});
      if(token.sub && session.user) {
        session.user.id = token.sub;
        //return {...session, user: {...session.user, id: token.sub}};
      }
      return session;
    },    
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt"},
  ...authConfig,
});