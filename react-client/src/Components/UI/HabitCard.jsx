import React from 'react';
import "./Styles.css"

export default function HabitCard({children, className, styles, onClick}) {
    return (
        <div className={`habit-card ${className}`} style={styles} onClick={onClick}>
            {children}
        </div>
    );
}
