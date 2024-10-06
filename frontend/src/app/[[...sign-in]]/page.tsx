"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const LoginPage = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = () => {
   setLoading(true);
   setTimeout(() => {
        
        setLoading(false);
    }, 18000); 
};



  useEffect(() => {
    const role = user?.publicMetadata.role;

    if (role) {
      router.push(`/${role}`);
    }
  }, [user, router]);

  return (
    <div className="h-screen flex items-center justify-center bg-lamaSkyLight">
      <SignIn.Root>
        <SignIn.Step
          name="start"
          className="bg-white p-12 rounded-md shadow-2xl flex flex-col gap-2"
        >
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Image src="/cap.png" alt="" width={44} height={44} />
            Vertex
          </h1>
          <h2 className="text-gray-400">Sign in to your account</h2>
          <Clerk.GlobalError className="text-sm text-red-400" />
          <Clerk.Field name="identifier" className="flex flex-col gap-2">
            <Clerk.Label className="text-xs text-gray-500">
              Username
            </Clerk.Label>
            <Clerk.Input
              type="text"
              value={"admin"}
              readOnly
              required
              className="p-2 rounded-md ring-1 ring-gray-300"
            />
            <Clerk.FieldError className="text-xs text-red-400" />
          </Clerk.Field>
          <Clerk.Field name="password" className="flex flex-col gap-2">
            <Clerk.Label className="text-xs text-gray-500">
              Password
            </Clerk.Label>
            <Clerk.Input
              type="password"
              value={"admin"}
              readOnly
              required
              className="p-2 rounded-md ring-1 ring-gray-300"
            />
            <Clerk.FieldError className="text-xs text-red-400" />
          </Clerk.Field>
          <div onClick={handleSignIn} className="mx-auto w-full ">
          <SignIn.Action
            
            submit
            className="bg-blue-500 hover:bg-blue-700 text-white my-1 w-full rounded-md text-sm p-[10px]"
          > {loading ? "Signing..": "Sign In"}
           
          </SignIn.Action>
          </div>
          <div className="items-center mx-auto bg-slate-200 rounded-3xl p-1 px-4">
               <p>Guest mode <span className="text-green-500 font-semibold text-lg">on</span></p>
          </div>
       
        </SignIn.Step>
      </SignIn.Root>
      
    </div>
  );
};

export default LoginPage;

