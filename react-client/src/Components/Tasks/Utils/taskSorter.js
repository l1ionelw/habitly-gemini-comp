export default function taskSorter(originalState, category, order) {
    if (!originalState) {
        return originalState;
    }
    let data = [...originalState];
    if (category === "Completed") {
        data = completionSorter(data, order);
    }
    if (category === "Time") {
        data = timeSorter(data, order);
    }
    return data;
}

function timeSorter(data, order) {
    if (order === "Ascending") {
        data = data.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
        data = data.reverse();
    }
    if (order === "Descending") {
        data = data.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
    }
    return data;
}

function completionSorter(data, order) {
    let completedItems = data.filter((item) => item.completed === true);
    let incompleteItems = data.filter((item) => item.completed === false);
    completedItems = timeSorter(completedItems, "Descending");
    incompleteItems = timeSorter(incompleteItems, "Descending");
    let ret = [];
    if (order === "Descending") {
        for (let value of incompleteItems) ret.push(value);
        for (let value of completedItems) ret.push(value);
    }
    if (order === "Ascending") {
        for (let value of completedItems) ret.push(value);
        for (let value of incompleteItems) ret.push(value);
    }
    return ret;
}
