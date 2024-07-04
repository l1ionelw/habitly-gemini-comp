import "./Styles.css"
export default function Button({text, onClick, size, className}) {
    className = className ? className : ""
    return (
        <div className={`styled-button ${className}`} onClick={onClick}>
            <p style={{fontSize: `${size}px`}}>{text}</p>
        </div>
    )
}