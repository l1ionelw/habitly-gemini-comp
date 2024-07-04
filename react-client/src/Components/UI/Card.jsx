export default function Card({children}) {
    const cardStyles = {
        borderRadius: "0.13rem",
        backgroundColor: "lightblue",
        zIndex: 2,
    }
    return (
        <div style={cardStyles}>
            {children}
        </div>
    )
}