import {useContext, useEffect, useState} from "react";
import {Auth} from "../Contexts/AuthContext.jsx";
import getUserData from "../../Utils/getUserData.js";
import Loading from "../Loading.jsx";

export default function Habits() {
    /*
    isloading is true
    check if user is logged in
    get user id
    get user things by id
    set isloading to false
    return it
     */
    const [userData, setUserData] = useState(null);
    const userId = useContext(Auth).user.uid;
    useEffect(() => {
        getUserData(userId).then(data => {
            console.log(data)
            setUserData(data);
        })
    }, [userId]);

    if (userData) {
        return (
            <div>
                <div className={"text-emerald-600"}>
                    <h1>{userData.name}</h1>
                    <h3>{userData.email}</h3>
                </div>


            </div>
        )
    }
    return <Loading/>
}