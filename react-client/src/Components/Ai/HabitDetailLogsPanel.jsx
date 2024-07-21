import React from 'react';
import HabitCardBase from "../UI/HabitCardBase.jsx";

export default function HabitDetailLogsPanel() {
    const habitCardClassname = "item-completed mb-5";
    return (
        <HabitCardBase className={habitCardClassname}>
            <h3>Log Summary</h3>
            <p>Log summaries, powered by Google Gemini, are a good way to view key progress metrics such as: activity
                patterns, your strengths, weaknesses, area of growth, and more. </p>
        </HabitCardBase>
    );
}
