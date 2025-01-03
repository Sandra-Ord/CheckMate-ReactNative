import { createContext, useContext, useEffect } from 'react';
import { client } from '@/utils/supabaseClient';
import { useAuth } from '@clerk/clerk-expo';
import {Collection, Tag, ToDoTask} from '@/types/enums';
import { decode } from 'base64-arraybuffer';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export const COLLECTIONS_TABLE = 'collections';
export const COLLECTION_USERS_TABLE = 'collection_users'
export const TASKS_TABLE = 'tasks';
export const TASK_LOGS_TABLE = 'task_logs';
export const TASK_NOTIFICATIONS_TABLE = 'task_notifications';
export const TO_DO_TASKS_TABLE = 'to_do_tasks';
export const TO_DO_TAGS_TABLE = 'to_do_tags';
export const TAGS_TABLE = 'tags';
export const USERS_TABLE = 'users';

type ProviderProps = {
    userId: string | null;
    createCollection: (name: string) => Promise<any>;
    getCollections: () => Promise<any>;
    getCollection: (collectionId: number) => Promise<any>;
    getCollectionInfo: (collectionId: number) => Promise<any>;
    updateCollection: (collection: Collection) => Promise<any>;
    deleteCollection: (collectionId: number) => Promise<any>;
    getCollectionTasks: (collectionId: number) => Promise<any>;
    addUserToCollection: (collectionId: number, userId: number) => Promise<any>;
    getCollectionMembers: (collectionId: number) => Promise<any>;
    getBasicTaskInformation: (taskId: number) => Promise<any>;
    getTaskLogs: (taskId: number) => Promise<any>;
    getToDoTasks: () => Promise<any>;
    getArchivedToDoTasks: () => Promise<any>;
    createToDoTask: (taskName: string, dueDate: Date) => Promise<any>;
    updateToDoTask: (task: ToDoTask) => Promise<any>;
    completeToDoTask: (task: ToDoTask) => Promise<any>;
    unCompleteToDoTask: (task: ToDoTask) => Promise<any>;
    getTags: () => Promise<any>;
    createTag: (tagName: string) => Promise<any>;
    archiveTag: (tag: Tag) => Promise<any>;
    unarchiveTag: (tag: Tag) => Promise<any>;
    updateTag: (tag: Tag) => Promise<any>;
    setUserPushToken: (token: string) => Promise<any>;
};

const SupabaseContext = createContext<Partial<ProviderProps>>({});

export function useSupabase() {
    return useContext(SupabaseContext);
}

export const SupabaseProvider = ({ children }: any) => {
    const { userId } = useAuth();

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

    const createCollection = async (name: string) => {
        const { data, error } = await client
            .from(COLLECTIONS_TABLE)
            .insert({ "name": name, "owner_id": userId });

        if (error) {
            console.error('Error creating collection:', error);
        }

        return data;
    };

    const getCollections = async () => {
        // const { data, error } = await client
        //     .from(COLLECTIONS_TABLE)
        //     .select(`name, id`);
        //
        // if (error) {
        //     console.error('Error getting collections:', error);
        // }
        //
        // return data || [];
        //test todo: change into gettings all tables from Collection_users_table
        console.log(userId);
        const {data} = await client
            .from(COLLECTIONS_TABLE)
            .select(`name, id, owner_id`)
            .eq('owner_id', userId);
        console.log("data:" + data);
        //const collections = data?.map((c: any) => c.collections);
        return data || [];
        // const {data} = await client
        //     .from(COLLECTION_USERS_TABLE)
        //     .select(`collections ( name, id, owner_id )`)
        //     .eq('user_id', userId);
        // console.log("data:" + data);
        // const collections = data?.map((c: any) => c.collections);
        // return collections || [];
    }

    const getCollection = async (collectionId: number) => {
        const { data, error } = await client
            .from(COLLECTIONS_TABLE)
            .select(`name, id`)
            .match({ id: collectionId })
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
        const { data } = await client
            .from(COLLECTIONS_TABLE)
            .update({ name: collection.name })
            .match({ id: collection.id })
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

    const addUserToCollection = async (collectionId: string, userId, string) => {
        return await client
            .from(COLLECTION_USERS_TABLE)
            .insert({
                user_id: userId,
                collection_id: collectionId,
            });
    };

    const deleteCollection = async (collectionId: string) => {
        return await client.from(COLLECTIONS_TABLE).delete().match({ collectionId });
    };

    const getCollectionTasks = async (collectionId: number) => {
        const { data, error } = await client
            .from(TASKS_TABLE)
            .select(`id, name, next_due_at, users (first_name)`)
            .match({ collection_id: collectionId });

        if (error) {
            console.error('Error creating to do task:', error);
        }

        return data;
    };

    const getBasicTaskInformation = async (taskId: number) => {
        const { data, error } = await client
            .from(TASKS_TABLE)
            .select(`id, name)`)
            .match({ id: taskId })
            .single();

        console.log("Basic Task Info: ", data);

        return data;
    };

    const getTaskLogs = async (taskId: number) => {
        const { data, error } = await client
            .from(TASK_LOGS_TABLE)
            .select(`id, comment, completed_at, due_at, users (id, first_name)`)
            .match({ task_id: taskId });
        return data;
    };

    // -----------------------------------------------------------------------------------------------------------------
    // --------------------------------------------------- TAGS --------------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------

    const getTags = async () => {
        const { data } = await client
            .from(TAGS_TABLE)
            .select(`*`)
            .eq('user_id', userId);
        return data;
    };

    const createTag = async (tagName: string) => {
        const { data, error } = await client
            .from(TAGS_TABLE)
            .insert({ "tag": tagName, "user_id": userId, "created_at": new Date().toISOString() });

        if (error) {
            console.error('Error creating to do task:', error);
        }

        return data;
    };

    const archiveTag = async (tag: Tag) => {
        const { data } = await client
            .from(TAGS_TABLE)
            .update({
                archived_at: new Date().toISOString(),
            })
            .match({ id: tag.id })
            .select('*')
            .single();

        return data;
    };

    const unArchiveTag = async (tag: Tag) => {
        const { data } = await client
            .from(TAGS_TABLE)
            .update({
                archived_at: null,
            })
            .match({ id: tag.id })
            .select('*')
            .single();

        return data;
    };

    const updateTag = async (tag: Tag) => {
        const { data } = await client
            .from(TAGS_TABLE)
            .update({
                tag: tag.tag,
                tag_icon: tag.tag_icon,
            })
            .match({ id: tag.id })
            .select('*')
            .single();

        return data;
    };

    // -----------------------------------------------------------------------------------------------------------------
    // -------------------------------------------------- TO DO TASKS --------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------

    const getToDoTasks = async () => {
        const { data, error } = await client
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
        const { data, error } = await client
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
        // todo: change due date to actual due date, for testing it is set to now
        // todo: insert the task's comment
        const { data, error } = await client
            .from(TO_DO_TASKS_TABLE)
            .insert({ "user_id": userId, "name": taskName, "comment": null, "due_date": new Date().toISOString(), "created_at": new Date().toISOString() });

        if (error) {
            console.error('Error creating to do task:', error);
        }

        return data;
    };


    const updateToDoTask = async (task: ToDoTask) => {
        const { data } = await client
            .from(TO_DO_TASKS_TABLE)
            .update({
                name: task.name,
                comment: task.comment,
                due_date: task.due_date,
            })
            .match({ id: task.id })
            .select('*')
            .single();

        return data;
    };

    const completeToDoTask = async (task: ToDoTask) => {
        const { data } = await client
            .from(TO_DO_TASKS_TABLE)
            .update({
                completed_at: new Date().toISOString(),
            })
            .match({ id: task.id })
            .select('*')
            .single();

        return data;
    };

    const unCompleteToDoTask = async (task: ToDoTask) => {
        const { data } = await client
            .from(TO_DO_TASKS_TABLE)
            .update({
                completed_at: null,
            })
            .match({ id: task.id })
            .select('*')
            .single();

        return data;
    };

    // -----------------------------------------------------------------------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------

    const setUserPushToken = async (token: string) => {
        const { data, error } = await client
            .from(USERS_TABLE)
            .upsert({ id: userId, push_token: token });

        if (error) {
            console.error('Error setting push token:', error);
        }

        return data;
    };

    const value = {
        userId,
        createCollection,
        getCollections,
        getCollection,
        getCollectionInfo,
        updateCollection,
        deleteCollection,
        getCollectionTasks,
        addUserToCollection,
        getCollectionMembers,
        getBasicTaskInformation,
        getTaskLogs,
        getTags,
        createTag,
        archiveTag,
        unArchiveTag,
        updateTag,
        getToDoTasks,
        getArchivedToDoTasks,
        createToDoTask,
        updateToDoTask,
        completeToDoTask,
        unCompleteToDoTask,
        setUserPushToken,
    };

    return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>;
};