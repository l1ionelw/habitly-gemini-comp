import React from 'react';

export default function CompletedCircleIndicator({className, onClick}) {
    function handleClick() {
        onClick();
    }

    return (
        <div className={`circle-indicator ${className}`} onClick={handleClick}></div>
    );
}
