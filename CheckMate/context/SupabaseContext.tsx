import { createContext, useContext, useEffect } from 'react';
import { client } from '@/utils/supabaseClient';
import { useAuth } from '@clerk/clerk-expo';
import { Collection } from '@/types/enums';
import { decode } from 'base64-arraybuffer';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export const COLLECTIONS_TABLE = 'collections';
export const COLLECTION_USERS_TABLE = 'collection_users'
export const TASKS_TABLE = 'tasks';
export const TASK_LOGS_TABLE = 'task_logs';
export const TASK_NOTIFICATIONS_TABLE = 'task_notifications';
export const TODO_TASKS_TABLE = 'todo_tasks';
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
        const {data} = await client
            .from(COLLECTION_USERS_TABLE)
            .select(`boards ( title, id, background )`)
            .eq('user_id', userId);
        const collections = data?.map((c: any) => c.collections);
        return collections || [];
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
        return await client.from(COLLECTION_USERS_TABLE)
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
            .select(`id, name, users (first_name)`)
            .match({ collection_id: collectionId });
        console.log(data);


        return data;
    }

    const getBasicTaskInformation = async (taskId: number) => {
        const { data, error } = await client
            .from(TASKS_TABLE)
            .select(`id, name)`)
            .match({ id: taskId })
            .single();

        console.log("Basic Task Info: ", data);

        return data;
    }

    const getTaskLogs = async (taskId: number) => {
        const { data, error } = await client
            .from(TASK_LOGS_TABLE)
            .select(`id, comment, completed_at, due_at, users (first_name), tasks (name)`)
            .match({ task_id: taskId });

        console.log(data);

        return data;
    }

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
        setUserPushToken,
    };

    return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>;
};