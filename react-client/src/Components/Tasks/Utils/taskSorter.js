export default function taskSorter(data, category, order) {
    if (!data || data === undefined) {
        return data;
    }
    if (category === "Completed") {
        let completedItems = data.filter((item) => item.completed === true);
        let incompleteItems = data.filter((item) => item.completed === false);
        completedItems = timeSorter(completedItems, order);
        incompleteItems = timeSorter(incompleteItems, order);
        let ret = [];
        for (let value of incompleteItems) ret.push(value);
        for (let value of completedItems) ret.push(value);
        data = ret;
    }
    if (category === "Time") {
        data = timeSorter(data, order);
    }
    return data;
    // if the category is by completed, order each section by ORDER, then merge back into original
    // if the catrgory is by time, simply sort by time
}

function timeSorter(data, order) {
    if (order === "Ascending") {
        data = data.sort((a, b) => a.createdAt.seconds - b.createdAt.seconds);
    }
    if (order === "Descending") {
        data = data.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
    }
    return data;
}

