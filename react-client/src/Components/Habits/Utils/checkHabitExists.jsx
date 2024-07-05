// given an array of habits from 'query', determine if a habit title exists
export default function checkHabitExists(habitsList, habitTitleToCheck) {
    for (let x of habitsList) {
        if (x.title === habitTitleToCheck) {
            return true;
        }
    }
    return false;
}