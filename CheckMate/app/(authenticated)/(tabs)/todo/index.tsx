import React, {useCallback, useMemo, useRef, useState} from 'react';
import {FlatList, RefreshControl, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {useFocusEffect} from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import {BottomSheetModal, BottomSheetModalProvider} from "@gorhom/bottom-sheet";
import {useSupabase} from "@/context/SupabaseContext";
import {Colors} from "@/constants/Colors";
import {ToDoTask} from "@/types/enums";
import ToDoListItem from "@/components/todoComponents/ToDoListItem";
import ToDoTaskModal from "@/components/todoComponents/ToDoTaskModal";
import NoTasksListItem from "@/components/taskComponents/NoTasksListItem.tsx";
import {formatDateWithDay} from "@/utils/textUtils.ts";
import SeparatorLine from "@/components/uiComponents/SeparatorLine.tsx";

const ToDoView = () => {

    const [refreshing, setRefreshing] = useState(false);
    const [tasks, setTasks] = useState<[]>([]);
    const [selectedTask, setSelectedTask] = useState<ToDoTask | null>(null);
    const {getToDoTasks} = useSupabase();

    // -----------------------------------------------------------------------------------------------------------------
    // ----------------------------------------------- TASK MODAL ------------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ["100%"], []);

    const showNewTaskModal = () => {
        setSelectedTask(null);
        bottomSheetModalRef.current?.present();
    };

    const showEditTaskModal = (task: ToDoTask) => {
        setSelectedTask(task); // Set the selected task to edit
        bottomSheetModalRef.current?.present();
    };

    // -----------------------------------------------------------------------------------------------------------------
    // -------------------------------------------- LOAD INFORMATION ---------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------

    const loadTasks = async () => {
        const data = await getToDoTasks();
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
                <BottomSheetModalProvider>

                    <View className="w-full h-full">

                        <View className="flex-row w-full items-center justify-between px-4 py-2">
                            <View className="flex-row items-center">
                                <Ionicons name='filter' size={20} style={{color: Colors.primaryGray}}/>
                                <Text className="pl-3">Filter/Sort</Text>
                            </View>

                            <TouchableOpacity className="flex-row items-center" onPress={() => showNewTaskModal()}>
                                <Text className="pr-2">Add Task</Text>
                                <Ionicons name='add' size={20} style={{color: Colors.primaryGray}}/>
                            </TouchableOpacity>
                        </View>

                        <View className="flex-1 pb-3 px-4">
                            <FlatList
                                data={tasks}
                                renderItem={({item}) => (
                                    <TouchableOpacity onPress={() => showEditTaskModal(item)}>
                                        <ToDoListItem task={item} showDueDate={true}/>
                                    </TouchableOpacity>
                                )}
                                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadTasks}/>}
                                keyExtractor={(item) => `${item.id.toString()}`}
                                ItemSeparatorComponent={() => (
                                    <SeparatorLine height={0.5} margin={1} color={Colors.Complementary["800"]}/>
                                )}
                                ListEmptyComponent={
                                    <View className="py-3 px-1">
                                        <View className="items-center">
                                            <Text className="text-base font-medium" style={{color: Colors.Primary["600"]}}>
                                                You don't have any uncompleted tasks.
                                            </Text>
                                        </View>
                                    </View>
                                }
                            />
                        </View>

                    </View>

                    <BottomSheetModal
                        ref={bottomSheetModalRef}
                        onDismiss={() => setSelectedTask(null)}
                        index={0}
                        snapPoints={snapPoints}
                    >
                        <ToDoTaskModal
                            task={selectedTask}
                            closeModal={() => {
                                bottomSheetModalRef.current?.dismiss();
                            }}
                            reload={() => loadTasks()}
                        />
                    </BottomSheetModal>

                </BottomSheetModalProvider>
            </View>
        </SafeAreaView>
    );
};


export default ToDoView;