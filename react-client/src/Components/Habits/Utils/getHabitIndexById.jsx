export default function getHabitIndexById(habitsList, habitId) {
    for (let i = 0; i< habitsList.length; i++)  {
        if (habitsList[i].id === habitId) {
            return i
        }
    }
    return -1;
}