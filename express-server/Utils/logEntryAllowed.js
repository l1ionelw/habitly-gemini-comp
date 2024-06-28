const {DateTime} = require("luxon");
const checkHabitCompleted = require("./checkHabitCompleted");

function logEntryAllowed(lastSubmittedLog, userTimeZone, records) {
    if (!lastSubmittedLog) {
        return true;
    }
    const lastLogCreatedTime = DateTime.fromSeconds(lastSubmittedLog.createdAt.seconds, {zone: userTimeZone}).startOf("day");
    const now = DateTime.now().setZone(userTimeZone).startOf("day");
    return !lastLogCreatedTime.equals(now) && checkHabitCompleted(records);
}
module.exports = logEntryAllowed;