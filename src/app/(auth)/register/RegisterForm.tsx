'use client';

import React from 'react';
import { Card, CardHeader, CardBody, Input, Button } from "@nextui-org/react";
import { GiPadlock } from 'react-icons/gi';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterSchema, RegisterFields } from '@/lib/schemas/registerSchema';
import { registerUser } from '@/app/actions/authActions';
import { ZodIssue } from 'zod';

export default function RegisterForm() {
  const { register, handleSubmit, setError, formState: {errors, isValid, isSubmitting} } = useForm<RegisterSchema>({
    //resolver: zodResolver(registerSchema),
    mode: "onTouched"
  });
  const onSubmit: SubmitHandler<RegisterSchema> = async (data) => {
    const result = await registerUser(data);
    //console.log({result});
    if( result.status === 'success') {
      console.log("User registered successfully");
      return;
    } 
    
    if( Array.isArray(result.error)) {
      result.error.forEach( (err: ZodIssue) => {
        const fieldName = err.path.join(".") as RegisterFields;
        setError(fieldName, {message: err.message});
      });
    } else {
      setError("root.serverError", {message: result.error});
    }
  }  

  return (
    <Card className='w-2/5 mx-auto' >
      <CardHeader className='flex flex-col items-center justify-center'>
        <div className='flex flex-col gap-2 items-center text-secondary'>
          <div className='flex flex-row gap-3 items-center '>
            <GiPadlock size={30}/>
            <h1 className='text-3xl font-semibold'>Register</h1>
          </div>
          <p className='text-neutral-500'>
            Welcome to NextMacth
          </p>
        </div>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='space-y-4'>
          <Input 
              defaultValue=''
              label='Name'
              variant='bordered'
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message}
              {...register('name')}
            />            
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
            {errors.root?.serverError && (
              <p className='text-danger text-sm'>{errors.root.serverError.message}</p>
            )}  
            <Button 
              isDisabled={!isValid} 
              isLoading={isSubmitting}
              fullWidth 
              color='secondary' 
              type='submit' 
            >
              Register
            </Button>     
          </div>
        </form>       
      </CardBody>
    </Card>    
  )
}
