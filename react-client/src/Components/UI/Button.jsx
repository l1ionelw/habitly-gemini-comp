import "./Styles.css"

export default function Button({text, onClick, size, className, disabled, children}) {
    className = className ? className : "bg-gray-400"
    disabled = disabled === true
    className += `${disabled ? " bg-gray-100" : ""}`
    if (disabled) {
        return (
            <div className={`styled-button ${className}`}>
                <p style={{fontSize: `${size}px`}}>{text}</p>
            </div>
        )
    } else {
        return (
            <div className={`styled-button ${className}`} onClick={onClick}>
                <p style={{fontSize: `${size}px`}}>{text}</p>
                {children}
            </div>
        )
    }
}