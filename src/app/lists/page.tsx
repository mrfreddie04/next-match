import React from 'react';
import Link from "next/link";
import ListsTab from './ListsTab';
import { fetchCurrentUserLikeIds, fetchLikedMembers } from '../actions/likeActions';

type Props = {
  searchParams: {
    type: string
  }
}

export default async function ListsPage({searchParams}: Props) {
  const likeIds = await fetchCurrentUserLikeIds();
  const members = await fetchLikedMembers(searchParams.type);

  return (
    <div>
      <ListsTab members={members} likeIds={likeIds}/>
    </div>
  )
}
