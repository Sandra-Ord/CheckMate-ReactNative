import React, {useCallback, useMemo, useRef, useState} from 'react';
import {FlatList, RefreshControl, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {useFocusEffect} from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import {BottomSheetModal, BottomSheetModalProvider} from "@gorhom/bottom-sheet";
import {useSupabase} from "@/context/SupabaseContext";
import NewToDoTaskModal from "@/components/NewToDoTaskModal";
import ToDoListItem from "@/components/ToDoListItem";
import {Colors} from "@/constants/Colors";

const ArchiveView = () => {

    const [refreshing, setRefreshing] = useState(false);
    const [tasks, setTasks] = useState<[]>([]);
    const {getArchivedToDoTasks} = useSupabase();

    // Function to load archived to do tasks from Supabase
    const loadTasks = async () => {
        const data = await getArchivedToDoTasks();
        setTasks(data);
    };

    // Load tasks when the screen gains focus
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
                                renderItem={({ item }) => <ToDoListItem  task={item} showDueDate={false} />}
                                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadTasks} />}
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