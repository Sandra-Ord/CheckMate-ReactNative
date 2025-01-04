export const getNumberSuffix = (day: number) => {
    const single = day % 10;
    if (single === 1) return 'st';
    if (single === 2) return 'nd';
    if (single === 3) return 'rd';
    return 'th';
};


export const getRecurrenceDescription = (intervalValue, intervalUnit, dayOfWeek, dateOfMonth, monthOfYear) => {
    // Ensure both intervalValue and intervalUnit are set before constructing the description
    if (!intervalValue || !intervalUnit) {
        return "Please select both the interval value and unit.";
    }

    let description = getBasicRecurrenceDescriptions(intervalValue, intervalUnit, dayOfWeek, dateOfMonth, monthOfYear, "The task is set to recur every ");
    description += ".";

    return description;
};

export const getBasicRecurrenceDescriptions = (intervalValue, intervalUnit, dayOfWeek, dateOfMonth, monthOfYear, base_text = "Every ") => {
    if (!intervalValue || !intervalUnit) {
        return "One-time task";
    }

    let description = base_text

    if (intervalValue === "1") {
        // 1 - no number and singular unit
        description += intervalUnit;
    } else {
        // number and plural unit
        description += `${intervalValue} ${intervalUnit}s`;
    }

    if (intervalUnit === "day") {
        // No other specifying options for days.
    } else if (intervalUnit === "week" && dayOfWeek) {
        // Every week on weekday.
        description += ` on ${dayOfWeek}`;
    } else if (intervalUnit === "month" && dateOfMonth) {
        // Every month on Xth date.
        const dayWithSuffix = `${dateOfMonth}${getNumberSuffix(Number(dateOfMonth))}`;
        description += ` on the ${dayWithSuffix}`;
    } else if (intervalUnit === "year" && monthOfYear) {
        if (dateOfMonth) {
            // Every year on the Xth date of month.
            const dayWithSuffix = `${dateOfMonth}${getNumberSuffix(Number(dateOfMonth))}`;
            description += ` on the ${dayWithSuffix} ${monthOfYear}`;
        } else {
            // Every year in month.
            description += ` in ${monthOfYear}`;
        }
    }

    return description;
}