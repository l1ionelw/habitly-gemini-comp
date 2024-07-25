export default function getLogIndexById(logs, targetId) {
    console.log(logs);
    for (let i = 0; i < logs.length; i++) {
        if (logs[i].id === targetId) {
            return i;
        }
    }
    return -1;
}