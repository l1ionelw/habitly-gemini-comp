import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./CustomCalendar.css";
import {DateTime} from "luxon";
import {useState} from "react";


export default function HabitCompletedDaysCalendar({completedDates}) {
    const [calendarDates, setCalendarDates] = useState(convertToDay());

    function convertToDay() {
        let calendarDates = [];
        for (let x of completedDates) {
            const dateToIso = DateTime.fromMillis(x).toISODate();
            calendarDates.push(dateToIso);
        }
        return calendarDates;
    }

    function markTile({date, view}) {
        if (view === "month" && calendarDates.find((x) => x === DateTime.fromJSDate(date).toISODate())) {
            return 'completed'
        }
    }

    return (
        <div>
            <Calendar tileClassName={markTile}/>
        </div>
    )
}