import {Collection, Tag, Task, ToDoTask} from '@/types/enums';

export const calculateNextDueDate = (task, completionDate) => {

    if (!task.recurring) {
        // Non-recurring task: no next due date
        return null;
    }

    if (!task.interval_value || !task.interval_unit) return; // Error


    const baseDate =
        (task.interval_unit && task.interval_value && !task.day_of_week && !task.date_of_month && !task.month_of_year && !task.skip_missed_due_dates) ||
        (task.interval_unit == "week" && task.day_of_week) ||
        (task.interval_unit == "month" && task.date_of_month) ||
        (task.interval_unit == "year" && (task.month_of_year || (task.month_of_year && task.date_of_month)))
            ? new Date(task.next_due_at) // Use previous due date if relevant specifying values exist
            : new Date(completionDate);  // Otherwise, use completion date

    const nextDueDate = new Date(baseDate);


    switch (task.interval_unit) {
        case "day":
            nextDueDate.setDate(nextDueDate.getDate() + task.interval_value);
            break;

        case "week":
            if (task.day_of_week !== null) {
                // Specific week day is selected
                let targetDay = task.day_of_week;
                let currentDay = nextDueDate.getUTCDay();
                let dayDifference = (targetDay - currentDay + 7) % 7;

                if (task.skipMissedDueDates) {
                    // If skipping missed due dates, add multiples of interval value amount of weeks to the previous due date
                    while (nextDueDate <= completionDate) {
                        nextDueDate.setDate(nextDueDate.getDate() + task.interval_value * 7);
                    }
                    // Since the due date might not have been on the selected day (manual editing), then adjust for the difference
                    nextDueDate.setDate(nextDueDate.getDate() + dayDifference);
                } else {
                    // If not skipping missed due dates, then calculate the next appropriate date that is interval value amount of weeks away and on the correct week day
                    nextDueDate.setDate(nextDueDate.getDate() + task.interval_value * 7 + dayDifference);
                }
            } else {
                // If no specific day is selected, then the weeks are added to the last completion date
                nextDueDate.setDate(nextDueDate.getDate() + task.interval_value * 7);
            }
            break;

        case "month":
            if (task.date_of_month !== null) {
                // Specific date of a month is selected
                let targetDay = task.date_of_month;

                // Set the date to a number that exists in all months (to avoid increasing the month and days carrying over into the next month)
                nextDueDate.setDate(1);

                if (task.skipMissedDueDates) {
                    // If skipping missed due dates, add multiples of interval value amount of months to the previous due date
                    while (nextDueDate <= completionDate) {
                        nextDueDate.setMonth(nextDueDate.getMonth() + task.interval_value);
                    }
                } else {
                    // If not skipping missed due dates, add interval value amount of months to the previous due date
                    nextDueDate.setMonth(nextDueDate.getMonth() + task.interval_value);
                }

                // Check the amount of days in the result month
                const daysInMonth = new Date(nextDueDate.getFullYear(), nextDueDate.getMonth() + 1, 0).getDate();
                // Choose the smaller value - the targetDay or the amount of days in a month
                nextDueDate.setDate(Math.min(targetDay, daysInMonth));

            } else {
                // If not specific date is selected, then add the months to the last completion date
                // Set the date to a number that exists in all months (to avoid increasing the month and days carrying over into the next month)
                nextDueDate.setDate(1);
                // Calculate the next month
                nextDueDate.setMonth(nextDueDate.getMonth() + task.interval_value);

                // If no specific date is selected, then the interval value amount of months is added to the completion date
                const nextMonthLastDay = new Date(nextDueDate.getFullYear(), nextDueDate.getMonth() + 1, 0).getDate();  // Check what is the next due date's month's last day
                // Choose the smaller value - date of the completion or last day of the month
                nextDueDate.setDate(Math.min(baseDate.getDate(), nextMonthLastDay));

            }
            break;

        case "year":
            if (task.month_of_year !== null) {
                // Specific month is selected
                const targetMonth = task.month_of_year - 1;

                // Set the date to a number that exists in all months (to avoid increasing the month and days carrying over into the next month)
                nextDueDate.setDate(1);

                if (task.skipMissedDueDates) {
                    // If skipping missed due dates, add multiples of interval value amount of years to the previous due date.
                    while (nextDueDate <= completionDate) {
                        nextDueDate.setFullYear(nextDueDate.getFullYear() + task.interval_value);
                    }
                } else {
                    // If not skipping missed due dates, then calculate the next interval value amount of years away from the due date.
                    nextDueDate.setFullYear(nextDueDate.getFullYear() + task.interval_value);
                }

                // Set the desired month of the year
                nextDueDate.setMonth(targetMonth);
                // Configure the target day - if set, use that value, if not, use the amount of days in the month
                const targetDay = task.date_of_month || new Date(nextDueDate.getFullYear(), targetMonth + 1, 0).getDate();
                // Calculate the amount of days in the final due date
                const daysInMonth = new Date(nextDueDate.getFullYear(), targetMonth + 1, 0).getDate();
                // Choose the smaller value - set target day or the last date of the month
                nextDueDate.setDate(Math.min(targetDay, daysInMonth));
            } else {
                // If no specific month is selected, then the interval value amount of years is added to the completion date
                nextDueDate.setFullYear(nextDueDate.getFullYear() + task.interval_value);
            }
            break;

        default:
            console.error("Invalid interval_unit:", task.interval_unit);
            return null;
    }

    return nextDueDate;
}

export const calculateCompletionStartDate = (due_date, completion_window_days) => {
    console.log("inside the calculateCompletionStartDate")

    let completionStart = null;
    if (due_date !== null && completion_window_days !== null && completion_window_days >= 0) {
        console.log("if statement true")
        console.log("due_date !== null " + (due_date !== null))
        console.log("completion_window_days !== null " + (completion_window_days !== null))
        console.log("completion_window_days >= 0" + (completion_window_days >= 0))
        console.log("completion_window_days" + completion_window_days)
        console.log()
        completionStart = new Date(due_date);
        console.log("base date " + completionStart)
        completionStart.setDate(completionStart.getDate() - completion_window_days);
        console.log("new date " + completionStart)

    }
    console.log("value returned " + completionStart)
    return completionStart;
}

export const calculateCompletionStartDateString = (due_date, completion_window_days) : string | null => {
    console.log("inside the calculateCompletionStartDateString")
    let completionStart = calculateCompletionStartDate(due_date, completion_window_days);
    console.log("before returning")
    console.log("value " + completionStart)
    console.log("returning value = " + (completionStart?.toISOString() ?? null))
    return completionStart?.toISOString() ?? null;
}