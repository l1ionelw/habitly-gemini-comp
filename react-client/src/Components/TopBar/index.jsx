import "../Sidebar/sidebar.css"

export default function TopBar({elements, currentElement, setCurrentElement}) {

    function generateClassNames(element) {
        return `${element === currentElement ? "selected" : ""} p-3 cursor-pointer select-none`
    }

    const styles = {
        backgroundColor: "seagreen",
        padding: "1rem",
        borderRadius: "0.25rem",
        marginBottom: "1rem",
        alignItems: "center",
        marginRight: "1rem"
    }
    return (
        <div className={"flex gap-x-5"} style={styles}>
            {elements.map(element => (
                <div className={generateClassNames(element)} onClick={() => setCurrentElement(element)}>{element}</div>
            ))}
        </div>
    )
}