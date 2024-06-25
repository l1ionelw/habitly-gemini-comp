import ReactDOM from 'react-dom/client'
import './index.css'
import React from 'react'
import {RouterProvider} from "react-router-dom";
import {BrowserRoutes} from "./BrowserRoutes.jsx";
import AuthContext from "./Components/Contexts/AuthContext.jsx";

export const API_URL = "http://localhost:5001"

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthContext>
                <RouterProvider router={BrowserRoutes}/>
        </AuthContext>
    </React.StrictMode>
)
