import React from 'react';

export default function ContentBlurred({children, showEditor}) {
    return (
        <div className={`${showEditor ? "nofocus" : ""}`}>{children}</div>
    );
}
