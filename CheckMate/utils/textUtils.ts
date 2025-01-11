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

    if (intervalValue == "1") {
        // 1 - no number and singular unit
        description += intervalUnit;
    } else {
        // number and plural unit
        description += `${intervalValue} ${intervalUnit}s`;
    }

    const days = {
        "1": "Monday",
        "2": "Tuesday",
        "3": "Wednesday",
        "4": "Thursday",
        "5": "Friday",
        "6": "Saturday",
        "7": "Sunday",
    }

    if (intervalUnit === "day") {
        // No other specifying options for days.
    } else if (intervalUnit === "week" && dayOfWeek) {
        // Every week on weekday.
        description += ` on ${days[dayOfWeek]}`;
    } else if (intervalUnit === "month" && dateOfMonth) {
        // Every month on Xth date.
        const dayWithSuffix = `${dateOfMonth}${getNumberSuffix(Number(dateOfMonth))}`;
        description += ` on ${dayWithSuffix}`;
    } else if (intervalUnit === "year" && monthOfYear) {
        if (dateOfMonth) {
            // Every year on the Xth date of month.
            const dayWithSuffix = `${dateOfMonth}${getNumberSuffix(Number(dateOfMonth))}`;
            description += ` on ${dayWithSuffix} ${monthOfYear}`;
        } else {
            // Every year in month.
            description += ` in ${monthOfYear}`;
        }
    }

    return description;
}

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short', timeZone: 'UTC' };
    return date.toLocaleDateString(undefined, options);
};

export const formatShortDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short', year: '2-digit', timeZone: 'UTC' };
    return date.toLocaleDateString(undefined, options);
};

export const formatDateWithDay = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'long', day: 'numeric', month: 'short', year: '2-digit', timeZone: 'UTC' };
    return date.toLocaleDateString(undefined, options);
};