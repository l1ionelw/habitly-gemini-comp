import HabitDetailEditor from "./HabitDetailEditor.jsx";
import {DateTime} from "luxon";
import backendUpdateLogs from "../../../Utils/backend/backendUpdateLogs.js";
import {produce} from "immer";

export default function LogViewer({logs, setLogs}) {
    async function updateLogContent(updatedTitle, updatedContent) {
        console.log(updatedTitle);
        console.log(updatedContent);
        // get latest log
        const lastLog = logs[0];
        const lastLogCreatedTime = DateTime.fromSeconds(lastLog.createdAt.seconds).startOf("day");
        const now = DateTime.now().startOf("day");
        console.log(lastLog);
        if (!lastLogCreatedTime.equals(now)) {
            return console.log("unable to update log");
        }
        await backendUpdateLogs(lastLog.id, updatedTitle, updatedContent).then(e => {
            console.log(e);
            setLogs(produce(draft => {
                draft[0].title = updatedTitle;
                draft[0].content = updatedContent;
            }))
        })
    }

    function logIsToday(log) {
        return DateTime.now().startOf("day").equals(DateTime.fromSeconds(log.createdAt.seconds).startOf("day"));
    }

    return (<div>
            {logs.map((content) =>
                <>
                    <h3>{content.title}</h3>
                    <p>{JSON.stringify(content)}</p>
                    <HabitDetailEditor title={content.title} missionStatement={content.content}
                                       callback={updateLogContent} variant={!logIsToday(content) ? "NoEdit" : ""}/>
                    <br/>
                </>
            )
            }
        </div>
    )
}