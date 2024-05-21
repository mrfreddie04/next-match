'use server';

import { prisma } from "@/lib/prisma";
import { getAuthUserId } from "./authActions";

export async function toggleLikeMember(targetUserId: string, isLiked: boolean) {
  try {
    const userId = await getAuthUserId();

    if(isLiked) {
      await prisma.like.delete({where: { likeId: {
        sourceUserId: userId, 
        targetUserId
      }}});
    } else {
      console.log("Create", userId, targetUserId);
      await prisma.like.create({
        data: { sourceUserId: userId, targetUserId }
      });      
    }

    // if(await prisma.like.findUnique({
    //   where: { likeId: {sourceUserId: userId, targetUserId}}
    // })) {

    // }

  } catch (error) {
    console.log(error);
    throw error;
  }
}  

export async function fetchCurrentUserLikeIds() {
  try {
    const userId = await getAuthUserId();

    const likeIds = await prisma.like.findMany({
      where: { sourceUserId: userId },
      select: { targetUserId: true }
    })

    return likeIds.map( like => like.targetUserId );

  } catch (error) {
    console.log(error);
    throw error;
  }    
}

export async function fetchLikedMembers(type = 'source') {
  try {
    const userId = await getAuthUserId();

    switch(type) {
      case 'source':
        return await fetchSourceLikes(userId);
      case 'target':
        return await fetchTargetLikes(userId);
      case 'mutual':  
        return await fetchMutualLikes(userId);
      default:
        return [];
    }

  } catch (error) {
    console.log(error);
    throw error;
  }    
}

async function fetchSourceLikes(userId: string) {
  const sourceList = await prisma.like.findMany({
    where: { sourceUserId: userId },
    select: { targetMember: true }
  });
  return sourceList.map( list => list.targetMember);
}

async function fetchTargetLikes(userId: string) {
  const targetList = await prisma.like.findMany({
    where: { targetUserId: userId },
    select: { sourceMember: true }
  });
  return targetList.map( list => list.sourceMember);
}

async function fetchMutualLikes(userId: string) {
  const likedUsers = await prisma.like.findMany({
    where: { sourceUserId: userId },
    select: { targetUserId: true }
  });
  const likedIds = likedUsers.map(user => user.targetUserId);
  const mutualList = await prisma.like.findMany({
    where: { 
      AND: [
        {targetUserId: userId}, 
        {sourceUserId: {in: likedIds} } 
      ]
    },
    select: { sourceMember: true }
  });  
  return mutualList.map( list => list.sourceMember);
}