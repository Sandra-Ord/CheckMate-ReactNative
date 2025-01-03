import React, {useCallback, useMemo, useRef, useState} from 'react';
import {FlatList, RefreshControl, SafeAreaView, Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import { useFocusEffect } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import {BottomSheetModal, BottomSheetModalProvider} from "@gorhom/bottom-sheet";
import {useSupabase} from "@/context/SupabaseContext";
import {Colors} from "@/constants/Colors";
import ToDoListItem from "@/components/ToDoListItem";
import NewToDoTaskModal from "@/components/NewToDoTaskModal";

const ToDoView = () => {

    const [refreshing, setRefreshing] = useState(false);
    const [tasks, setTasks] = useState<[]>([]);
    const {getToDoTasks} = useSupabase();
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    const snapPoints = useMemo(() => ["80%"], []);

    const showNewTaskModal = () => {
        bottomSheetModalRef.current?.present();
    };

    // Function to load to do tasks from Supabase
    const loadTasks = async () => {
        const data = await getToDoTasks();
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
                <BottomSheetModalProvider>

                    <View className="w-full h-full">

                        <View className="flex-row w-full justify-between px-4 py-2">
                            <View className="flex-row">
                                <Ionicons name='filter' size={20} style={{color: Colors.primaryGray}}/>
                                <Text className="pl-3">Filter/Sort</Text>
                            </View>

                            <TouchableOpacity className="flex-row" onPress={() => showNewTaskModal()}>
                                <Text className="pr-2">Add Task</Text>
                                <Ionicons name='add' size={20} style={{color: Colors.primaryGray}}/>
                            </TouchableOpacity>
                        </View>

                        <View className="flex-1 pb-3 px-4">
                            <FlatList
                                data={tasks}
                                renderItem={({ item }) => <ToDoListItem task={item} showDueDate={true} />}
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

                    <BottomSheetModal
                        ref={bottomSheetModalRef}
                        index={0}
                        snapPoints={snapPoints}
                    >
                        <NewToDoTaskModal onToDoTaskCreated={() => bottomSheetModalRef.current?.dismiss()} />
                    </BottomSheetModal>

                </BottomSheetModalProvider>
            </View>
        </SafeAreaView>
    );
};


export default ToDoView;