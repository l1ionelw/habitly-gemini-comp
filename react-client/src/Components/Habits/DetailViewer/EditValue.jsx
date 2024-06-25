import {produce} from "immer";

export default function EditValue({setShowEditor, variant}) {
    function handleClick() {
        setShowEditor(produce(draft => !draft));
    }

    return (
        <div>
            <button onClick={handleClick}>Edit</button>
        </div>
    )
}