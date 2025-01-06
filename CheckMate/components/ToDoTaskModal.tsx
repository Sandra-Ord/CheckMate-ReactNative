import {BottomSheetView} from "@gorhom/bottom-sheet";
import Ionicons from "@expo/vector-icons/Ionicons";
import {Text, TextInput, TouchableOpacity, View} from "react-native";
import React, {useEffect, useState} from "react";
import {useSupabase} from "@/context/SupabaseContext";
import {Colors} from "@/constants/Colors";
import {ToDoTask} from "@/types/enums";

const ToDoTaskModal = ({
                           closeModal,
                           reload,
                           task
                       }: {
    closeModal: () => void,
    reload: () => void,
    task?: ToDoTask
}) => {

    // todo: add tag inputs

    const [taskName, setTaskName] = useState<string>("");
    const [comment, setComment] = useState<string>("");
    const [dueDate, setDueDate] = useState('');
    const [tags, setTags] = useState<[]>();

    const {createToDoTask, updateToDoTask, deleteToDoTask} = useSupabase();

    const onCreateToDoTask = async () => {
        if (!taskName.trim()) {
            alert('Please enter a task name.');
            return;
        }
        await createToDoTask(taskName.trim(), comment, dueDate);
        reload();
        closeModal();
    };

    const onUpdateToDoTask = async () => {
        if (!taskName.trim()) {
            alert('Please enter a task name.');
            return;
        }
        task.name = taskName.trim();
        task.comment = comment.trim();
        task.due_date = dueDate;
        await updateToDoTask(task);
        reload();
        closeModal();
    };

    const onDeleteToDoTask = async () => {
        await deleteToDoTask(task.id);
        closeModal();
        reload();
    }

    useEffect(() => {
        if (task) {
            setTaskName(task.name);
            setComment(task.comment || '');
            setDueDate(task.due_date || '');
        }
    }, [task]);

    return (
        <BottomSheetView className="px-5">

            {/* Modal Title */}
            <View className="flex-row justify-between items-center">
                <Text className="pt-5 text-2xl font-bold" style={{color: Colors.Complementary["800"]}}>
                    {task == null ? 'New To Do Task:' : 'Edit To Do Task:'}
                </Text>
                <Ionicons onPress={() => closeModal()} name="close" size={20}
                          style={{color: Colors.Complementary["800"]}}/>
            </View>


            {/* Task Name Input */}
            <View className="pt-5">
                <Text className="text-sm my-2" style={{color: Colors.Primary["800"]}}>Task Name:</Text>
                <TextInput
                    value={taskName}
                    placeholder="New Task's Name"
                    onChangeText={setTaskName}
                    className="rounded-lg p-2"
                    style={{backgroundColor: Colors.Complementary["50"]}}
                    returnKeyType="done"
                    enterKeyHint="done"
                    autoFocus
                />
            </View>

            {/* Task Comment Input */}
            <View className="pt-5">
                <Text className="text-sm my-2" style={{color: Colors.Primary["800"]}}>Task Description
                    (Optional):</Text>
                <TextInput
                    value={comment}
                    placeholder="Additional Information About the Task"
                    onChangeText={setComment}
                    className="rounded-lg p-2"
                    style={{backgroundColor: Colors.Complementary["50"]}}
                    returnKeyType="done"
                    enterKeyHint="done"
                />
            </View>

            {/* Due Date Input */}
            <View className="flex-row items-center pt-5 gap-x-2 ">
                <Text className="text-sm " style={{color: Colors.Primary["800"]}}>Due Date:</Text>
                <TextInput
                    value={dueDate}
                    placeholder="Select Due Date"
                    onChangeText={setDueDate}
                    className="rounded-lg flex-1 p-2"
                    style={{backgroundColor: Colors.Complementary["50"]}}
                    returnKeyType="done"
                    enterKeyHint="done"
                />
            </View>

            {task ?
                // Update and Delete Button
                <View className="flex-row items-center justify-between px-5 py-10">
                    <TouchableOpacity
                        className="py-2 px-8  rounded-xl items-center flex-row gap-x-2"
                        style={{backgroundColor: Colors.Yellow["600"]}}
                        onPress={() => onUpdateToDoTask()}
                    >
                        <Ionicons name="checkmark-circle-outline" size={20}
                                  style={{color: Colors.Complementary["100"]}}/>
                        <Text style={{color: Colors.Complementary["100"]}}>Update</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="py-2 px-8 rounded-xl items-center flex-row gap-x-2"
                        style={{backgroundColor: Colors.Red["600"]}}
                        onPress={() => onDeleteToDoTask()}
                    >
                        <Ionicons name="trash-bin-outline" size={20} style={{color: Colors.Complementary["100"]}}/>
                        <Text style={{color: Colors.Complementary["100"]}}>Delete</Text>
                    </TouchableOpacity>
                </View>
                :
                // Create Button
                <View className="items-center pt-10 pb-10">
                    <TouchableOpacity
                        className="py-2 px-8 mx-16 rounded-xl items-center"
                        style={{backgroundColor: Colors.Complementary["700"]}}
                        onPress={() => onCreateToDoTask()}
                    >
                        <Text style={{color: Colors.Complementary["100"]}}>Create Task</Text>
                    </TouchableOpacity>
                </View>
            }

        </BottomSheetView>
    );
};

export default ToDoTaskModal;