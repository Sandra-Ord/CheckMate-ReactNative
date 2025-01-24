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

export enum NotificationType {
    Invitation = 'invitation',
    InvitationAccepted = 'invitation_accepted',
    InvitationRejected = 'invitation_rejected',
    UserJoinedCollection = 'user_joined_collection',
    UserLeftCollection = 'user_left_collection',
    TaskAssigned = 'task_assigned',
    TaskCompletionWindow = 'task_completion_window',
    TaskDueSoon = 'task_due_soon',
    TaskInSeason = 'task_in_season',
    ToDoTaskDueSoon = 'to_do_task_due_soon',
}

export enum CollectionRole {
    Owner = 'Owner',
    Member = 'Member'
}

export enum CollectionInvitationStatus {
    Pending = null,
    Rejected = 'REJECTED',
    Accepted = 'ACCEPTED',
    Cancelled = 'CANCELLED',
    Removed = 'REMOVED'
}

export enum IntervalUnit {
    Days = 'day',
    Weeks = 'week',
    Months = 'month',
    Years = 'year',
}

export const intervalOptions = [IntervalUnit.Days, IntervalUnit.Weeks, IntervalUnit.Months, IntervalUnit.Years];
export const weekdayOptions = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
export const monthOptions = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


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
    task_id: ID,
    user_id: UserID,
    completed_at: Date,
    due_at: Date,
    comment: string | null
}

export interface Notification {
    id: ID,
    user_id: UserID,
    type: NotificationType,
    collection_id: ID | null,
    task_id: ID | null,
    about_user_id: UserID | null,
    created_at: Date,
    data,
    read_at: Date | null
}

export interface TaskPhoto {
    id: ID,
    task_id: ID,
    photo_url: string,
    uploaded_at: Date,
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
    to_do_task_id: ID,
    tag_id: ID,
}