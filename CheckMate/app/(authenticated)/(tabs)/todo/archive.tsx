import React, {useCallback, useState} from 'react';
import {FlatList, RefreshControl, SafeAreaView, Text, View} from 'react-native';
import {useFocusEffect} from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useSupabase} from "@/context/SupabaseContext";
import {Colors} from "@/constants/Colors";
import ToDoListItem from "@/components/todoComponents/ToDoListItem";

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

            </View>
        </SafeAreaView>
    );
};


export default ArchiveView;