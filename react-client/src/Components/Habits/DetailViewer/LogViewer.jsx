import HabitCardBase from "../../UI/HabitCardBase.jsx";

export default function LogViewer({setViewState, setViewInfo, logs}) {
    function selectLog(logInfo) {
        setViewState("SingleLog");
        setViewInfo(logInfo);
    }

    return (<div>
            {logs.map((content) =>
                <HabitCardBase className={"bg-emerald-200 mb-5 cursor-pointer hover:bg-emerald-300"}
                               onClick={() => selectLog(content)}>
                    <h3>{content.title}</h3>
                    <p>{content.content}</p>
                </HabitCardBase>
            )}
        </div>
    )
}