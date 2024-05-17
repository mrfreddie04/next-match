'use server';

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Photo } from "@prisma/client";

export async function getMembers() {
  try {
    //throw new Error("Just testing...");

    const session = await auth();
    if(!session?.user) return null;

    return prisma.member.findMany({
      where: { userId: { not: session.user.id }}
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getMemberByUserId(userId: string) {
  try {
    return prisma.member.findUnique({
      where: { userId: userId }
    });
  } catch (error) {
    console.log(error);
  }
}

export async function getMemberPhotosByUserId(userId: string) {
  try {
    const member = await prisma.member.findUnique({
      where: { userId: userId },
      //we can use select or include to get related data
      //include - returns all member properties and related data
      //select - more efficient - returns only explicitly specified data
      select: { photos: true } 
    });
    if(!member) return null;
    return member.photos as Photo[];
  } catch (error) {
    console.log(error);
  }
}