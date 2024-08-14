import recursiveLogSummary from "./recursiveLogSummary.js";

export default async function generateSummaryInternal(logs, dayRange, targetDays) {
    let summary = await recursiveLogSummary(logs, dayRange, targetDays, true);
    let result = ""
    summary.map(sum => result += sum.startDay + " - " + sum.endDay + "\n" + sum.summary)
    if (summary.length === 0) {
        return "There are no logs in this date range."
    }
    return result
}