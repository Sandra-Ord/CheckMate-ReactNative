import React, {useCallback, useState} from 'react';
import {FlatList, RefreshControl, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import CollectionCard from "@/components/CollectionCard.tsx";
import {Colors} from "@/constants/Colors.ts";
import {useFocusEffect, useLocalSearchParams} from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

const CollectionView = () => {

    const { id } = useLocalSearchParams<{ id: string; bg?: string }>();
    const [tasks, setTasks] = useState<[]>([]);
    // State to manage the refresh control
    const [refreshing, setRefreshing] = useState(false);

    // Function to load boards from Supabase
    const loadTasks = async () => {
        const data = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        setTasks(data);
    };

    // Load boards when the screen gains focus
    useFocusEffect(
        useCallback(() => {
            loadTasks();
        }, [])
    );

    const TaskListItem = ({id}) => (
        <View className="py-1">
            <TouchableOpacity className="rounded-3xl w-full px-6 py-4" style={{backgroundColor: Colors.Complementary["50"], aspectRatio: 9/2}}>
                <View className="border-b border-b-gray-500 pb-2">
                    <Text className="text-xl font-bold px-1" style={{color: Colors.Primary["800"]}}>
                        Task
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView>
            <View className="w-full h-full" style={{backgroundColor: Colors.Complementary["300"]}}>

                <View className="flex-row w-full justify-between px-4 py-2">
                    <View className="flex-row">
                        <Ionicons name='filter' size={20} style={{color: Colors.primaryGray}}/>
                        <Text className="pl-3">Filter/Sort</Text>
                    </View>
                    <View className="flex-row">
                        <Text className="pr-2">Add Task</Text>
                        <Ionicons name='add' size={20} style={{color: Colors.primaryGray}}/>
                    </View>
                </View>

                <View className="flex-1 justify-center items-center pb-3 px-4">
                    <FlatList
                        data={tasks}
                        renderItem={TaskListItem}
                        // refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadBoards} />}
                        keyExtractor={(item) => `${item}`}
                    />

                </View>

            </View>
        </SafeAreaView>
    );
};

export default CollectionView;


