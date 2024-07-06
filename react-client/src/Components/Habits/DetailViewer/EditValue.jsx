import {produce} from "immer";
import Button from "../../UI/Button.jsx";

export default function EditValue({setShowEditor, callback}) {
    function handleClick() {
        setShowEditor(produce(draft => !draft));
        callback();
    }

    return (
        <div>
            <Button text={"Edit"} onClick={handleClick}/>
        </div>
    )
}