import React, {useCallback, useMemo, useRef, useState} from 'react';
import {FlatList, RefreshControl, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {Link, router, useFocusEffect, useLocalSearchParams, Stack} from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useSupabase} from "@/context/SupabaseContext";
import {Collection, Task} from "@/types/enums";
import {Colors} from "@/constants/Colors";
import TaskListItem from "@/components/TaskListItem";

const CollectionView = () => {

    const { id } = useLocalSearchParams<{ id: string }>();

    // State to manage the refresh control
    const [refreshing, setRefreshing] = useState(false);
    const [collection, setCollection] = useState<Collection>();
    const [tasks, setTasks] = useState<[]>([]);
    const {getCollectionInfo, getCollectionTasks} = useSupabase();

    // Function to load collection's tasks from Supabase
    const loadTasks = async () => {
        const data = await getCollectionTasks(id);
        setTasks(data);
    };

    const loadCollectionInfo = async () => {
        if (!id) return;
        const data = await getCollectionInfo!(id);
        console.log(data);
        setCollection(data);
    };

    // Load boards when the screen gains focus
    useFocusEffect(
        useCallback(() => {
            loadCollectionInfo();
            loadTasks();
        }, [])
    );

    return (
        <SafeAreaView className="flex-1">

                <Stack.Screen
                    options={{
                        headerTitle: () => (
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: Colors.Complementary["900"], fontSize: 16 }}>{collection?.name}</Text>
                                <Text style={{ color: Colors.Complementary["900"], fontSize: 12 }}>Collection of {collection?.users.first_name}</Text>
                            </View>
                        ),
                        headerRight: () => (
                            <View className="flex-row gap-4">
                                <TouchableOpacity onPress={() => {}}>
                                    <Ionicons name="filter-circle-outline" size={26} color={Colors.Complementary["900"]} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {}}>
                                    <Ionicons name="notifications-outline" size={26} color={Colors.Complementary["900"]} />
                                </TouchableOpacity>
                                <Link href={`/(authenticated)/(tabs)/collections/collection/settings?id=${id}`} asChild>
                                    <TouchableOpacity>
                                        <Ionicons name="ellipsis-horizontal" size={26} color={Colors.Complementary["900"]} />
                                    </TouchableOpacity>
                                </Link>
                            </View>
                        ),
                        headerTransparent: false,
                    }}
                />

                <View className="w-full h-full" style={{backgroundColor: Colors.Complementary["300"]}}>

                    <View className="flex-row w-full items-center justify-between px-4 py-2">
                        <View className="flex-row items-center">
                            <Ionicons name='filter' size={20} style={{color: Colors.primaryGray}}/>
                            <Text className="pl-3">Filter/Sort</Text>
                        </View>

                        <Link href={`/(authenticated)/(tabs)/collections/collection/new_task?id=${id}`} asChild>
                            <TouchableOpacity className="flex-row items-center">
                                <Text className="pr-2">Add Task</Text>
                                <Ionicons name='add' size={20} style={{color: Colors.primaryGray}}/>
                            </TouchableOpacity>
                        </Link>

                    </View>

                    <View className="flex-1 justify-center pb-3 px-5">
                        <FlatList
                            data={tasks}
                            renderItem={({ item }) => <TaskListItem {...item} />}
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadTasks} />}
                            keyExtractor={(item) => `${item.id.toString()}`}
                        />

                    </View>

                </View>

        </SafeAreaView>
    );
};


export default CollectionView;