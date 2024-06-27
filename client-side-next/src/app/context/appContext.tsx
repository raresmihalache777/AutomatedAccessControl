'use client';

import { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext({loading:false, toggleLoadingState: (x:boolean) =>{}, alert:{message:'', alert:false ,setAlertState: (m: string, x:boolean) =>{}}});

export function AppWrapper({children} : {
    children: React.ReactNode;
}) {
    const [loadingState, setLoadingState] = useState(false);
    const [alertMessage, setAlertMessage] = useState('')
    const [showAlert, setShowAlert] = useState(false)

    const toggleLoadingState = (x:boolean) => {setLoadingState(x);}
    const toggleAlert = (m: string, x:boolean) =>{setAlertMessage(m), setShowAlert(x);}

    const appState = {
        loading:loadingState,
        toggleLoadingState,
        alert:{
            message:alertMessage,
            alert:showAlert,
            setAlertState: toggleAlert
        }
    }
    return (
        <AppContext.Provider value={appState}>
            {children}
        </AppContext.Provider>
    )
}

export function useAppContext() {
    return useContext(AppContext);
}