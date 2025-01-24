import {IntervalUnit, Notification, NotificationType} from "@/types/enums";

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

    if (intervalUnit === IntervalUnit.Days) {
        // No other specifying options for days.
    } else if (intervalUnit === IntervalUnit.Weeks && dayOfWeek) {
        // Every week on weekday.
        description += ` on ${days[dayOfWeek]}`;
    } else if (intervalUnit === IntervalUnit.Months && dateOfMonth) {
        // Every month on Xth date.
        const dayWithSuffix = `${dateOfMonth}${getNumberSuffix(Number(dateOfMonth))}`;
        description += ` on ${dayWithSuffix}`;
    } else if (intervalUnit === IntervalUnit.Years && monthOfYear) {
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
};

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {day: 'numeric', month: 'short', timeZone: 'UTC'};
    return date.toLocaleDateString(undefined, options);
};

export const formatShortDate = (dateString) => {
    const date = new Date(dateString);
    const options = {day: 'numeric', month: 'short', year: '2-digit', timeZone: 'UTC'};
    return date.toLocaleDateString(undefined, options);
};

export const formatDateWithDay = (dateString) => {
    const date = new Date(dateString);
    const options = {weekday: 'long', day: 'numeric', month: 'short', year: '2-digit', timeZone: 'UTC'};
    return date.toLocaleDateString(undefined, options);
};

export const getNotificationText = (notification: Notification) => {

    const collectionName = notification.collections?.name ?? notification.data?.collection_name ?? "";
    const taskName = notification.tasks?.name ?? notification.data?.task_name ?? "";

    switch (notification.type) {
        case NotificationType.Invitation:
            return `You were invited to the ${collectionName} Collection by ${notification.users?.first_name ?? "User"}`;
        case NotificationType.InvitationAccepted:
            return `${notification.users?.first_name ?? "User"} accepted your invitation to the ${collectionName} Collection`;
        case NotificationType.InvitationRejected:
            return `${notification.users?.first_name ?? "User"} rejected your invitation to the ${collectionName} Collection`;
        case NotificationType.UserJoinedCollection:
            return `${notification.users.first_name} joined the ${collectionName} Collection`;
        case NotificationType.UserLeftCollection:
            return `${notification.users.first_name} left the ${collectionName} Collection`;
        case NotificationType.TaskAssigned:
            return `The task ${taskName} has been assigned to you in the ${collectionName} Collection`;
        case NotificationType.TaskCompletionWindow:
            return `The completion window for the task ${taskName} in the ${collectionName} Collection is now open`;
        case NotificationType.TaskDueSoon:
            return `The task ${taskName} in the ${collectionName} Collection is due soon`;
        case NotificationType.TaskInSeason:
            return `The task ${taskName} in the ${collectionName} Collection is now in season`;
        case NotificationType.ToDoTaskDueSoon:
            return `A to-do task is due soon`;
        default:
            return 'You have a new notification';
    }
};

export const getNotificationLink = (notification: Notification) => {

    switch (notification.type) {
        case NotificationType.Invitation:
            return `/(authenticated)/(tabs)/collections/invitations`;
        case NotificationType.InvitationAccepted:
            return `/(authenticated)/(tabs)/collections/collection/settings?id=${notification.collection_id}`;
        case NotificationType.InvitationRejected:
            return `/(authenticated)/(tabs)/collections/collection/settings?id=${notification.collection_id}`;
        case NotificationType.UserJoinedCollection:
            return `/(authenticated)/(tabs)/collections/collection/settings?id=${notification.collection_id}`;
        case NotificationType.UserLeftCollection:
            return `/(authenticated)/(tabs)/collections/collection/settings?id=${notification.collection_id}`;
        case NotificationType.TaskAssigned:
            return `/(authenticated)/(tabs)/collections/collection/task/${notification.task_id}?collectionId=${notification.collection_id}`;
        case NotificationType.TaskCompletionWindow:
            return `/(authenticated)/(tabs)/collections/collection/task/${notification.task_id}?collectionId=${notification.collection_id}`;
        case NotificationType.TaskDueSoon:
            return `/(authenticated)/(tabs)/collections/collection/task/${notification.task_id}?collectionId=${notification.collection_id}`;
        case NotificationType.TaskInSeason:
            return `/(authenticated)/(tabs)/collections/collection/task/${notification.task_id}?collectionId=${notification.collection_id}`;
        case NotificationType.ToDoTaskDueSoon:
            return `/(authenticated)/(tabs)/todo/index`;
        default:
            return '';
    }
};

export const timeSinceNotificationCreated = (notification: Notification) => {
    const createdAt = new Date(notification.created_at);
        const now = new Date(); // Current UTC time

    // Calculate the difference in milliseconds
    const difference = now - createdAt;

    // Convert milliseconds to seconds, minutes, hours, and days
    const min = 1000 * 60;
    const hr = min * 60;
    const day = hr * 24;

    if (difference < min) {
        return "0 min ago";
    } else if (difference < hr) {
        const minutes = Math.floor(difference / min);
        return `${minutes} min ago`;
    } else if (difference < day) {
        const hours = Math.floor(difference / hr);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (difference < day * 4) {
        const days = Math.floor(difference / day);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
        const dayOfMonth = createdAt.getDate();
        const month = createdAt.toLocaleString('default', { month: 'short' });
        const year = createdAt.getFullYear();
        return `${dayOfMonth}. ${month} ${year}`;
    }
};
