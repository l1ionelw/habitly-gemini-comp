import Button from "./Button";
import HabitCardBase from "./HabitCardBase";

export default function AiCard({ children, message, state, setState, onClickAction, className }) {
    // possible states: Idle, Unloaded, Error, Loading, Done
    return (
        <HabitCardBase className={`bg-violet-300 ${className}`}>
            <div className={"flex"}>
                <h3>AI Helper</h3>
                <div className={"flex-spacer"}></div>
                <Button text={"Close"} onClick={() => setState("Unloaded")} size={13} />
            </div>
            <p><i>Powered by Google Gemini</i></p>
            {state === "Loading" && <p>Loading</p>}
            {state === "Error" && <p>An unknown error occurred. Please check the console for more details</p>}
            {state === "Done" && <div dangerouslySetInnerHTML={{ __html: message }}></div>}
            {state === "Idle" && !children && <Button text={"Ask AI"} size={13} onClick={onClickAction} />}
            {children}
        </HabitCardBase>
    )
}