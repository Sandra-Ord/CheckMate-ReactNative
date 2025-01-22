import {BottomSheetView} from "@gorhom/bottom-sheet";
import Ionicons from "@expo/vector-icons/Ionicons";
import {Alert, Text, TextInput, View} from "react-native";
import React, {useEffect, useState} from "react";
import {useSupabase} from "@/context/SupabaseContext";
import {Colors} from "@/constants/Colors";
import {ToDoTask} from "@/types/enums";
import ActionButton from "@/components/uiComponents/ActionButton";
import CustomHorizontalInput from "@/components/uiComponents/CustomHorizontalnput";
import CalendarInput from "@/components/uiComponents/CalendarInput";

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
    const [dueDateCalendarVisible, setDueDateCalendarVisible] = useState(false);
    const [tags, setTags] = useState<[]>();

    const {createToDoTask, updateToDoTask, deleteToDoTask} = useSupabase();

    const handleSelectDueDate = (value) => {
        if (value) {

            const formattedDate = value.toISOString();
            setDueDate(formattedDate);
        } else {
            setDueDate(null);
        }
        setDueDateCalendarVisible(false);
    }

    // -----------------------------------------------------------------------------------------------------------------
    // -------------------------------------------- DATABASE OPERATIONS ------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------

    const onCreateToDoTask = async () => {
        if (!taskName.trim()) {
            Alert.alert("Missing Data", "Please enter a task name.");
            return;
        }
        await createToDoTask(taskName.trim(), comment, dueDate || null);
        reload();
        closeModal();
    };

    const onUpdateToDoTask = async () => {
        if (!taskName.trim() || !task.due_date) {
            Alert.alert("Missing Data", "Please enter a task name.");
            return;
        }
        task.name = taskName.trim();
        task.comment = comment.trim();
        task.due_date = dueDate || null;
        await updateToDoTask(task);
        reload();
        closeModal();
    };

    const onDeleteToDoTask = async () => {
        await deleteToDoTask(task.id);
        closeModal();
        reload();
    }
    
    // -----------------------------------------------------------------------------------------------------------------
    // -------------------------------------------- LOAD INFORMATION ---------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------

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

                <CustomHorizontalInput
                    labelText="Due Date:"
                    placeholder="YYYY-MM-DD"
                    value={dueDate ? dueDate.split('T')[0] : "YYYY-MM-DD"}
                    handlePress={() => setDueDateCalendarVisible(true)}
                />

                <CalendarInput
                    labelText={"Choose the Task's Due Date:"}
                    value={dueDate}
                    handleSelect={handleSelectDueDate}
                    isVisible={dueDateCalendarVisible}
                    close={() => setDueDateCalendarVisible(false)}
                />
            </View>

            {task ?
                // Update and Delete Button
                <View className="flex-row items-center justify-between px-5 py-10">
                    <ActionButton
                        onPress={onUpdateToDoTask}
                        iconName={"checkmark-circle-outline"}
                        text={"Update"}
                        textColor={Colors.Complementary["100"]}
                        buttonColor={Colors.Yellow["600"]}
                    />
                    <ActionButton
                        onPress={onDeleteToDoTask}
                        iconName={"trash-bin-outline"}
                        text={"Delete"}
                        textColor={Colors.Complementary["100"]}
                        buttonColor={Colors.Red["600"]}
                    />
                </View>
                :
                // Create Button
                <View className="items-center pt-10 pb-10">
                    <ActionButton
                        onPress={onCreateToDoTask}
                        iconName={"add-outline"}
                        text={"Create Task"}
                        textColor={Colors.Complementary["100"]}
                        buttonColor={Colors.Complementary["600"]}
                    />
                </View>
            }

        </BottomSheetView>
    );
};

export default ToDoTaskModal;