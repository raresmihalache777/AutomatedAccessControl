'use client';

import {useEffect, useState} from 'react'
import axios from "axios";
import Link from "next/link";
import { useUserContext } from "@/app/context/userContext";
import { useAppContext } from "@/app/context/appContext";
import LoadingOverlay from "../components/LoadingOverlay"
import Image from 'next/image'


export default function AdminLayout({
    children, 
  }: {
    children: React.ReactNode
  }) {

    const appContext = useAppContext();
    const userContext = useUserContext();
    

    const logoutUser = async () => {
        try{
            appContext.toggleLoadingState(true)
            await axios.get('/api/users/logout');
            window.location.reload()
        }catch(error:any){
            console.log('Error while logout: ' + error.message);
        }
    }

    return (
      <>
        {appContext.alert.alert ? 
          <div className="fixed z-50 bg-white/90 flex flex-col justify-center	items-center min-h-screen w-screen">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <p className="mb-4 text-lg font-semibold">{appContext.alert.message}</p>
              <button
                className="text-white bg-blue-600 rounded-full px-10 py-1 hover:bg-blue-700"
                onClick={() => {appContext.alert.setAlertState('',false)}}
              >
                Close
              </button>
            </div>
          </div> 
          : 
          <></>
        }
        {appContext.loading ? <LoadingOverlay/> : <></>}
        <section className="flex flex-col items-center justify-center">
          <div className="fixed top-0 flex flex-row justify-around items-center w-screen bg-slate-50 py-2">
            <Image
              src="/logo_play.svg"
              width={75}
              height={75}
              alt="Logo"
            />
            {true ?
              <nav>
                  <div className="py-5 grid grid-cols-3 gap-4">
                    <Link className="text-center border-b border-slate-300 border-thin hover:border-slate-500 hover:border-b-2" href="/internal/book-now">Book Now</Link>
                    {userContext.type === 'a' ? 
                      <Link 
                        className="text-center border-b border-slate-300 border-thin hover:border-slate-500 hover:border-b-2" 
                        href="/admin/dashboard">Dashboard
                      </Link> 
                    : 
                      <Link 
                        className=" text-center border-b border-slate-300 border-thin hover:border-slate-500 hover:border-b-2" 
                        href="/internal/profile">Profile
                      </Link>
                    }
                    <button
                      className="text-white bg-blue-600 rounded-full px-10 py-1 hover:bg-blue-700"
                      onClick={logoutUser}>
                      Logout
                    </button>
                  </div>
              </nav>
              :
              <div className="py-5 grid grid-cols-3 gap-4"></div>
            }
          </div>
          <div className=''>
              {children}
          </div>
      </section>
    </>
      
  )
}