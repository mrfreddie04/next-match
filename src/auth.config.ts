import GitHub from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { loginSchema } from "./lib/schemas/loginSchema";
import { getUserByEmail } from "./app/actions/authActions";

export default {
  providers: [
    //GitHub
    Credentials({
      name: "credentials",
      async authorize(credentials) {
        const validated = loginSchema.safeParse(credentials);
        if(!validated.success) {
          return null;
        }        
        const { email, password } = validated.data;
  
        //check if user exists
        const user = await getUserByEmail(email);
      
        if(!user || !await bcrypt.compare(password, user.passwordHash)) {
          return null;
        }
      
        return user;
      },
    }),    
  ],
} satisfies NextAuthConfig;