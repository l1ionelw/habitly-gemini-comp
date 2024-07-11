import React from 'react';

export default function CompletedCircleIndicator({taskId, className, onClick}) {
    function handleClick() {
        onClick(taskId);
    }

    return (
        <div className={`circle-indicator ${className}`} onClick={handleClick}></div>
    );
}
