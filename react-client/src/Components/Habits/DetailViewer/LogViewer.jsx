import HabitCardBase from "../../UI/HabitCardBase.jsx";
import {DateTime} from "luxon";

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
                    <p>{DateTime.fromSeconds(content.createdAt.seconds).toISODate()} | {DateTime.fromSeconds(content.createdAt.seconds).toLocaleString(DateTime.TIME_WITH_SHORT_OFFSET)}</p>
                    <p>{content.content}</p>
                </HabitCardBase>
            )}
        </div>
    )
}