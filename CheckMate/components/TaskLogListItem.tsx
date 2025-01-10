import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import {useSupabase} from "@/context/SupabaseContext";
import {Colors} from "@/constants/Colors";
import {TaskLog} from "@/types/enums";
import {formatShortDate} from "@/utils/textUtils";

const TaskLogListItem = (log: TaskLog) => {

    const [showComment, setShowComment] = useState(false);

    // todo: add task log (comment and completed_at date) and deleting?
    const {userId} = useSupabase();

    const toggleCommentVisibility = () => {
        setShowComment(!showComment);
    };

    return (
        <View className="py-3 px-1">
            <View className="flex-col">

                {/* First Row: completed at */}
                <View className="flex-row justify-between items-center pb-2">
                    <View className="flex-row items-center">
                        <Ionicons className="pr-2" name="calendar-outline" size={20}
                                  style={{color: Colors.Primary["800"]}}/>
                        <Text>Completed at: {formatShortDate(log.completed_at)}</Text>
                    </View>
                    {log.comment && log.comment.trim() !== "" && (
                        <TouchableOpacity className="items-center" onPress={toggleCommentVisibility}>
                            <Ionicons name="chatbubble-outline" size={18} style={{color: Colors.Primary["800"]}}/>
                        </TouchableOpacity>
                    )}
                </View>

                {/*Second Row: completed by and due by*/}
                <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center">
                        <Ionicons className="pr-2" name="person-circle-outline" size={16}
                                  style={{color: Colors.Primary["800"]}}/>
                        <Text className="text-sm">Completed by: {log.users.first_name}</Text>
                    </View>
                    <View className="flex-row items-center">
                        <Ionicons className="pr-2" name="time-outline" size={16}
                                  style={{color: Colors.Primary["800"]}}/>
                        <Text className="text-sm">Due by: {formatShortDate(log.due_at)}</Text>
                    </View>
                </View>

                {/* Show comment if visible */}
                {showComment && log.comment && (
                    <View className="px-1 pt-2 justify-center">
                        <Text className="text-sm italic" style={{color: Colors.Primary["600"]}}>
                            {log.comment.trim()}
                        </Text>
                    </View>
                )}

            </View>
        </View>
    );
};

export default TaskLogListItem;