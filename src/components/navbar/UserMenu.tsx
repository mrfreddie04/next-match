'use client';

import { User } from 'next-auth';
import React from 'react';
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Avatar, DropdownSection} from "@nextui-org/react";
import Link from 'next/link';
import { signOutUser } from '@/app/actions/authActions';

type Props = {
  user: User //or Session['user'] - the type of user property of Session type
}

export default function UserMenu({user}: Props) {
  return (
    // <p>{user.name || 'user avatar'}</p>
    <Dropdown placement='bottom-end'>
      <DropdownTrigger>          
        <Avatar 
          isBordered 
          radius="full"          
          className='transition-transform cursor-pointer'
          color='secondary'
          name={user.name || 'user avatar'}
          size='sm'
          src={user.image || '/images/user.png'}
        /> 
      </DropdownTrigger>
      <DropdownMenu aria-label="User actions menu" variant='flat'>
        <DropdownSection showDivider>          
          <DropdownItem isReadOnly as='span' className='h-14 flex flex-row' aria-label="username" >
            Signed in as {user.name}
          </DropdownItem>
        </DropdownSection>
        <DropdownItem as={Link} href='/members/edit' >
          Edit profile
        </DropdownItem>
        <DropdownItem color="danger" onClick={async () => signOutUser()} >
          Log out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
