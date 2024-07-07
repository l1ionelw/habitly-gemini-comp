import "./sidebar.css"

export default function Sidebar({children}) {
    function shouldSelect(url) {
        const pagePath = window.location.pathname;
        console.log(pagePath);
        if (url === "/") {
            if (url === pagePath) {
                return "selected"
            }
            return ""
        }
        if (pagePath.includes(url)) {
            return "selected";
        }
    }

    return (
        <>
            <div className={"sidebar"}>
                <h1 className={"ml-3"}>Habitly</h1>
                <a href={"/"}>
                    <div className={`sidebar-selection ${shouldSelect("/")}`}>Home</div>
                </a>
                <a href={"/habits/"}>
                    <div className={`sidebar-selection ${shouldSelect("/habits")}`}>Habits</div>
                </a>
                <a href={"/tasks/"}>
                    <div className={`sidebar-selection ${shouldSelect("/tasks")}`}>Tasks</div>
                </a>
                <a href={"/log/"}>
                    <div className={`sidebar-selection ${shouldSelect("/log")}`}>Log</div>
                </a>
                <a href={"/ai/"}>
                    <div className={`sidebar-selection ${shouldSelect("/ai")}`}>AI</div>
                </a>
                <div className={"flex-spacer"}></div>
                <a href={"/logout/"}>
                    <div className={`mb-2 sidebar-selection ${shouldSelect("/logout")}`}>Log Out</div>
                </a>
            </div>
            <div className={"sidebar-content"}>
                {children}
            </div>
        </>

    )
}