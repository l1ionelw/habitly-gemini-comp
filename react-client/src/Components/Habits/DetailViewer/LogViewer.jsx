import recursiveLogSummary from "../../Ai/Utils/recursiveLogSummary.js";
import HabitCardBase from "../../UI/HabitCardBase.jsx";
import {DateTime} from "luxon";
import Button from "../../UI/Button.jsx";
import AiCard from "../../UI/AiCard.jsx";
import {useState} from "react";

export default function LogViewer({setViewState, setViewInfo, logs}) {
    const [aiMessage, setAiMessage] = useState("");
    const [aiState, setAiState] = useState("Idle");
    const buttonSize = 13;

    function selectLog(logInfo) {
        setViewState("SingleLog");
        setViewInfo(logInfo);
    }

    async function generateLogSummaries(type) {
        if (type === "1Week") await generateSummary(2, 7)
        if (type === "1Month") await generateSummary(7, 30);
        if (type === "3Months") await generateSummary(30, 90);
        if (type === "6Months") await generateSummary(60, 180);
        if (type === "1Year") await generateSummary(90, 360);
    }
    async function generateSummary(dayRange, targetDays) {
        setAiState("Loading");
        let summary = await recursiveLogSummary(logs, dayRange, targetDays, true);
        let result = ""
        summary.map(sum => result += sum.startDay + " - " + sum.endDay + "\n" + sum.summary)
        setAiMessage(result);
        setAiState("Done");
        return result
    }

    return (
        <div>
            <div className={"mb-5"}>
                {
                    aiState !== "Unloaded" &&
                    <AiCard
                        message={aiMessage}
                        state={aiState}
                        setState={setAiState}
                        onClickAction={generateLogSummaries}>
                        <p>Generate log summaries by: </p>
                        <div className={"flex gap-x-2 gap-y-2 flex-wrap"} >
                            <Button text={"Last Week"} size={buttonSize} onClick={()=>generateLogSummaries("1Week")} />
                            <Button text={"Last Month"} size={buttonSize} onClick={()=>generateLogSummaries("1Month")} />
                            <Button text={"Last 3 Months"} size={buttonSize} onClick={()=>generateLogSummaries("3Months")} />
                            <Button text={"Last 6 Months"} size={buttonSize} onClick={()=>generateLogSummaries("6Months")} />
                            <Button text={"Last Year"} size={buttonSize} onClick={()=>generateLogSummaries("1Year")}/>
                        </div>
                    </AiCard>
                }
            </div>

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