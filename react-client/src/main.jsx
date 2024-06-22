import ReactDOM from 'react-dom/client'
import './index.css'
import {RouterProvider} from "react-router-dom";
import {BrowserRoutes} from "./BrowserRoutes.jsx";
import AuthContext from "./Components/Contexts/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthContext>
                <RouterProvider router={BrowserRoutes}/>
        </AuthContext>
    </React.StrictMode>
)
