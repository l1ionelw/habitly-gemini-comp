import getUserId from "../../Utils/getUserId.js";
import {useEffect, useState} from "react";

export default function Home() {
    const [uid, setUid] = useState(null);
    useEffect(() => {
        getUserId(setUid);
    }, []);

    return (
        <div>
            <div>User is logged in. Make some fancy api calls to firestore and return a beautiful homepage when the hard
                work is over :p
            </div>
            <h3></h3>
        </div>
    )
}