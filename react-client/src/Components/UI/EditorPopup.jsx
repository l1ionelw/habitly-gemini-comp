import React, {useState} from 'react';
import Card from "./Card.jsx";
import Button from "./Button.jsx";

export default function EditorPopup({visible, validation, onCancel, onSubmit, header, pretitle, precontent}) {
    const [title, setTitle] = useState(pretitle ? pretitle : "");
    const [content, setContent] = useState(precontent ? precontent : "");
    const LOG_TITLE_MAX_LENGTH = 45;
    const LOG_CONTENT_MAX_LENGTH = 700;

    function submitAction() {
        if (!validation(title, content)) {
            console.log("Validation not passed, skipping");
            return;
        }
        onSubmit(title, content);
        setTitle("");
        setContent("");
    }
    return (
        <div hidden={!visible} className={"centered-xy"}
             style={{backgroundColor: "lightblue", padding: "1rem 1rem", borderRadius: "0.2rem"}}>
        <Card>
            <h3>{header}</h3>
            <form>
                <div className={'flex flex-col gap-y-1'}>
                    <input
                        placeholder={"title"}
                        value={title} onChange={(e) => setTitle(e.target.value)}
                        maxLength={LOG_TITLE_MAX_LENGTH}
                        className={"styled-input"}
                    />
                    <textarea placeholder={"content"}
                              value={content}
                              onChange={(e) => setContent(e.target.value)}
                              maxLength={LOG_CONTENT_MAX_LENGTH}
                              className={"styled-textarea resize-none"}
                              style={{fontSize: "20px"}}
                    />
                </div>
                <br/>
                <div className={"flex"}>
                    <Button text={"Cancel"} size={15} onClick={onCancel} className={"ml-8"}/>
                    <div className={"flex-spacer"}></div>
                    <Button text={"Add"} size={15} onClick={submitAction} className={"mr-8"}/>
                </div>
            </form>
        </Card>
        </div>
    );
}
