import React, {useContext} from 'react';
import Statcard from "../../UI/Statcard.jsx";
import FireSVG from "../../Icons/FireSVG.jsx";
import CheckmarkSVG from "../../Icons/CheckmarkSVG.jsx";
import XmarkSVG from "../../Icons/XmarkSVG.jsx";
import CalendarDaysSVG from "../../Icons/CalendarDaysSVG.jsx";
import BookLogJournalSVG from "../../Icons/BookLogJournalSVG.jsx";
import {DateTime} from "luxon";
import {AppContext} from "../../Contexts/AppContext.jsx";

export default function Stats({logs}) {
    const habitInfo = useContext(AppContext).getter;

    function trycatch(execute) {
        let value;
        try {
            value = execute()
        } catch (err) {
            console.log(err)
            value = -1;
        }
        return value;
    }

    function getTotalTimeSinceStart(formatted) {
        console.log("getting total time since start");
        const startDay = DateTime.fromSeconds(habitInfo.createdAt.seconds);
        const today = DateTime.now();
        const diff = today.diff(startDay, ["days", "hours", "minutes"]);
        return formatted ? `${diff.days}d ${diff.hours}h` : {"days": diff.days, "hours": diff.hours};
    }

    function getDaysCompleted() {
        console.log("getting total days completed");
        if (!habitInfo.records) return 0;
        return habitInfo.records.length;
    }

    function getDaysIncomplete() {
        console.log("getting days incompleted");
        return getTotalTimeSinceStart().days - getDaysCompleted();
    }

    function getLogsCount() {
        console.log("getting logs count");
        return logs.length;
    }

    function getCurrentStreak() {
        console.log("getting current streak");
        console.log(habitInfo.records);
        if (!habitInfo || habitInfo.records.length === 0) return 0;

        const todayDiff = DateTime.now().startOf("day").diff(DateTime.fromMillis(habitInfo.records[0]).startOf("day"), ["days"]).days;
        if (todayDiff > 1) return 0;

        let pointer = 0;
        let streak = 1;
        while (pointer < habitInfo.records.length - 1) {
            const thisTimestamp = DateTime.fromMillis(habitInfo.records[pointer]).startOf("day");
            const comparisonTimestamp = DateTime.fromMillis(habitInfo.records[pointer + 1]).startOf("day");
            const diff = thisTimestamp.diff(comparisonTimestamp, ["days"]).days;
            console.log(diff);
            if (diff > 1) return streak;
            streak++;
            pointer++;
        }
        return streak;
    }

    function getLongestStreak() {
        console.log("getting longest streak");
        if (!habitInfo || habitInfo.records.length === 0) return 0;
        let pointer = 0;
        let streak = 1;
        let maxStreak = 0;
        while (pointer < habitInfo.records.length - 1) {
            const thisTimestamp = DateTime.fromMillis(habitInfo.records[pointer]).startOf("day");
            const comparisonTimestamp = DateTime.fromMillis(habitInfo.records[pointer + 1]).startOf("day");
            const diff = thisTimestamp.diff(comparisonTimestamp, ["days"]).days;
            if (diff > 1) {
                maxStreak = Math.max(maxStreak, streak);
                streak = 0;
            }
            streak++;
            pointer++;
        }
        maxStreak = Math.max(maxStreak, streak);
        return maxStreak;
    }

    return (<div>
        <div className={"flex flex-row gap-x-3 mb-3"}>
            <Statcard title={"Current Streak"} content={trycatch(getCurrentStreak)}
                      svgPath={<FireSVG fill={"#ff9600"}/>}/>
            <Statcard title={"Longest Streak"} content={trycatch(getLongestStreak)}
                      svgPath={<FireSVG fill={"#4eb600"}/>}/>

            <Statcard title={"Days completed"} content={getDaysCompleted()} svgPath={<CheckmarkSVG/>}/>
        </div>
        <div className={"flex flex-row gap-x-3 mb-3"}>
            <Statcard title={"Days not completed"} content={getDaysIncomplete()} svgPath={<XmarkSVG/>}/>
            <Statcard title={"Days since started"} content={getTotalTimeSinceStart(true)}
                      svgPath={<CalendarDaysSVG/>}/>
            <Statcard title={"Total log entries"} content={getLogsCount()} svgPath={<BookLogJournalSVG/>}/>
        </div>
    </div>);
}
