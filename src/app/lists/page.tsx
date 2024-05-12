import React from 'react';
import Link from "next/link";

export default function ListsPage() {
  return (
    <div>
      <h3 className='text-3xl'>This will be the Lists Page</h3>
      <Link href="/">Go back home</Link>
    </div>
  )
}
