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


    function getTotalTimeSinceStart(formatted) {
        const startDay = DateTime.fromSeconds(habitInfo.createdAt.seconds);
        const today = DateTime.now();
        const diff = today.diff(startDay, ["days", "hours", "minutes"]);
        return formatted ? `${diff.days}d ${diff.hours}h` : {"days": diff.days, "hours": diff.hours};
    }

    function getDaysCompleted() {
        if (!habitInfo.records) return 0;
        return habitInfo.records.length;
    }

    function getDaysIncomplete() {
        return getTotalTimeSinceStart().days - getDaysCompleted();
    }

    function getLogsCount() {
        return logs.length;
    }

    function getCurrentStreak() {
        if (habitInfo.records.length === 0) {
            console.log("no days yet");
            return "0d";
        }
        if (habitInfo.records.length === 1) {
            return "1d";
        }
        // TODO: check this later
        let startRange, endRange;
        let today = DateTime.now().startOf("day");
        let lastCompleted = DateTime.fromMillis(habitInfo.records[0]).startOf("day");
        let compDate;
        let startIndex = 1;
        if (today.equals(lastCompleted)) {
            startRange = today;
            compDate = today;
        }
        if (today.diff(lastCompleted, ["days"]).days === 1) {
            startRange = lastCompleted;
            compDate = lastCompleted;
        }
        if (!compDate) {
            console.log("Habit wasn't completed today or yesterday, no streak");
            return 0
        }

        for (let i = startIndex; i < habitInfo.records.length; i++) {
            let thisDate = DateTime.fromMillis(habitInfo.records[i]).startOf("day");
            if (compDate.diff(thisDate, ["days"]).days !== 1) {
                endRange = compDate;
                break
            }
            compDate = thisDate;
        }
        return startRange.diff(endRange, ["days"]).days + 1;
    }

    function getLongestStreak() {
        if (habitInfo.records.length === 0) {
            return 0;
        }
        if (habitInfo.records.length === 1) {
            return "1d";
        }
        // TODO: check this later
        let longestStreak = 0;
        let startRange = DateTime.fromMillis(habitInfo.records[0]).startOf("day");
        let compDate = DateTime.fromMillis(habitInfo.records[0]).startOf("day");
        let endRange;

        for (let day of habitInfo.records) {
            let thisDate = DateTime.fromMillis(day).startOf("day");
            if (compDate.diff(thisDate, ["day"]).days !== 1) {
                endRange = compDate;
                longestStreak = Math.max(longestStreak, startRange.diff(endRange, ["days"]).days + 1);
                startRange = thisDate;
            }
            compDate = thisDate;
        }
        return longestStreak;
    }

    return (
        <div>
            <div className={"flex flex-row gap-x-3 mb-3"}>
                <Statcard title={"Current Streak"} content={getCurrentStreak()}
                          svgPath={<FireSVG fill={"#ff9600"}/>}/>
                <Statcard title={"Longest Streak"} content={getLongestStreak()}
                          svgPath={<FireSVG fill={"#4eb600"}/>}/>

                <Statcard title={"Days completed"} content={getDaysCompleted()} svgPath={<CheckmarkSVG/>}/>
            </div>
            <div className={"flex flex-row gap-x-3 mb-3"}>
                <Statcard title={"Days not completed"} content={getDaysIncomplete()} svgPath={<XmarkSVG/>}/>
                <Statcard title={"Days since started"} content={getTotalTimeSinceStart(true)}
                          svgPath={<CalendarDaysSVG/>}/>
                <Statcard title={"Total log entries"} content={getLogsCount()} svgPath={<BookLogJournalSVG/>}/>
            </div>
        </div>
    );
}
