import {createContext, useContext, useEffect} from 'react';
import {useAuth} from '@clerk/clerk-expo';
import {decode} from 'base64-arraybuffer';
import {RealtimePostgresChangesPayload} from '@supabase/supabase-js';
import {client} from '@/utils/supabaseClient';
import {
    calculateCompletionStartDateString,
    calculateNextDueDate
} from "@/utils/taskDateUtils";
import {Collection, CollectionInvitationStatus, Tag, Task, ToDoTask} from '@/types/enums';

export const COLLECTIONS_TABLE = 'collections';
export const COLLECTION_USERS_TABLE = 'collection_users'
export const TASKS_TABLE = 'tasks';
export const TASK_LOGS_TABLE = 'task_logs';
export const TASK_PHOTOS = 'task_photos'
export const TO_DO_TASKS_TABLE = 'to_do_tasks';
export const TO_DO_TAGS_TABLE = 'to_do_tags';
export const TAGS_TABLE = 'tags';
export const USERS_TABLE = 'users';
export const NOTIFICATIONS_TABLE = 'notifications';
export const FILES_BUCKET = 'files';

type ProviderProps = {
    userId: string | null;

    // COLLECTION LIST VIEW FUNCTIONS
    createCollection: (name: string) => Promise<any>;
    getCollections: () => Promise<any>;
    getAcceptedUsersCount: (collectionId) => Promise<any>;
    getActiveTasksCount: (collectionId) => Promise<any>;
    getPendingTaskCount: (collectionId) => Promise<any>;

    // COLLECTION FUNCTIONS
    getCollection: (collectionId: number) => Promise<any>;
    getCollectionInfo: (collectionId: number) => Promise<any>;
    updateCollection: (collection: Collection) => Promise<any>;
    deleteCollection: (collectionId: number) => Promise<any>;

    addUserToCollection: (collectionId: number, invitedUserId: number) => Promise<any>;
    getCollectionUsers: (collectionId: number) => Promise<any>;
    leaveCollection: (collectionId: number) => Promise<any>;
    removeFromCollection: (collection_id: number, user_id: string) => Promise<any>;

    getCollectionTasks: (collectionId: number) => Promise<any>;

    // TASK FUNCTIONS
    getBasicTaskInformation: (taskId: number) => Promise<any>;
    getTaskInformation: (taskId: number) => Promise<any>;

    completeTask: (task: Task, completionDate: Date, logComment: string, nextAssignedToUserId: string) => Promise<any>;
    getTaskLogs: (taskId: number) => Promise<any>;

    createTask: (collection_id: number,
                 name: string,
                 description: string,
                 assigned_to_user_id: string | null,
                 recurring: boolean,
                 interval_value: number | null,
                 interval_unit: number | null,
                 day_of_week: number | null,
                 date_of_month: number | null,
                 month_of_year: number | null,
                 season_start: Date | null,
                 season_end: Date | null,
                 last_completed_at: Date | null,
                 next_due_at: Date | null,
                 completion_window_days: number | null,
                 skip_missed_due_dates: boolean,
    ) => Promise<any>;
    updateTask: (task: Task) => Promise<any>;
    deleteTask: (taskId: number) => Promise<any>;
    archiveTask: (taskId: number) => Promise<any>;
    unArchiveTask: (taskId: number) => Promise<any>;

    // TASK STATISTICS FUNCTIONS
    getRelevantCollectionUsers: (collectionId: number) => Promise<any>;
    getTaskCompletionStats: (taskId: number) => Promise<any>;

    // INVITATIONS
    getPendingInvitations: () => Promise<any>;
    acceptInvitation: (invitationId) => Promise<any>;
    rejectInvitation: (invitationId) => Promise<any>;

    // TO DO TASKS
    getToDoTasks: () => Promise<any>;
    getArchivedToDoTasks: () => Promise<any>;
    createToDoTask: (taskName: string, dueDate: Date) => Promise<any>;
    updateToDoTask: (task: ToDoTask) => Promise<any>;
    deleteToDoTask: (toDoTaskId: number) => Promise<any>;
    completeToDoTask: (task: ToDoTask) => Promise<any>;
    unCompleteToDoTask: (task: ToDoTask) => Promise<any>;

    // TAGS
    getTags: () => Promise<any>;
    getActiveTags: () => Promise<any>;
    createTag: (tagName: string) => Promise<any>;
    updateTag: (tag: Tag) => Promise<any>;
    deleteTag: (tagId: number) => Promise<any>;
    archiveTag: (tag: Tag) => Promise<any>;
    unarchiveTag: (tag: Tag) => Promise<any>;

    // NOTIFICATIONS
    getUsersNotifications: () => Promise<any>;
    readNotification: (notification_id) => Promise<any>;
    readAllNotifications: () => Promise<any>;

    // OTHER
    setUserPushToken: (token: string) => Promise<any>;
    getUser: () => Promise<any>;
    getUserName: () => Promise<any>;
    setUserName: (firstName: string) => Promise<any>;
    findUsers: (search: string) => Promise<any>;

    getTaskPhotos: (taskId: number) => Promise<any>;
    uploadTaskPhoto: (taskId: number, filePath: string, base64: string, contentType: string) => Promise<any>;
    uploadFile: (filePath: string, base64: string, contentType: string) => Promise<any>;
    getFileFromPath: (path: string) => Promise<any>;
};

const SupabaseContext = createContext<Partial<ProviderProps>>({});

export function useSupabase() {
    return useContext(SupabaseContext);
}

export const SupabaseProvider = ({children}: any) => {
    const {userId} = useAuth();

    useEffect(() => {
        setRealtimeAuth();
    }, []);

    const setRealtimeAuth = async () => {
        // @ts-ignore
        const clerkToken = await window.Clerk.session?.getToken({
            template: 'supabase',
        });

        client.realtime.setAuth(clerkToken!);
    };

    // -----------------------------------------------------------------------------------------------------------------
    // ---------------------------------------- COLLECTION LIST VIEW FUNCTIONS -----------------------------------------
    // -----------------------------------------------------------------------------------------------------------------

    const createCollection = async (name: string) => {
        const {data, error} = await client
            .from(COLLECTIONS_TABLE)
            .insert({"name": name, "owner_id": userId});

        if (error) {
            console.error('Error creating collection:', error);
        }

        return data;
    };

    const getCollections = async () => {
        const {data, error} = await client
            .from(COLLECTION_USERS_TABLE)
            .select('collections(id, name, owner_id, users(id, first_name))')
            .eq('user_id', userId)
            .eq('status', CollectionInvitationStatus.Accepted);

        if (error) {
            console.error('Error fetching person\'s collections:', error);
            return [];
        }

        const result = data?.map((row: any) => row.collections) || [];
        return result || [];
    }

    const getAcceptedUsersCount = async (collectionId) => {
        const {data, error} = await client
            .from(COLLECTION_USERS_TABLE)
            .select('user_id, status')
            .eq('collection_id', collectionId)
            .eq('status', CollectionInvitationStatus.Accepted);

        if (error) {
            console.error('Error fetching accepted users:', error);
            return 0;
        }
        const uniqueUserIds = new Set();
        data.forEach(row => {
            uniqueUserIds.add(row.user_id);
        });

        return uniqueUserIds.size;
    };

    const getActiveTasksCount = async (collectionId) => {
        const currentTime = new Date().toISOString(); // Current time in ISO format

        const {data, error} = await client
            .from(TASKS_TABLE)
            .select('id')
            .eq('collection_id', collectionId)
            .is('archived_at', null)
            .or(
                `and(season_start.lte.${currentTime},season_end.gte.${currentTime}),and(season_start.is.null,season_end.is.null)`
            );

        if (error) {
            console.error('Error fetching active tasks:', error);
        }

        return data.length || 0;
    };

    const getPendingTaskCount = async (collectionId) => {
        const currentTime = new Date().toISOString(); // Current time in ISO format

        const {data, error} = await client
            .from('tasks')
            .select('id, name')
            .eq('collection_id', collectionId)
            .is('archived_at', null)
            .or(
                `and(completion_start.lte.${currentTime},next_due_at.gte.${currentTime}),and(completion_start.is.null,next_due_at.gte.${currentTime})`
            );

        if (error) {
            console.error('Error fetching pending tasks:', error);
        }

        return data?.length || 0;
    };

    // -----------------------------------------------------------------------------------------------------------------
    // ---------------------------------------------- COLLECTION FUNCTIONS ---------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------

    const getCollection = async (collectionId: number) => {
        const {data, error} = await client
            .from(COLLECTIONS_TABLE)
            .select(`name, id`)
            .match({id: collectionId})
            .single();

        if (error) {
            console.error('Error getting collections:', error);
        }

        return data || null;
    };

    const getCollectionInfo = async (collectionId: number) => {
        const {data, error} = await client
            .from(COLLECTIONS_TABLE)
            .select(`*, users (first_name)`)
            .match({id: collectionId})
            .single();
        if (error) {
            console.error('Error getting collection info:', error);
        }
        return data;
    };

    const updateCollection = async (collection: Collection) => {
        const {data} = await client
            .from(COLLECTIONS_TABLE)
            .update({name: collection.name})
            .match({id: collection.id})
            .select('*')
            .single();

        return data;
    };

    const deleteCollection = async (collectionId: string) => {
        return await client.from(COLLECTIONS_TABLE).delete().match({id: collectionId});
    };

    // -----------------------------------------------------------------------------------------------------------------

    const addUserToCollection = async (collectionId: string, invitedUserId, string) => {
        return await client
            .from(COLLECTION_USERS_TABLE)
            .insert({
                user_id: invitedUserId,
                collection_id: collectionId,
                role: "EDITOR",
                invited_at: new Date().toISOString(),
                invited_by_id: userId,
                invited_by_email: "owner@gmail.com",
            });
    };

    const getCollectionUsers = async (collectionId) => {
        const {data, error} = await client
            .from(COLLECTION_USERS_TABLE)
            .select('users!collection_users_user_id_fkey (id, first_name, email, avatar_url)')
            .eq('collection_id', collectionId)
            .eq('status', CollectionInvitationStatus.Accepted);

        if (error) {
            console.error('Error fetching collection users:', error);
            return [];
        }

        const result = data?.map((row: any) => row.users) || [];
        return result || [];
    };

    const leaveCollection = async (collectionId: number) => {
        const {data, error} = await client
            .from(COLLECTION_USERS_TABLE)
            .update({
                status: CollectionInvitationStatus.Cancelled
            })
            .eq("collection_id", collectionId)
            .eq("user_id", userId)
            .eq("status", CollectionInvitationStatus.Accepted)
            .select("*");
        if (error) {
            console.error("Error leaving the collection:", error);
            return;
        }
        return data;
    };

    const removeFromCollection = async (collection_id: number, user_id: string) => {
        const {data, error} = await client
            .from(COLLECTION_USERS_TABLE)
            .update({
                status: CollectionInvitationStatus.Removed
            })
            .eq("collection_id", collection_id)
            .eq("user_id", user_id)
            .eq("status", CollectionInvitationStatus.Accepted)
            .select("*");
        if (error) {
            console.error("Error removing user from collection:", error);
            return;
        }
        return data;
    }

    // -----------------------------------------------------------------------------------------------------------------

    const getCollectionTasks = async (collectionId: number) => {
        const {data, error} = await client
            .from(TASKS_TABLE)
            .select(`*, users (id, first_name, email)`)
            .match({collection_id: collectionId})
            .order('next_due_at', {ascending: true})  // Sort by next_due_at ascending
            .order('completion_window_days', {nullsFirst: false, ascending: true});  // Sort by completion_window_days ascending, nullsFirst

        if (error) {
            console.error('Error creating to do task:', error);
        }

        return data;
    };

    // -----------------------------------------------------------------------------------------------------------------
    // ------------------------------------------------ TASK FUNCTIONS -------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------

    const getBasicTaskInformation = async (taskId: number) => {
        const {data, error} = await client
            .from(TASKS_TABLE)
            .select(`id, name)`)
            .match({id: taskId})
            .single();

        if (error) {
            console.error('Error fetching basic task information:', error);
            return [];
        }
        return data;
    };

    const getTaskInformation = async (taskId: number) => {
        const {data, error} = await client
            .from(TASKS_TABLE)
            .select(`*, users (*)`)
            .match({id: taskId})
            .single();

        if (error) {
            console.error('Error fetching task information:', error);
            return [];
        }

        return data;
    };

    // -----------------------------------------------------------------------------------------------------------------

    const completeTask = async (task: Task, completionDate: Date, logComment: string, nextAssignedToUserId: string) => {
        const {logData, logError} = await client
            .from(TASK_LOGS_TABLE)
            .insert({
                "task_id": task.id,
                "user_id": userId,
                "completed_at": completionDate.toISOString(),
                "due_at": task.next_due_at,
                "comment": logComment ? logComment.trim() : null
            });

        if (logError) {
            console.error('Error logging task:', logError);
            return;
        }

        if (!task.recurring) {
            // Non-recurring task: archive it
            task.assigned_to_user_id = nextAssignedToUserId ? nextAssignedToUserId : null;
            task.last_completed_at = completionDate.toISOString();
            task.completion_start = null;
            task.next_due_at = null;
            task.archived_at = new Date().toISOString();
        } else {
            const nextDueDate = calculateNextDueDate(task, completionDate);

            const completionStart = calculateCompletionStartDateString(nextDueDate, task.completion_window_days)
            task.assigned_to_user_id = nextAssignedToUserId ? nextAssignedToUserId : null;
            task.completion_start = completionStart;

            task.next_due_at = nextDueDate;
            task.last_completed_at = completionDate;
        }

        const {taskData, taskError} = await client
            .from(TASKS_TABLE)
            .update({
                last_completed_at: task.last_completed_at,
                completion_start: task.completion_start,
                next_due_at: task.next_due_at,
                assigned_to_user_id: task.assigned_to_user_id,
                archived_at: task.archived_at
            })
            .eq('id', task.id)
            .select("*")
            .single();

        if (taskError) {
            console.error("Error updating task:", taskError);
            return null;
        }

        return taskData;
    };

    const getTaskLogs = async (taskId: number) => {
        const {data, error} = await client
            .from(TASK_LOGS_TABLE)
            .select(`id, comment, completed_at, due_at, users (id, first_name)`)
            .match({task_id: taskId});

        if (error) {
            console.error('Error getting task logs:', error);
        }

        return data || [];
    };

    // -----------------------------------------------------------------------------------------------------------------

    const createTask = async (task: Task) => {
        const {data, error} = await client
            .from(TASKS_TABLE)
            .insert(task)
            .select("*");
        if (error) {
            console.error('Error creating task:', error);
        }
        return data;
    };

    const updateTask = async (task: Task) => {
        const {data, error} = await client
            .from(TASKS_TABLE)
            .update({
                assigned_to_user_id: task.assigned_to_user_id,
                name: task.name,
                description: task.description,
                recurring: task.recurring,
                interval_value: task.interval_value,
                interval_unit: task.interval_unit,
                day_of_week: task.day_of_week,
                date_of_month: task.date_of_month,
                month_of_year: task.month_of_year,
                season_start: task.season_start,
                season_end: task.season_end,
                last_completed_at: task.last_completed_at,
                completion_start: task.completion_start,
                next_due_at: task.next_due_at,
                completion_window_days: task.completion_window_days,
                skip_missed_due_dates: task.skip_missed_due_dates

            })
            .match({id: task.id})
            .select('*')
            .single();

        if (error) {
            console.error("Error updating task:", error);
        }

        return data;
    };

    const deleteTask = async (taskId: number) => {
        return client
            .from(TASKS_TABLE)
            .delete()
            .match({id: taskId})
            .single();
    };

    const archiveTask = async (taskId: number) => {
        const {data} = await client
            .from(TASKS_TABLE)
            .update({
                archived_at: new Date().toISOString(),
            })
            .match({id: taskId})
            .select('*')
            .single();

        return data;
    };

    const unArchiveTask = async (taskId: number) => {
        const {data} = await client
            .from(TASKS_TABLE)
            .update({
                archived_at: null,
            })
            .match({id: taskId})
            .select('*')
            .single();

        return data;
    };

    // -----------------------------------------------------------------------------------------------------------------
    // ----------------------------------------- TASK STATISTICS FUNCTIONS ---------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------

    const getRelevantCollectionUsers = async (collectionId: number) => {
        const {data, error} = await client
            .from(COLLECTION_USERS_TABLE)
            .select(`
            user_id,
            status,
            users!collection_users_user_id_fkey (id, first_name, avatar_url)
        `)
            .match({collection_id: collectionId})
            .in('status', [CollectionInvitationStatus.Accepted, CollectionInvitationStatus.Cancelled])
            .order('status', {ascending: true});

        if (error) {
            console.error('Error fetching collection users:', error);
            return [];
        }

        return data || [];
    };

    const getTaskCompletionStats = async (taskId: number) => {
        const {data, error} = await client
            .from(TASK_LOGS_TABLE)
            .select(`user_id, completed_at, due_at`)
            .eq('task_id', taskId);

        if (error) {
            console.error('Error fetching task completion stats:', error);
            return [];
        }

        return data.reduce((acc, log) => {
            const userId = log.user_id;
            const isOnTime = !log.due_at || new Date(log.completed_at) <= new Date(log.due_at);
            const status = isOnTime ? 'on_time' : 'overdue';

            if (!acc[userId]) {
                acc[userId] = {
                    user: log.users,
                    onTime: 0,
                    overdue: 0,
                    total: 0,
                };
            }

            if (status === 'on_time') acc[userId].onTime++;
            else acc[userId].overdue++;
            acc[userId].total++;
            return acc;
        }, {});
    };

    // -----------------------------------------------------------------------------------------------------------------
    // ------------------------------------------------ INVITATIONS ----------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------

    const getPendingInvitations = async () => {
        const {data, error} = await client
            .from(COLLECTION_USERS_TABLE)
            .select('id, collections (name, users (first_name)), users!collection_users_invited_by_id_fkey (id, first_name), invited_by_email, invited_at, responded_at')
            .match({user_id: userId})
            .is('status', null);

        if (error) {
            console.error('Error fetching pending invitations:', error);
        }

        return data || [];
    };

    const acceptInvitation = async (invitationId) => {
        const {data, error} = await client
            .from(COLLECTION_USERS_TABLE)
            .update({
                responded_at: new Date().toISOString(),
                status: CollectionInvitationStatus.Accepted
            })
            .match({id: invitationId})
            .select('*')
            .single();
        if (error) {
            console.error("Error accepting invitation:", error);
        }
        return data;
    };

    const rejectInvitation = async (invitationId) => {
        const {data, error} = await client
            .from(COLLECTION_USERS_TABLE)
            .update({
                responded_at: new Date().toISOString(),
                status: CollectionInvitationStatus.Rejected
            })
            .match({id: invitationId})
            .select('*')
            .single();

        if (error) {
            console.error("Error rejecting invitation:", error);
        }

        return data;
    };

    // -----------------------------------------------------------------------------------------------------------------
    // ------------------------------------------------ TO DO TASKS ----------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------

    const getToDoTasks = async () => {
        const {data, error} = await client
            .from(TO_DO_TASKS_TABLE)
            .select(`*`)
            .eq('user_id', userId)
            .is('completed_at', null);

        if (error) {
            console.error('Error fetching incomplete tasks:', error);
        }

        return data;
    };

    const getArchivedToDoTasks = async () => {
        const {data, error} = await client
            .from(TO_DO_TASKS_TABLE)
            .select('*')
            .eq('user_id', userId)
            .gt('completed_at', '1970-01-01T00:00:00Z');

        if (error) {
            console.error('Error fetching archived tasks:', error);
        }

        return data;
    };

    const createToDoTask = async (taskName: string, comment: string, dueDate: Date) => {
        const {data, error} = await client
            .from(TO_DO_TASKS_TABLE)
            .insert({
                "user_id": userId,
                "name": taskName,
                "comment": comment,
                "due_date": dueDate,
                "created_at": new Date().toISOString()
            });

        if (error) {
            console.error('Error creating to do task:', error);
        }

        return data;
    };

    const updateToDoTask = async (task: ToDoTask) => {
        const {data, error} = await client
            .from(TO_DO_TASKS_TABLE)
            .update({
                name: task.name,
                comment: task.comment,
                due_date: task.due_date,
            })
            .match({id: task.id})
            .select('*')
            .single();

        if (error) {
            console.error("Error updating to do task:", error);
        }

        return data;
    };

    const deleteToDoTask = async (toDoTaskId: number) => {
        return client
            .from(TO_DO_TASKS_TABLE)
            .delete()
            .match({id: toDoTaskId})
            .single();
    };

    const completeToDoTask = async (task: ToDoTask) => {
        const {data, error} = await client
            .from(TO_DO_TASKS_TABLE)
            .update({
                completed_at: new Date().toISOString(),
            })
            .match({id: task.id})
            .select('*')
            .single();

        if (error) {
            console.error("Error completing to do task:", error);
        }

        return data;
    };

    const unCompleteToDoTask = async (task: ToDoTask) => {
        const {data, error} = await client
            .from(TO_DO_TASKS_TABLE)
            .update({
                completed_at: null,
            })
            .match({id: task.id})
            .select('*')
            .single();

        if (error) {
            console.error("Error uncompleting to do task:", error);
        }

        return data;
    };

    // -----------------------------------------------------------------------------------------------------------------
    // ---------------------------------------------------- TAGS -------------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------

    const getTags = async () => {
        const {data, error} = await client
            .from(TAGS_TABLE)
            .select(`*`)
            .eq('user_id', userId);

        if (error) {
            console.error('Error getting tags:', error);
            return [];
        }

        return data;
    };

    const getActiveTags = async () => {
        const {data, error} = await client
            .from(TAGS_TABLE)
            .select(`*`)
            .eq('user_id', userId)
            .is('archived_at', null);

        if (error) {
            console.error('Error getting active tags:', error);
        }

        return data;
    };

    const createTag = async (tagName: string) => {
        const {data, error} = await client
            .from(TAGS_TABLE)
            .insert({"tag": tagName, "user_id": userId, "created_at": new Date().toISOString()});

        if (error) {
            console.error('Error creating tag:', error);
        }

        return data;
    };

    const updateTag = async (tag: Tag) => {
        const {data, error} = await client
            .from(TAGS_TABLE)
            .update({
                tag: tag.tag,
                tag_icon: tag.tag_icon,
            })
            .match({id: tag.id})
            .select('*')
            .single();

        if (error) {
            console.error("Error updating tag:", error);
        }

        return data;
    };

    const deleteTag = async (tagId: number) => {
        return client
            .from(TAGS_TABLE)
            .delete()
            .match({id: tagId})
            .single();
    };

    const archiveTag = async (tag: Tag) => {
        const {data, error} = await client
            .from(TAGS_TABLE)
            .update({
                archived_at: new Date().toISOString(),
            })
            .match({id: tag.id})
            .select('*')
            .single();

        if (error) {
            console.error("Error archiving tag:", error);
        }

        return data;
    };

    const unArchiveTag = async (tag: Tag) => {
        const {data, error} = await client
            .from(TAGS_TABLE)
            .update({
                archived_at: null,
            })
            .match({id: tag.id})
            .select('*')
            .single();

        if (error) {
            console.error("Error unarchiving tag:", error);
        }

        return data;
    };

    // -----------------------------------------------------------------------------------------------------------------
    // ----------------------------------------------------- OTHER -----------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------

    const getUsersNotifications = async () => {
        const {data, error} = await client
            .from(NOTIFICATIONS_TABLE)
            .select('*, users!notifications_about_user_id_fkey (id, first_name), collections (id, name), tasks (id, name)')
            .eq('user_id', userId)
            .order('read_at', {ascending: false, nullsFirst: true})
            .order('created_at', {ascending: false});

        if (error) {
            console.error("Error retrieving user's notifications:", error);
        }

        return data || [];
    };

    const readNotification = async (notification_id) => {
        const {data, error} = await client
            .from(NOTIFICATIONS_TABLE)
            .update({
                read_at: new Date().toISOString(),
            })
            .match({id: notification_id})
            .select('*')
            .single();

        if (error) {
            console.error("Error marking notification as read:", error);
        }

        return data;
    };

    const readAllNotifications = async () => {
        const {data, error} = await client
            .from(NOTIFICATIONS_TABLE)
            .update({
                read_at: new Date().toISOString(),
            })
            .match({user_id: userId})
            .is('read_at', null)
            .select('*');

        if (error) {
            console.error("Error marking notification as read:", error);
        }

        return data;
    };

    // -----------------------------------------------------------------------------------------------------------------
    // ----------------------------------------------------- OTHER -----------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------

    const setUserPushToken = async (token: string) => {
        const {data, error} = await client
            .from(USERS_TABLE)
            .upsert({id: userId, push_token: token});

        if (error) {
            console.error('Error setting push token:', error);
        }

        return data;
    };

    const getUser = async () => {
        const {data, error} = await client
            .from(USERS_TABLE)
            .select('*')
            .match({id: userId})
            .single();
        if (error) {
            console.error("Error retrieving user:", error);
        }

        return data || null;
    };

    const getUserName = async () => {
        const {data, error} = await client
            .from(USERS_TABLE)
            .select('first_name')
            .match({id: userId})
            .single();
        if (error) {
            console.error("Error retrieving user name:", error);
        }
        return data || null;
    };

    const setUserName = async (firstName) => {
        const {data, error} = await client
            .from(USERS_TABLE)
            .update({
                first_name: firstName
            })
            .match({id: userId})
            .select("*");
        if (error) {
            console.error("Error setting user name:", error);
        }
        return data || null;
    };

    const findUsers = async (search: string) => {
        const {data, error} = await client
            .from(USERS_TABLE)
            .select("*")
            .ilike('email', `%${search.trim()}%`);
        if (error) {
            console.error("Error finding users:", error);
        }
        return data || [];
    };

    // -----------------------------------------------------------------------------------------------------------------

    const getTaskPhotos = async (taskId: number) => {
        const {data, error} = await client
            .from(TASK_PHOTOS)
            .select('*')
            .match({task_id: taskId})

        if (error) {
            console.error("Error fetching photos:", error);
        }

        return data || [];
    }

    const uploadTaskPhoto = async (taskId: number, filePath: string, base64: string, contentType: string) => {
        try {
            // Upload the photo to the bucket
            const {data: uploadData, error: uploadError} = await client.storage
                .from(FILES_BUCKET)
                .upload(filePath, decode(base64), {contentType});

            if (uploadError) {
                console.error("Error uploading file to bucket:", uploadError);
                return null;
            }

            // Get the path of the uploaded file
            const uploadedFilePath = uploadData?.path;
            if (!uploadedFilePath) {
                console.error("File path not returned after upload.");
                return null;
            }

            // Insert a record into the task_photos table
            const {data: photoData, error: insertError} = await client
                .from(TASK_PHOTOS)
                .insert({
                    task_id: taskId,
                    photo_url: uploadedFilePath,
                    uploaded_at: new Date().toISOString(),
                })
                .select("*")
                .single();

            if (insertError) {
                console.error("Error inserting photo record:", insertError);
                return null;
            }

            // Return the combined result
            return {uploadedFilePath, photoData};
        } catch (error) {
            console.error("Unexpected error in uploadTaskPhoto:", error);
            return null;
        }
    };

    const uploadFile = async (filePath: string, base64: string, contentType: string) => {
        const {data} = await client.storage
            .from(FILES_BUCKET)
            .upload(filePath, decode(base64), {contentType});

        return data?.path;
    };

    const getFileFromPath = async (path: string) => {
        const {data, error} = await client
            .storage
            .from(FILES_BUCKET)
            .createSignedUrl(path, 60 * 60, {
                transform: {
                    width: 300,
                    height: 200,
                },
            });

        if (error) console.error("Error generating signed URL:", error);

        return data?.signedUrl;
    };

    const value = {
        userId,

        // COLLECTION LIST VIEW FUNCTIONS
        createCollection,
        getCollections,
        getAcceptedUsersCount,
        getActiveTasksCount,
        getPendingTaskCount,

        // COLLECTION FUNCTIONS
        getCollection,
        getCollectionInfo,
        updateCollection,
        deleteCollection,

        addUserToCollection,
        getCollectionUsers,
        leaveCollection,
        removeFromCollection,

        getCollectionTasks,

        // TASK FUNCTIONS
        getBasicTaskInformation,
        getTaskInformation,

        completeTask,
        getTaskLogs,

        createTask,
        updateTask,
        deleteTask,
        archiveTask,
        unArchiveTask,

        // TASK STATISTICS FUNCTIONS
        getRelevantCollectionUsers,
        getTaskCompletionStats,

        // INVITATIONS
        getPendingInvitations,
        acceptInvitation,
        rejectInvitation,

        // TO DO TASKS
        getToDoTasks,
        getArchivedToDoTasks,
        createToDoTask,
        updateToDoTask,
        deleteToDoTask,
        completeToDoTask,
        unCompleteToDoTask,

        // TAGS
        getTags,
        getActiveTags,
        createTag,
        updateTag,
        deleteTag,
        archiveTag,
        unArchiveTag,

        // NOTIFICATIONS
        getUsersNotifications,
        readNotification,
        readAllNotifications,

        // OTHER
        setUserPushToken,
        getUser,
        getUserName,
        setUserName,
        findUsers,

        getTaskPhotos,
        uploadTaskPhoto,
        uploadFile,
        getFileFromPath,
    };

    return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>;
};