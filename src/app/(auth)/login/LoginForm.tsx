'use client';

import React from 'react';
import { Card, CardHeader, CardBody, CardFooter, Input, Button } from "@nextui-org/react";
import { GiPadlock } from 'react-icons/gi';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginSchema } from '@/lib/schemas/loginSchema';
import { signInUser } from '@/app/actions/authActions';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function LoginForm() {
  const router = useRouter();
  const { register, handleSubmit, formState: {errors, isValid, isSubmitting} } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched"
  });

  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    const result = await signInUser(data);
    //console.log({result});
    if( result.status === 'success') {
      router.push("/members");
      router.refresh();
      return;
    } 
    toast.error(result.error as string);
    //console.log("Login Error",result.error);
    //setError("root.serverError", {message: result.error as string});
  }  

  return (
    <Card className='w-2/5 mx-auto' >
      <CardHeader className='flex flex-col items-center justify-center'>
        <div className='flex flex-col gap-2 items-center text-secondary'>
          <div className='flex flex-row gap-3 items-center '>
            <GiPadlock size={30}/>
            <h1 className='text-3xl font-semibold'>Login</h1>
          </div>
          <p className='text-neutral-500'>
            Welcome back to NextMacth
          </p>
        </div>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='space-y-4'>
            <Input 
              defaultValue=''
              label='Email'
              variant='bordered'
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
              {...register('email')}
            />
            <Input 
              defaultValue=''
              label='Password'
              type='password'
              variant='bordered'
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
              {...register('password')}
            />     
            {/* {errors.root?.serverError && (
              <p className='text-danger text-sm'>{errors.root.serverError.message}</p>
            )}               */}
            <Button 
              isDisabled={!isValid}
              isLoading={isSubmitting}
              fullWidth 
              color='secondary' 
              type='submit' 
            >
              Login
            </Button>     
          </div>
        </form>       
      </CardBody>
    </Card>    
  )
}
