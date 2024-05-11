/*
Creates the user context for the internal pages of the app. Sends a GET request to /api/users/info
that returns the current user's public data based on JWT decoding. This data is passed to internal pages
that need it in order to display the dynamic content.
*/

'use client';

import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const [appState, setAppState] = useState({loading:false});

const AppContext = createContext(appState);

export function AppWrapper({children} : {
    children: React.ReactNode;
}) {

    return (
        <AppContext.Provider value={appState}>
            {children}
        </AppContext.Provider>
    )
}

export function useUserContext() {
    return useContext(AppContext);
}