'use client';

import React from 'react';
import Link from 'next/link';
import { Member } from '@prisma/client';
import { Card, CardFooter, Image } from '@nextui-org/react';
import { calculateAge } from '@/lib/util';
import LikeButton from '@/components/LikeButton';

type Props = {
  member: Member,
  likeIds: string[]
}

export default function MemberCard({ member, likeIds }: Props) {
  const hasLiked = likeIds.includes(member.userId);

  const preventLinkAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  }

  //console.log("Render MemberCar");

  return (
    <Card 
      fullWidth 
      isPressable
      as={Link} 
      href={`/members/${member.userId}`}
    >
      <Image 
        isZoomed
        alt={member.name}
        width={300}
        src={member.image || '/images/user.png'}
        className='aspect-square object-cover'
      />      
      <div onClick={preventLinkAction}>
        <div className='absolute top-3 right-3 z-50'>
          {/* <p>LikeButton</p> */}
          <LikeButton targetId={member.userId} hasLiked={hasLiked}/>
        </div>
      </div>            
      <CardFooter 
        className="flex justify-start bg-black overflow-hidden absolute bottom-0 z-10 bg-dark-gradient">
        <div className='flex flex-col text-white'>
          <span className='font-semibold'>{member.name}, {calculateAge(member.dateOfBirth)}</span>
          <span className='text-sm'>{member.city}</span>
        </div>
      </CardFooter>
    </Card>
  )
}
