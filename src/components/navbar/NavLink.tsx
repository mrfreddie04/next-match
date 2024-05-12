'use client';

import React from 'react';
import { NavbarItem } from '@nextui-org/react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Props = {
  children: React.ReactNode,
  href: string,
  [key: string]: any
}

export default function NavLink({children,href,...props}: Props) {
  const pathname = usePathname();
  const isActive = pathname.toLowerCase() === href.toLowerCase();

  return (
    <NavbarItem {...props} isActive={isActive} as={Link} href={href}>
      {children}
    </NavbarItem>
  )
}
