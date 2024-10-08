import ReactDOM from 'react-dom/client'
import './index.css'
import React from 'react'
import {RouterProvider} from "react-router-dom";
import {BrowserRoutes} from "./BrowserRoutes.jsx";
import AuthContext from "./Components/Contexts/AuthContext.jsx";
import AppContextProvider from "./Components/Contexts/AppContext.jsx";

// firebase emulators:start --import emulator-data --export-on-exit emulator-data

export const API_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL: "http://localhost:5001"

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthContext>
            <AppContextProvider>
                <RouterProvider router={BrowserRoutes}/>
            </AppContextProvider>
        </AuthContext>
    </React.StrictMode>
)
