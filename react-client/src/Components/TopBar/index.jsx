import "../Sidebar/sidebar.css"
import {useState} from "react";

export default function TopBar({elements, currentElement, setCurrentElement}) {

    function generateClassNames(element) {
        return `${element === currentElement ? "selected" : ""}`
    }

    return (
        <div className={"flex gap-x-5"}>
            {elements.map(element => (
                <div className={generateClassNames(element)} onClick={() => setCurrentElement(element)}>{element}</div>
            ))}
        </div>
    )
}