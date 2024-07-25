import checkHabitCompleted from "../../../../Utils/habits/checkHabitCompleted.js";
import {DateTime} from "luxon";

export default function checkLogEntryAllowed(habitInfoRecords, logs) {
    if (!checkHabitCompleted(habitInfoRecords)) {
        return false;
    }
    if (logs.length === 0) {
        return true;
    }
    const lastLogCreatedTime = DateTime.fromSeconds(logs[0].createdAt.seconds).startOf("day");
    const now = DateTime.now().startOf("day");
    return !lastLogCreatedTime.equals(now) && checkHabitCompleted(habitInfoRecords);
}