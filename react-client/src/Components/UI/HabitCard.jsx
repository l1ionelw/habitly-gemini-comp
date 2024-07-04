import React from 'react';
import "./Styles.css"

export default function HabitCard({children, className, styles}) {

    return (
        <div className={`habit-card ${className}`} style={styles}>
            {children}
        </div>
    );
}
