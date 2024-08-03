import "./sidebar.css"
import shouldSelect from "../../Utils/shouldSelect.js";
import useWindowDimensions from "../../Utils/getWindowDimensions.jsx";
import {useContext, useState} from "react";
import {Auth} from "../Contexts/AuthContext.jsx";

export default function Sidebar({children}) {
    const user = useContext(Auth).user;
    const {height, width} = useWindowDimensions();
    const [mobileSideBarClicked, setMobileSideBarClicked] = useState(false);
    const isSmall = width < 615
    let hideSideBar = mobileSideBarClicked ? false : (width < 615)
    const sideBarWidth = hideSideBar ? 40 : 250
    const contentMargin = sideBarWidth + 16;

    const FullSideBar = (<div className={"sidebar"} style={{width: `${sideBarWidth}px`}}>
        <h1 className={"ml-3"}>Habitly</h1>
        <a href={"/habits/"}>
            <div className={`sidebar-selection ${shouldSelect("/habits")}`}>Habits</div>
        </a>
        <a href={"/tasks/"}>
            <div className={`sidebar-selection ${shouldSelect("/tasks")}`}>Tasks</div>
        </a>
        <a href={"/dailylog/"}>
            <div className={`sidebar-selection ${shouldSelect("/dailylog")}`}>Daily Log</div>
        </a>
        {isSmall && <div className={`sidebar-selection cursor-pointer`} onClick={()=>setMobileSideBarClicked(false)}>Collapse Sidebar</div>}
        <div className={"flex-spacer"}></div>
        <div className={`sidebar-selection mr-3 text-sm leading-3`}>
            <p><strong>{user.displayName}</strong></p>
            <p>{user.email}</p>
        </div>
        <a href={"/logout/"}>
            <div className={`mb-2 sidebar-selection ${shouldSelect("/logout")}`}>Log Out</div>
        </a></div>)

    const MobileSideBar = (<div className={"sidebar cursor-pointer"} style={{width: `${sideBarWidth}px`}}
                                onClick={() => setMobileSideBarClicked(true)}>
        <div className={"flex flex-col gap-y-2 ml-4 mt-6"}>
            <div>S</div>
            <div>I</div>
            <div>D</div>
            <div>E</div>
            <div>B</div>
            <div>A</div>
            <div>R</div>
        </div>
    </div>)

    return (
        <>
            {!hideSideBar && FullSideBar}
            {hideSideBar && MobileSideBar}
            <div className={"sidebar-content"} style={{marginLeft: `${contentMargin}px`}}>
                {children}
            </div>
        </>

    )
}