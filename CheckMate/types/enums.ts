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
    Pending = 0,
    Rejected = -1,
    Accepted = 1,
}

export enum IntervalUnit {
    Days = 'day',
    Weeks = 'week',
    Months = 'month',
    Years = 'year',
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
    invited_by_id: UserID,
    user_id: UserID,
    invited_by_email: string,
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
    description: string,
    recurring: boolean,
    interval_value: number | null,
    interval_unit: IntervalUnit | null,
    day_of_week: Number | null,
    date_of_month: Number | null,
    month_of_year: Number | null,
    season_start: Date | null,
    season_end: Date | null,
    last_completed_at: Date | null,
    next_due_at: Date | null,
    completion_start: Date | null,
    completion_window_days: number | null,
    skip_missed_due_dates: boolean,
    archived_at: Date | null,
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

export interface ToDoTask {
    id: ID,
    user_id: UserID,
    name: string,
    comment: string | null,
    due_date: Date,
    created_at: Date,
    completed_at: Date | null,
}

export interface Tag {
    id: ID,
    user_id: UserID,
    tag: string,
    tag_icon: string | null
    created_at: Date,
    archived_at: Date | null,
}

export interface ToDoTag {
    id: ID,
    to_to_task_id: ID,
    tag_id: ID,
}