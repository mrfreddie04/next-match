import React from 'react'
import { CardBody, CardHeader, Divider, Image } from '@nextui-org/react'
import { getMemberPhotosByUserId } from '@/app/actions/memberActions'

type Props = {
  params: {
    userId: string
  }
}

export default async function PhotosPage({params}: Props) {

  const photos = await getMemberPhotosByUserId(params.userId);

  return (
    <>
      <CardHeader className='text-2xl font-semibold text-secondary'>
        Photos
      </CardHeader>
      <Divider/>
      <CardBody>
        <div className='grid grid-cols-5 gap-3'>
          {photos && photos.map(photo => (
            <div key={photo.id}>
              <Image 
                alt="Image if member"
                width={300}
                height={300}
                src={photo.url}
                className='aspect-square object-cover'              
              />
            </div>
          ))}
        </div>
      </CardBody>
    </>
  )
}
