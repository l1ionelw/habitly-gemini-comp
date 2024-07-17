export default function filterAscending(data) {
    return data.sort((a, b) => a.createdAt - b.createdAt);
}