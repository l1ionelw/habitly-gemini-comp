import generateSummaryInternal from "../Utils/generateSummaryInternal.js";

export default async function generateLogSummaries(logs, type) {
    let dayRange, targetDays;
    if (type === "1Week") {
        dayRange = 7;
        targetDays = 7
    }
    if (type === "1Month") {
        dayRange = 7;
        targetDays = 30
    }
    if (type === "3Months") {
        dayRange = 30;
        targetDays = 90
    }
    if (type === "6Months") {
        dayRange = 60;
        targetDays = 180
    }
    if (type === "1Year") {
        dayRange = 90;
        targetDays = 360
    }
    return generateSummaryInternal(logs, dayRange, targetDays);
}