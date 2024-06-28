const {DateTime} = require("luxon");

function checkHabitCompleted(records) {
    if (!records || records.length === 0) {
        return false;
    }
    const lastTimeCompleted = DateTime.fromMillis(records[0]).startOf("day");
    const now = DateTime.now().startOf("day");

    return lastTimeCompleted.equals(now);
}

module.exports = checkHabitCompleted;