/*
Creates the user context for the internal pages of the app. Sends a GET request to /api/users/info
that returns the current user's public data based on JWT decoding. This data is passed to internal pages
that need it in order to display the dynamic content.
*/

'use client';

import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext({id:'', username:'', email:'', type:''});

export function UserWrapper({children} : {
    children: React.ReactNode;
}) {
    const [userState, setUserState] = useState({id:'', username:'', email:'', type:''})

    const getUserInfo = async () => {
        try{
          const userData = await axios.get('/api/users/info')
          setUserState({id:userData.data.message.id, username:userData.data.message.username, email:userData.data.message.email, type:userData.data.message.type})
        }catch(err:any){
          console.log('Error while get user info: ' + err.message);
        }
    }

    useEffect(() => {
        getUserInfo()
    }, [])


    return (
        <UserContext.Provider value={userState}>
            {children}
        </UserContext.Provider>
    )
}

export function useUserContext() {
    return useContext(UserContext);
}