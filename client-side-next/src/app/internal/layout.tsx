'use client';

import axios from "axios";
import Link from "next/link";
import {useRouter} from 'next/navigation'
import { useState, useEffect } from "react";
import { decodeToken } from "../utils/decodeToken";
import {UserWrapper} from '@/app/context/userContext'

interface TokenData {
  id: string;
  username: string;
  email: string;
  // Add other properties as needed
}

export default function InternalLayout({
    children, // will be a page or nested layout
  }: {
    children: React.ReactNode
  }) {
    const td = {id:'', username:'', email:''}
    const router = useRouter();
    const [decodedToken, setDecodedToken] = useState()

    const logoutUser = async () => {
        try{
            await axios.get('/api/users/logout');
            router.push('/login')
        }catch(error:any){
            console.log('Error while logout: ' + error.message);
        }
    }
   
    return (
      <section>
        {/* Include shared UI here e.g. a header or sidebar */}
        <nav>
          <div className="my-10 flex justify-around ">
            <Link href="/internal/book-now">Book Now</Link>
            <Link href="/internal/profile">Profile</Link>
            <button
              className="uppercase bg-white text-black rounded-full px-10 py-2 hover:bg-red-500 hover:text-white"
              onClick={logoutUser}>
              logout
            </button>
			    </div>
        </nav>
        <UserWrapper>
          {children}
        </UserWrapper>
      </section>
    )
  }