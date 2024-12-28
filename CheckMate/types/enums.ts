export type UserID = string;

export type ID = bigint;

export enum ModalType {
    Login = 'login',
    SignUp = 'signup',
}

export enum AuthStrategy {
    Google = 'oauth_google',
    Microsoft = 'oauth_microsoft',
    Apple = 'oauth_apple',
}

export enum TaskNotificationType {
    TaskAssigned,
    TaskWindowOpen,
    TaskDueDate,
}

export enum CollectionRole {
    Owner = 'Owner',
    Member = 'Member'
}

export enum CollectionInvitationStatus {
    Pending = 1,
    Rejected = -1,
    Accepted = 1,
}

export enum IntervalUnit {
    Days = 'days',
    Weeks = 'weeks',
    Months = 'months',
    Years = 'years',
}

export interface User {
    id: UserID;
    email: string;
    username: null;
    first_name: string;
    avatar_url: string;
}

export interface CollectionUser {
    id: ID,
    collection_id: ID,
    user_id: UserID,
    role: CollectionRole,
    invited_at: Date,
    responded_at: Date,
    status: CollectionInvitationStatus
    order_nr: Number | null
}

export interface Collection {
    id: ID,
    owner_id: UserID,
    name: string,
}

export interface Task {
    id: ID,
    collection_id: ID,
    assigned_to_user_id: UserID,
    name: string,
    recurring: boolean,
    interval_value: number | null,
    interval_unit: IntervalUnit | null,
    day_of_week: Number | null,
    day_of_month: Number | null,
    month_of_year: Number | null,
    season_start: Date | null,
    season_end: Date | null,
    last_completed_at: Date | null,
    next_due_at: Date | null,
    completion_window_days: number | null,
}

export interface TaskLog {
    id: ID,
    completed_task_id: ID,
    completed_by_user_id: UserID,
    completed_at: Date,
    due_at: Date,
    comment: string | null
}

export interface TaskNotification {
    id: ID,
    user_id: UserID,
    task_id: ID,
    notification_type: TaskNotificationType,
    sent_at: Date
}
