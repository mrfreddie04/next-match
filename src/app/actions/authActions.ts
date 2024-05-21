'use server';

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { RegisterSchema, registerSchema } from "@/lib/schemas/registerSchema";
import { LoginSchema } from "@/lib/schemas/loginSchema";
import { User } from "@prisma/client";
import { signIn, signOut, auth } from "@/auth";
import { AuthError } from "next-auth";

export async function signInUser(data: LoginSchema): Promise<ActionResult<string>> {
  try {
    const result = await signIn("credentials", { 
      email: data.email, 
      password: data.password,
      redirect: false //we cannot redirect from action?
    });
    console.log("RESULT",result);
    return { status: 'success', data: "Logged in"};    
  } catch(e) {
    //console.log("ERROR",e);
    if(e instanceof AuthError && e.type === "CredentialsSignin") {
      return { status: 'error', error: "Invalid credentials" };
    }
    return { status: 'error', error: "Something went wrong"};    
  }
}

// export async function signOutUser(): Promise<ActionResult<string>> {
//   try {
//     const result = await signOut({ redirectTo: '/'});
//     return { status: 'success', data: "Signed out"};    
//   } catch(e) {
//     return { status: 'error', error: "Something went wrong"};    
//   }
// }

export async function signOutUser() {
  await signOut({ redirectTo: '/' });
}

export async function registerUser(data: RegisterSchema): Promise<ActionResult<User>> {
  try {
    //server side validation - same logic as on the client
    const validated = registerSchema.safeParse(data);
    if(!validated.success) {
      //we cannot throw errors as this is executed on the server (different execution ctx than the form)
      return { status: 'error', error: validated.error.errors }
    }
  
    //extract fields
    const { name, email, password } = validated.data;
  
    //check if user exists
    const existingUser = await getUserByEmail(email);
  
    if(existingUser) {
      return { status: 'error', error: "User already exists" };
    }
  
    //hash pwd
    const passwordHash = await bcrypt.hash(password, 10);
  
    //we do not need to await as it is the last command in the async function, so it will return the promise to the caller anyway
    const user = await prisma.user.create({
      data: { name, email, passwordHash }
    });

    return { status: 'success', data: user };
  } catch(e) {
    console.log(e);
    return { status: 'error', error: "Something went wrong"};
  }
}

// export async function loginUser(data: RegisterSchema): Promise<ActionResult<User>> {
//   try {
//     //server side validation - same logic as on the client
//     const validated = loginSchema.safeParse(data);
//     if(!validated.success) {
//       //we cannot throw errors as this is executed on the server (different execution ctx than the form)
//       return { status: 'error', error: validated.error.errors }
//     }
  
//     //extract fields
//     const { email, password } = validated.data;
  
//     //check if user exists
//     const user = await getUserByEmail(email);
  
//     if(!user) {
//       return { status: 'error', error: "Invalid credentials" };
//     }
  
//     //hash pwd
//     if(!await bcrypt.compare(password, user.passwordHash)) {
//       return { status: 'error', error: "Invalid credentials" };
//     }

//     return { status: 'success', data: user };
//   } catch(e) {
//     console.log(e);
//     return { status: 'error', error: "Something went wrong"};
//   }
// }

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ 
    where: { email: email }
  });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({ 
    where: { id: id }
  });
}

export async function getAuthUserId() {
  const session = await auth();
  if(!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  
  return session.user.id;
}