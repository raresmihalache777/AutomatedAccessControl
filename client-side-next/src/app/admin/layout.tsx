'use client';

import axios from "axios";
import Link from "next/link";
import {useRouter} from 'next/navigation'
import { useState, useEffect } from "react";
import { decodeToken } from "../utils/decodeToken";
import {UserWrapper} from '@/app/context/userContext'
import { useUserContext } from "@/app/context/userContext";
import { useAppContext } from "@/app/context/appContext";
import LoadingOverlay from "../components/LoadingOverlay"

interface TokenData {
  id: string;
  username: string;
  email: string;
}

export default function InternalLayout({
    children, 
  }: {
    children: React.ReactNode
  }) {
    const router = useRouter();
    const [decodedToken, setDecodedToken] = useState()
    const userState = useUserContext();
    const appState = useAppContext();

    console.log(userState)
    console.log(appState)

    const logoutUser = async () => {
        try{
            appState.toggleLoadingState(true)
            await axios.get('/api/users/logout');
            router.push('/login')
            appState.toggleLoadingState(false)
        }catch(error:any){
            console.log('Error while logout: ' + error.message);
        }
    }
    //appState.toggleLoadingState()

    if(appState.alert.alert){
      return(
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="mb-4 text-lg font-semibold">{appState.alert.message}</p>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
              onClick={() => {appState.alert.setAlertState('',false)}}
            >
              Close
            </button>
          </div>
        </div>
      )
    }

    if(appState.loading){
      return(
        <LoadingOverlay/>
      )
    }else{
      return (
        <section className='flex items-center justify-center'>
          <div className='max-w-1200px'>
            <nav>
              <div className="my-10 flex justify-around ">
                {userState.type === 'a' ? <Link href="/admin/book-now-admin">Create booking</Link> : <Link href="/internal/book-now">Book Now</Link>}
                {userState.type === 'a' ? <Link href="/admin/dashboard">Dashboard</Link> : <Link href="/internal/profile">Profile</Link>}
                <button
                  className="uppercase bg-white text-black rounded-full px-10 py-2 hover:bg-red-500 hover:text-white"
                  onClick={logoutUser}>
                  logout
                </button>
              </div>
            </nav>
              {children}
          </div>
        </section>
    )
    }
  }