import {createContext, useContext, useEffect} from 'react';
import {client} from '@/utils/supabaseClient';
import {useAuth} from '@clerk/clerk-expo';
import {Collection, Tag, Task, ToDoTask} from '@/types/enums';
import {decode} from 'base64-arraybuffer';
import {RealtimePostgresChangesPayload} from '@supabase/supabase-js';
import {
    calculateCompletionStartDate,
    calculateCompletionStartDateString,
    calculateNextDueDate
} from "@/utils/taskDateUtils.ts";

export const COLLECTIONS_TABLE = 'collections';
export const COLLECTION_USERS_TABLE = 'collection_users'
export const TASKS_TABLE = 'tasks';
export const TASK_LOGS_TABLE = 'task_logs';
export const TASK_NOTIFICATIONS_TABLE = 'task_notifications';
export const TASK_PHOTOS = 'task_photos'
export const TO_DO_TASKS_TABLE = 'to_do_tasks';
export const TO_DO_TAGS_TABLE = 'to_do_tags';
export const TAGS_TABLE = 'tags';
export const USERS_TABLE = 'users';
export const FILES_BUCKET = 'files';

type ProviderProps = {
    userId: string | null;
    createCollection: (name: string) => Promise<any>;
    // COLLECTION LIST VIEW FUNCTIONS
    getCollections: () => Promise<any>;
    getAcceptedUsersCount: (collectionId) => Promise<any>;
    getActiveTasksCount: (collectionId) => Promise<any>;
    getPendingTaskCount: (collectionId) => Promise<any>;
    //
    getCollection: (collectionId: number) => Promise<any>;
    getCollectionInfo: (collectionId: number) => Promise<any>;
    updateCollection: (collection: Collection) => Promise<any>;
    deleteCollection: (collectionId: number) => Promise<any>;
    addUserToCollection: (collectionId: number, invitedUserId: number) => Promise<any>;
    getCollectionMembers: (collectionId: number) => Promise<any>;
    getTaskLogs: (taskId: number) => Promise<any>;
    // NEW TASK VIEW FUNCTIONS
    getTaskInformation: (taskId: number) => Promise<any>;
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
    // COLLECTION VIEW FUNCTIONS
    completeTask: (task: Task, completionDate: Date, logComment: string, nextAssignedToUserId: string) => Promise<any>;
    getCollectionTasks: (collectionId: number) => Promise<any>;
    getBasicTaskInformation: (taskId: number) => Promise<any>;
    getCollectionUsers: (collectionId: number) => Promise<any>;
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
    archiveTag: (tag: Tag) => Promise<any>;
    unarchiveTag: (tag: Tag) => Promise<any>;
    updateTag: (tag: Tag) => Promise<any>;
    deleteTag: (tagId: number) => Promise<any>;
    // USER
    setUserPushToken: (token: string) => Promise<any>;
    getUserName: () => Promise<any>;
    setUserName: (firstName: string) => Promise<any>;
    getTaskPhotos: (taskId: number) => Promise<any>;
    findUsers: (search: string) => Promise<any>;
    uploadFile: (filePath: string, base64: string, contentType: string) => Promise<any>;
    getFileFromPath: (path: string) => Promise<any>;
    uploadTaskPhoto: (taskId: number, filePath: string, base64: string, contentType: string) => Promise<any>;
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
            template: 'supabase', //NB CHANGE!
        });

        client.realtime.setAuth(clerkToken!);
    };

    // -----------------------------------------------------------------------------------------------------------------
    // --------------------------------- FUNCTIONS FOR THE COLLECTION LIST VIEW ----------------------------------------
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
            .eq('status', 'ACCEPTED');

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
            .eq('status', 'ACCEPTED');

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
            return 0;
        }

        return data.length;
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
            return 0;
        }

        return data?.length;
    };

    // -----------------------------------------------------------------------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------
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

        console.log(data);

        return data || null;
    };

    const getCollectionInfo = async (collectionId: number) => {
        const {data, error} = await client
            .from(COLLECTIONS_TABLE)
            .select(`*, users (first_name)`)
            .match({id: collectionId})
            .single();
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

    const getCollectionMembers = async (collectionId: string) => {
        const {data} = await client
            .from(COLLECTION_USERS_TABLE)
            .select('users(*)')
            .eq('collection_id', collectionId);

        const members = data?.map((c: any) => c.users);
        return members;
    };

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

    const deleteCollection = async (collectionId: string) => {
        return await client.from(COLLECTIONS_TABLE).delete().match({collectionId});
    };


    const getTaskLogs = async (taskId: number) => {
        const {data, error} = await client
            .from(TASK_LOGS_TABLE)
            .select(`id, comment, completed_at, due_at, users (id, first_name)`)
            .match({task_id: taskId});
        return data;
    };

    // -----------------------------------------------------------------------------------------------------------------
    // ------------------------------------------ NEW TASK VIEW FUNCTIONS ----------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------


    const getTaskInformation = async (taskId: number) => {
        const {data, error} = await client
            .from(TASKS_TABLE)
            .select(`*, users (first_name)`)
            .match({id: taskId})
            .single();

        if (error) {
            console.error('Error fetching task information:', error);
            return [];
        }

        return data;
    };

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
        console.log("update task")
        console.log(task);
        const {data, error} = await client
            .from(TASKS_TABLE)
            .update(task)
            .match({id: task.id})
            .select('*')
            .single();

        if (error) {
            console.error("Error updating task: " + error);
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
    // ------------------------------------------ COLLECTION VIEW FUNCTIONS --------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------

    const completeTask = async (task: Task, completionDate: Date, logComment: string, nextAssignedToUserId: string) => {
        console.log(task);
        console.log(completionDate)
        console.log(logComment)
        console.log(userId)
        console.log(nextAssignedToUserId)

        const {logData, logError} = await client
            .from(TASK_LOGS_TABLE)
            .insert({
                "task_id": task.id,
                "user_id": userId,
                "completed_at": completionDate.toISOString(),
                "due_at": task.next_due_at,
                "comment": logComment ? logComment.trim() : null
            });

        console.log("after log creation")
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

        const { taskData, taskError } = await client
            .from(TASKS_TABLE)
            .update({
                last_completed_at: task.last_completed_at,
                completion_start: task.completion_start,
                next_due_at: task.next_due_at,
                assigned_to_user_id: task.assigned_to_user_id,
                archived_at: task.archived_at
            })
            .eq('id', task.id )
            .select("*")
            .single();

        if (taskError) {
            console.error("Error updating task:", taskError);
            return null;
        }

        return taskData;
    };

    const getCollectionTasks = async (collectionId: number) => {
        const {data, error} = await client
            .from(TASKS_TABLE)
            .select(`*, users (id, first_name, email)`)
            .match({collection_id: collectionId})
            .order('next_due_at', { ascending: true })  // Sort by next_due_at ascending
            .order('completion_window_days', { nullsFirst: false, ascending: true });  // Sort by completion_window_days ascending, nullsFirst
        ;

        if (error) {
            console.error('Error creating to do task:', error);
        }

        return data;
    };

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

    const getCollectionUsers = async (collectionId) => {
        const {data, error} = await client
            .from(COLLECTION_USERS_TABLE)
            .select('users!collection_users_user_id_fkey (id, first_name, email)')
            .eq('collection_id', collectionId)
            .eq('status', 'ACCEPTED');

        if (error) {
            console.error('Error fetching collection users:', error);
            return [];
        }

        const result = data?.map((row: any) => row.users) || [];
        return result || [];
    };

    // -----------------------------------------------------------------------------------------------------------------
    // ---------------------------------------------- INVITATIONS-------------------------------------------------------
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
            .update({responded_at: new Date().toISOString(), status: "ACCEPTED"})
            .match({id: invitationId})
            .select('*')
            .single();
        return data;
    };

    const rejectInvitation = async (invitationId) => {
        const {data, error} = await client
            .from(COLLECTION_USERS_TABLE)
            .update({responded_at: new Date().toISOString(), status: "REJECTED"})
            .match({id: invitationId})
            .select('*')
            .single();
        return data;
    };

    // -----------------------------------------------------------------------------------------------------------------
    // --------------------------------------------------- TAGS --------------------------------------------------------
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
            console.error('Error creating to do task:', error);
        }

        return data;
    };

    const archiveTag = async (tag: Tag) => {
        const {data} = await client
            .from(TAGS_TABLE)
            .update({
                archived_at: new Date().toISOString(),
            })
            .match({id: tag.id})
            .select('*')
            .single();

        return data;
    };

    const unArchiveTag = async (tag: Tag) => {
        const {data} = await client
            .from(TAGS_TABLE)
            .update({
                archived_at: null,
            })
            .match({id: tag.id})
            .select('*')
            .single();

        return data;
    };

    const updateTag = async (tag: Tag) => {
        const {data} = await client
            .from(TAGS_TABLE)
            .update({
                tag: tag.tag,
                tag_icon: tag.tag_icon,
            })
            .match({id: tag.id})
            .select('*')
            .single();

        return data;
    };

    const deleteTag = async (tagId: number) => {
        return client
            .from(TAGS_TABLE)
            .delete()
            .match({id: tagId})
            .single();
    };

    // -----------------------------------------------------------------------------------------------------------------
    // -------------------------------------------------- TO DO TASKS --------------------------------------------------
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

        console.log(data);
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

        console.log(data);
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
        const {data} = await client
            .from(TO_DO_TASKS_TABLE)
            .update({
                name: task.name,
                comment: task.comment,
                due_date: task.due_date,
            })
            .match({id: task.id})
            .select('*')
            .single();

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
        const {data} = await client
            .from(TO_DO_TASKS_TABLE)
            .update({
                completed_at: new Date().toISOString(),
            })
            .match({id: task.id})
            .select('*')
            .single();

        return data;
    };

    const unCompleteToDoTask = async (task: ToDoTask) => {
        const {data} = await client
            .from(TO_DO_TASKS_TABLE)
            .update({
                completed_at: null,
            })
            .match({id: task.id})
            .select('*')
            .single();

        return data;
    };

    // -----------------------------------------------------------------------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------

    const getUserName = async () => {
        const {data, error} = await client
            .from(USERS_TABLE)
            .select('first_name')
            .match({id: userId})
            .single();
        if (error) {
            console.error("Error retrieving user name: " + error);
        }
        return data || null;
    };

    const setUserName = async (firstName) => {
        const {data, error} = await client
            .from(USERS_TABLE)
            .update({first_name: firstName})
            .match({id: userId})
            .select("*");
        if (error) {
            console.error("Error setting user name: " + error);
        }
        return data || null;
    };

    const setUserPushToken = async (token: string) => {
        const {data, error} = await client
            .from(USERS_TABLE)
            .upsert({id: userId, push_token: token});

        if (error) {
            console.error('Error setting push token:', error);
        }

        return data;
    };

    const findUsers = async (search: string) => {
        // Use the search_users stored procedure to find users by email
        //const { data, error } = await client.rpc('search_users', { search: search });
        //const {data, error} = await client.from(USERS_TABLE).eq('email', search).select("*");
        console.log("searching");
        console.log(search)

        const {data, error} = await client
            .from(USERS_TABLE)
            .select("*")
            .ilike('email', `%${search.trim()}%`);
        console.log("data: "+data)
        if (error) {
            console.error("Error finding users: " + error);
        }
        return data || [];
    };

    const getTaskPhotos = async (taskId: number) => {
        const {data, error} = await client
            .from(TASK_PHOTOS)
            .select('*')
            .match({task_id: taskId})

        if (error) {
            console.error("Error fetching photos: " + error);
        }
        return data || [];
    }

    const uploadTaskPhoto = async (taskId: number, filePath: string, base64: string, contentType: string) => {
        console.log("upload task photo")
        try {
            console.log("try")
            // Upload the photo to the bucket
            console.log("cp 1")
            const { data: uploadData, error: uploadError } = await client.storage
                .from(FILES_BUCKET)
                .upload(filePath, decode(base64), { contentType });
            console.log("cp 2")

            if (uploadError) {
                console.error("Error uploading file to bucket:", uploadError);
                return null;
            }
            console.log("cp 3")

            // Get the path of the uploaded file
            const uploadedFilePath = uploadData?.path;
            if (!uploadedFilePath) {
                console.error("File path not returned after upload.");
                return null;
            }
            console.log("cp 4")

            // Insert a record into the task_photos table
            const { data: photoData, error: insertError } = await client
                .from(TASK_PHOTOS)
                .insert({
                    task_id: taskId,
                    photo_url: uploadedFilePath,
                    uploaded_at: new Date().toISOString(),
                })
                .select("*")
                .single();
            console.log("cp 5")

            if (insertError) {
                console.error("Error inserting photo record:", insertError);
                return null;
            }
            console.log("cp 6")


            // Return the combined result
            return { uploadedFilePath, photoData };
        } catch (error) {
            console.log("catch")
            console.error("Unexpected error in uploadTaskPhoto:", error);
            return null;
        }
    };

    const uploadFile = async (filePath: string, base64: string, contentType: string) => {
        const { data } = await client.storage
            .from(FILES_BUCKET)
            .upload(filePath, decode(base64), { contentType });

        return data?.path;
    };

    const getFileFromPath = async (path: string) => {
        const { data } = await client
            .storage
            .from(FILES_BUCKET)
            .createSignedUrl(path, 60 * 60, {
            transform: {
                width: 300,
                height: 200,
            },
        });

        if (error) console.error("Error generating signed URL:", error);

        console.log("getfilefrompath")
        console.log("getfilefrompath")
        console.log("getfilefrompath")
        console.log("getfilefrompath")
        console.log("getfilefrompath")
        console.log("getfilefrompath")


        console.log(data);
        console.log(data.signedUrl);

        console.log("getfilefrompath")
        console.log("getfilefrompath")
        console.log("getfilefrompath")
        console.log("getfilefrompath")
        console.log("getfilefrompath")
        console.log("getfilefrompath")
        console.log("getfilefrompath")
        console.log("getfilefrompath")
        console.log("getfilefrompath")
        console.log("getfilefrompath")


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
        //
        getCollection,
        getCollectionInfo,
        updateCollection,
        deleteCollection,
        getCollectionTasks,
        addUserToCollection,
        getCollectionMembers,
        getBasicTaskInformation,
        getTaskLogs,
        getCollectionUsers,
        // NEW TASK VIEW FUNCTIONS
        getTaskInformation,
        createTask,
        updateTask,
        deleteTask,
        archiveTask,
        unArchiveTask,
        // COLLECTION VIEW FUNCTIONS
        completeTask,
        getCollectionTasks,
        getBasicTaskInformation,
        getCollectionUsers,
        // INVITATIONS
        getPendingInvitations,
        acceptInvitation,
        rejectInvitation,
        // TAGS
        getTags,
        getActiveTags,
        createTag,
        archiveTag,
        unArchiveTag,
        updateTag,
        deleteTag,
        // TO DO TASKS
        getToDoTasks,
        getArchivedToDoTasks,
        createToDoTask,
        updateToDoTask,
        deleteToDoTask,
        completeToDoTask,
        unCompleteToDoTask,
        //User
        setUserPushToken,
        getUserName,
        setUserName,
        getTaskPhotos,
        uploadTaskPhoto,
        uploadFile,
        findUsers,
        getFileFromPath,
    };

    return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>;
};