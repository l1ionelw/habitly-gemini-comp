import React from 'react';

export default function TaskEntry({children}) {
    return (
        <div className={"flex gap-x-3"}>
            {children}
        </div>
    );
}

