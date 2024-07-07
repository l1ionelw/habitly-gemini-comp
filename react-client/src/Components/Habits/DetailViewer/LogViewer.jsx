import HabitDetailEditor from "./HabitDetailEditor.jsx";
import {DateTime} from "luxon";
import backendUpdateLogs from "../../../Utils/backend/backendUpdateLogs.js";
import {produce} from "immer";
import backendDeleteLogs from "../../../Utils/backend/backendDeleteLogs.js";
import CompletedIndicator from "../CompletedIndicator.jsx";
import Button from "../../UI/Button.jsx";

export default function LogViewer({habitId, logs, setLogs}) {
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

    async function deleteLog() {
        if (window.confirm("Are you sure? This action cannot be undone!")) {
            await backendDeleteLogs(habitId).then(resp => {
                console.log(resp);
                setLogs(produce(draft => {
                    draft.splice(0, 1)
                }))
            })
        }
    }

    return (<div>
            {logs.map((content) =>
                <>
                    <h3>{content.title}</h3>
                    <p>{content.content}</p>
                    {logIsToday(content) &&
                        <div>
                            <HabitDetailEditor title={content.title} missionStatement={content.content}
                                               callback={updateLogContent}
                                               variant={!logIsToday(content) ? "NoEdit" : ""}/>
                            <br/>
                            <Button text={"Delete Log"} onClick={deleteLog} size={13}/>
                        </div>
                    }

                    <br/>
                </>
            )
            }
        </div>
    )
}