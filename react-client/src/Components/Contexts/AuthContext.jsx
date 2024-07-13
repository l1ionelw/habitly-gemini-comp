import {getAuth, onAuthStateChanged} from "firebase/auth";
import {createContext, useContext, useEffect, useState} from "react";

export const Auth = createContext();

export default function AuthContext({children}) {
    const auth = getAuth();
    const [user, setUser] = useState(null);
    const [authState, setAuthState] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setAuthState("Logged In");
                setUser(currentUser);
            } else {
                setAuthState("Not Logged In");
            }
            setIsLoading(false);
        })
    }, [])
    const values = {
        authState: authState,
        user: user,
    }
    return <Auth.Provider value={values}>{!isLoading && children}</Auth.Provider>
}

