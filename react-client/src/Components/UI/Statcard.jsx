import React from 'react';

export default function Statcard({svgPath, title, content}) {
    const cardStyles = {
        width: "30%",
        maxWidth: "600px",
        backgroundColor: "#d9d9d9"
    }
    const svgStyles = {
        maxHeight: "200px",
        height: "40%",
        width: "30%",
        alignSelf: "center",
        marginLeft: "1rem",
    }
    return (
        <div className={"flex gap-x-4 rounded"} style={cardStyles}>
            <svg viewBox="0 0 512 512"
                 style={svgStyles} preserveAspectRatio={"xMidYMid meet"}>{svgPath}</svg>
            <div className={"leading-4 self-center pr-4"}>
                <h3>{title}</h3>
                <h2 className={"leading-5"}>{content}</h2>
            </div>
        </div>
    );
}
