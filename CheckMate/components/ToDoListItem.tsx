import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import {useSupabase} from "@/context/SupabaseContext";
import {Colors} from "@/constants/Colors";
import {ToDoTask} from "@/types/enums";

interface ToDoListItemInterface {
    task: ToDoTask,
    showDueDate: boolean
}

const ToDoListItem = (data: ToDoListItemInterface) => {

    const [isCompleted, setIsCompleted] = useState<boolean>(data.task.completed_at !== null);

    const {completeToDoTask, unCompleteToDoTask} = useSupabase();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { weekday: 'long', day: 'numeric', month: 'short', year: '2-digit' };
        return date.toLocaleDateString(undefined, options);
    };

    const onCompleteTask = async () => {
        await completeToDoTask(data.task);
        console.log("Task " + data.task.name + " Completed");
        setIsCompleted(true);
    };

    const onUnCompleteTask = async () => {
        await unCompleteToDoTask(data.task);
        console.log("Task " + data.task.name + " UnCompleted");
        setIsCompleted(false);
    };

    return (
        <View className="flex-row justify-between py-3 px-1">
            {/* Left Section: Checkbox + Task Name */}
            <View className="flex-row items-center">
                {isCompleted ? (
                    <TouchableOpacity onPress={() => onUnCompleteTask()}>
                        <Ionicons name="checkbox-outline" size={24} style={{ color: Colors.Primary["800"] }} />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={() => onCompleteTask()}>
                        <Ionicons name="square-outline" size={24} style={{ color: Colors.Primary["800"] }} />
                    </TouchableOpacity>
                )}

                <Text className="text-base text-primary-800 font-medium ml-3">
                    {data.task.name}
                </Text>
            </View>

            {/* Right Section: Due Date + Icon */}
            <View className="flex-row items-center">

                {data.showDueDate ? (
                    <Text className="text-sm text-primary-800 mr-3">
                        {formatDate(data.task.due_date)}
                    </Text>
                ) : (
                    <Text className="text-sm text-primary-800 mr-3">
                        {formatDate(data.task.completed_at)}
                    </Text>
                )}

                <Ionicons name="notifications" size={24} style={{ color: Colors.Primary["800"] }} />
            </View>
        </View>
    );
};

export default ToDoListItem;