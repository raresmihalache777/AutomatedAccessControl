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
import Image from 'next/image'


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
            window.location.reload()
            //router.push('/login')
            appState.toggleLoadingState(false)
        }catch(error:any){
            console.log('Error while logout: ' + error.message);
        }
    }


    if(appState.alert.alert){
      return(
        <div className="fixed inset-0 flex items-center justify-center bg-white/50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="mb-4 text-lg font-semibold">{appState.alert.message}</p>
            <button
              className="text-white bg-red-600 rounded-full px-10 py-1 hover:bg-red-700 mx-5"
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
        <section className="flex flex-col items-center justify-center">
          <div className="fixed top-0 flex flex-row justify-around items-center w-screen bg-slate-50 py-2">
            <Image
              src="/logo_play.svg"
              width={75}
              height={75}
              alt="Logo"
            />
            <nav>
                <div className="py-5 grid grid-cols-3 gap-4">
                  <Link className="text-center border-b border-slate-300 border-thin hover:border-slate-500 hover:border-b-2" href="/internal/book-now">Book Now</Link>
                  {userState.type === 'a' ? <Link className="text-center border-b border-slate-300 border-thin hover:border-slate-500 hover:border-b-2" href="/admin/dashboard">Dashboard</Link> : <Link className=" text-center border-b border-slate-300 border-thin hover:border-slate-500 hover:border-b-2" href="/internal/profile">Profile</Link>}
                  <button
                    className="text-white bg-blue-600 rounded-full px-10 py-1 hover:bg-blue-700"
                    onClick={logoutUser}>
                    Logout
                  </button>
                </div>
            </nav>
          </div>
          <div className=''>
              {children}
          </div>
        </section>
    )
    }
  }