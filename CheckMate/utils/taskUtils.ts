import {Colors} from "@/constants/Colors";
import {Notification, NotificationType} from "@/types/enums.ts";

export const isInSeason = (task, now = new Date()) => {
    if (!task.season_start || !task.season_end) return true;

    const currentYear = now.getFullYear();
    const seasonStart = new Date(task.season_start);
    const seasonEnd = new Date(task.season_end);

    const normalizedStart = new Date(seasonStart);
    normalizedStart.setFullYear(currentYear);

    const normalizedEnd = new Date(seasonEnd);
    normalizedEnd.setFullYear(currentYear);

    if (normalizedEnd < normalizedStart) {
        if (now >= normalizedStart) {
            normalizedEnd.setFullYear(currentYear + 1);
        } else {
            normalizedStart.setFullYear(currentYear - 1);
        }
    }

    return normalizedStart <= now && now <= normalizedEnd;
};

export const isArchived = (task) => !!task.archived_at;

export const isOverdue = (task, now = new Date()) => {
    if (!task.next_due_at) return false;
    return new Date(task.next_due_at) < now;
};

export const isOpenForCompletion = (task, now = new Date()) => {
    if (!task.next_due_at) return true;

    const completionStart = task.completion_start ? new Date(task.completion_start) : null;
    const nextDueDate = new Date(task.next_due_at);

    if (completionStart && nextDueDate) {
        return completionStart <= now && now <= nextDueDate;
    }

    return !task.completion_start && !task.completion_window_days;
};

export const isCompleted = (task) => {
    return (!task.recurring && task.last_completed_at) || (task.recurring && task.archived_at && task.last_completed_at);
};

export const getTaskState = (task) => {
    const inSeason = isInSeason(task);
    const archived = isArchived(task);
    const overdue = isOverdue(task);
    const openForCompletion = isOpenForCompletion(task);

    if (archived) return {state: "Archived", icon: "archive-outline", color: Colors.Primary["400"]};
    if (!inSeason) return {state: "Out of Season", icon: "moon-outline", color: Colors.Primary["600"]};
    if (overdue) return {state: "Overdue", icon: "warning-outline", color: Colors.Red["600"]};
    if (openForCompletion) return {state: "Open", icon: "timer-outline", color: Colors.Green["600"]};
    return {state: "Not Open", icon: "pause-circle-outline", color: Colors.Yellow["600"]};
};

export const checkTaskAccess = (notification: Notification) => {
    switch (notification.type) {
        case NotificationType.Invitation:
        case NotificationType.ToDoTaskDueSoon:
            return true;
        case NotificationType.InvitationAccepted:
        case NotificationType.InvitationRejected:
        case NotificationType.UserJoinedCollection:
        case NotificationType.UserLeftCollection:
            return !!notification.collections?.id;
        case NotificationType.TaskAssigned:
        case NotificationType.TaskCompletionWindow:
        case NotificationType.TaskDueSoon:
        case NotificationType.TaskInSeason:
            return !!(notification.tasks?.id && notification.collections?.id);
        default:
            return false;
    }
};