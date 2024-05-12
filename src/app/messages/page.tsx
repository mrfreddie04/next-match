import React from 'react';
import Link from "next/link";

export default function MessagesPage() {
  return (
    <div>
      <h3 className='text-3xl'>This will be the Messages Page</h3>
      <Link href="/">Go back home</Link>
    </div>
  )
}
