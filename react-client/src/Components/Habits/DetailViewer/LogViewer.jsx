export default function LogViewer({logs}) {
    return (
        <div>
            {logs.map(content =>
                <div><h3>{content.title}</h3>{JSON.stringify(content)}<br/><br/><br/></div>)}
        </div>
    )
}