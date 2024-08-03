import "./Styles.css"

export default function Button({text, onClick, size, className, disabled, children, variant}) {
    // variants: primary, secondary, light
    className = className ? className : " bg-gray-400 "
    className += `${disabled ? " bg-gray-100" : " cursor-pointer "}`
    disabled = disabled === true


    if (variant === "primary") className += "font-semibold "
    if (disabled) className += "opacity-25 hover:opacity:25 styled-button-disabled cursor-default "

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