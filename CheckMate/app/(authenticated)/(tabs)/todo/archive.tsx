import React, {useCallback, useState} from 'react';
import {FlatList, RefreshControl, SafeAreaView, Text, View} from 'react-native';
import {useFocusEffect} from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useSupabase} from "@/context/SupabaseContext";
import {Colors} from "@/constants/Colors";
import ToDoListItem from "@/components/todoComponents/ToDoListItem";
import SeparatorLine from "@/components/uiComponents/SeparatorLine.tsx";

const ArchiveView = () => {

    const [refreshing, setRefreshing] = useState(false);
    const [tasks, setTasks] = useState<[]>([]);
    const {getArchivedToDoTasks} = useSupabase();

    // -----------------------------------------------------------------------------------------------------------------
    // -------------------------------------------- LOAD INFORMATION ---------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------

    const loadTasks = async () => {
        const data = await getArchivedToDoTasks();
        setTasks(data);
    };

    useFocusEffect(
        useCallback(() => {
            loadTasks();
        }, [])
    );

    return (
        <SafeAreaView className="flex-1" style={{backgroundColor: Colors.Complementary["300"]}}>
            <View>

                <View className="w-full h-full">

                    <View className="flex-row w-full justify-between px-4 py-2">
                        <View className="flex-row">
                            <Ionicons name='filter' size={20} style={{color: Colors.primaryGray}}/>
                            <Text className="pl-3">Filter/Sort</Text>
                        </View>
                    </View>

                    <View className="flex-1 pb-3 px-4">
                        <FlatList
                            data={tasks}
                            renderItem={({item}) => <ToDoListItem task={item} showDueDate={false}/>}
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadTasks}/>}
                            keyExtractor={(item) => `${item.id.toString()}`}
                            ItemSeparatorComponent={() => (
                                <SeparatorLine height={0.5} margin={1} color={Colors.Complementary["800"]}/>
                            )}
                            ListEmptyComponent={
                                <View className="py-3 px-1">
                                    <View className="items-center">
                                        <Text className="text-base font-medium" style={{color: Colors.Primary["600"]}}>
                                            You have not completed any tasks yet.
                                        </Text>
                                    </View>
                                </View>
                            }
                        />
                    </View>

                </View>

            </View>
        </SafeAreaView>
    );
};


export default ArchiveView;