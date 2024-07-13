import {createContext, useState} from "react";

export const AppContext = createContext();

export default function AppContextProvider({children}) {
    const [getter, setter] = useState();
    const value = {
        getter: getter,
        setter: setter
    }
    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}