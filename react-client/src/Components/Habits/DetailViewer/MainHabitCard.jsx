import React, {useContext} from 'react';
import HabitDetailEditor from "./HabitDetailEditor.jsx";
import {AppContext} from "../../Contexts/AppContext.jsx";
import HabitCardBase from "../../UI/HabitCardBase.jsx";

export default function MainHabitCard({habitInfoEditor, habitCardClassname, setHabitInfoEditor, updateHabitDetails}) {
    const habitInfo = useContext(AppContext).getter;
    console.log(habitInfo);
    return (
        <div>
            {habitInfoEditor && (
                <HabitCardBase className={habitCardClassname}>
                    <HabitDetailEditor
                        title={habitInfo.title}
                        missionStatement={habitInfo.missionStatement}
                        showEditor={habitInfoEditor}
                        setShowEditor={setHabitInfoEditor}
                        textBoxWidth={"350px"}
                        callback={updateHabitDetails}
                    />
                </HabitCardBase>
            )}
            {!habitInfoEditor && (<HabitCardBase className={habitCardClassname}><h1>{habitInfo.title}</h1>
                <p>{habitInfo.missionStatement}</p></HabitCardBase>)}
        </div>
    );
}
