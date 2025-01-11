import React, {useCallback, useState} from 'react';
import {FlatList, RefreshControl, SafeAreaView, TouchableOpacity, View} from 'react-native';
import {Link, Stack, useFocusEffect, useLocalSearchParams} from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useSupabase} from "@/context/SupabaseContext";
import TaskLogListItem from "@/components/TaskLogListItem";
import {Task} from "@/types/enums";
import {Colors} from "@/constants/Colors";

const TaskLogView = () => {

    const {id} = useLocalSearchParams<{ id: string }>();

    const [refreshing, setRefreshing] = useState(false);
    const [task, setTask] = useState<Task>();
    const [logs, setLogs] = useState<[]>([]);
    const {getBasicTaskInformation, getTaskLogs} = useSupabase();

    // -----------------------------------------------------------------------------------------------------------------
    // -------------------------------------------- LOAD INFORMATION ---------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------

    const loadTask = async () => {
        const data = await getBasicTaskInformation(id);
        setTask(data);
    };

    const loadTaskLogs = async () => {
        if (!id) return;
        const data = await getTaskLogs!(id);
        console.log(data);
        setLogs(data);
    };

    useFocusEffect(
        useCallback(() => {
            loadTask();
            loadTaskLogs();
        }, [])
    );

    return (
        <SafeAreaView className="flex-1">
            <View className="w-full h-full" style={{backgroundColor: Colors.Complementary["300"]}}>

                <Stack.Screen options={{
                    headerTitle: task?.name ? `${task.name} Log` : "Task Log",
                    headerRight: () => (
                        <Link href={`/(authenticated)/(tabs)/collections/collection/task/statistics?id=${id}`} asChild>
                            <TouchableOpacity>
                                <Ionicons name="stats-chart-outline" size={24} color={Colors.Complementary["900"]}/>
                            </TouchableOpacity>
                        </Link>
                    )
                }}
                />

                <View className="flex-1 pb-3 px-4 pt-2">
                    <FlatList
                        data={logs}
                        renderItem={({item}) => <TaskLogListItem {...item} />}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadTaskLogs}/>}
                        keyExtractor={(item) => `${item.id.toString()}`}
                        ItemSeparatorComponent={() => (
                            <View
                                style={{
                                    height: 0.5,
                                    backgroundColor: Colors.Complementary["800"],
                                }}
                            />
                        )}
                    />
                </View>

            </View>
        </SafeAreaView>
    );
};

export default TaskLogView;