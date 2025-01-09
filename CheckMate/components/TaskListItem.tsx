import React from 'react';
import {Href, Link, useRouter} from "expo-router";
import {Text, TouchableOpacity, View} from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import {Colors} from "@/constants/Colors";
import {Task} from "@/types/enums";
import {formatShortDate, getBasicRecurrenceDescriptions} from "@/utils/textUtils";

const TaskListItem = ({task, onTaskComplete} : {task: Task, onTaskComplete: (task: Task) => void }) => {

    return (
        <View className="py-1">
            <TouchableOpacity className="rounded-3xl w-full px-4 py-4"
                              style={{backgroundColor: Colors.Complementary["50"]}}>
                <View className="flex-col">

                    {/* on top of the separator line */}
                    <View className="flex-row justify-between">

                        {/*aligned to the left*/}
                        <View className="flex-row items-center">
                            <TouchableOpacity className="px-1" onPress={() => onTaskComplete(task)}>
                                <Ionicons name="square-outline" size={20} style={{color: Colors.Primary["800"]}}/>
                            </TouchableOpacity>
                            <View className="flex-row items-center pl-1">
                                <Ionicons name="notifications-outline" size={18}
                                          style={{color: Colors.Primary["800"]}}/>
                                <Text className="text-xl font-bold px-1" style={{color: Colors.Primary["800"]}}>
                                    {task.name}
                                </Text>
                            </View>
                        </View>

                        {/* aligned to the right */}
                        <View className="flex-row items-center">
                            <Link
                                href={`/(authenticated)/(tabs)/collections/collection/new_task?id=${task.id}&collectionId=${task.collection_id}` as Href}
                                key={`new-task-${task.id}`}
                                asChild
                            >
                                <TouchableOpacity className="px-1" onPress={() => console.log("edit")}>
                                    <Ionicons name="pencil" size={20} style={{color: Colors.Primary["800"]}}/>
                                </TouchableOpacity>
                            </Link>
                            <Link
                                href={`/(authenticated)/(tabs)/collections/collection/task/${task.id}` as Href}
                                key={`task-log-${task.id}`}
                                asChild
                            >
                                <TouchableOpacity className="px-1" onPress={() => console.log("edit")}>
                                    <Ionicons name="time-outline" size={20} style={{color: Colors.Primary["800"]}}/>
                                </TouchableOpacity>
                            </Link>
                        </View>

                    </View>

                    {/* separator line */}
                    <View
                        style={{
                            height: 1,
                            backgroundColor: Colors.Complementary["800"],
                        }}
                        className="my-2"
                    />

                    {/* under the separator line */}
                    <View className="flex-row px-1">

                        {/* aligned to the left */}
                        <View className="flex-col w-1/2">
                            <View className="flex-row items-center pb-1">
                                <Ionicons className="pr-2" name="calendar-outline" size={16}
                                          style={{color: Colors.Primary["800"]}}/>
                                <Text>{task.next_due_at ? `Due ${formatShortDate(task.next_due_at)}` : "No due date"}</Text>
                            </View>
                            <View className="flex-row items-center">
                                <Ionicons className="pr-2" name="person-circle-outline" size={16}
                                          style={{color: Colors.Primary["800"]}}/>
                                {task.users && task.users.first_name ? (
                                    <Text>Assigned to {task.users.first_name}</Text>
                                ) : (
                                    <Text>Not Assigned</Text>
                                )}
                            </View>
                        </View>

                        {/* aligned to the right*/}
                        <View className="flex-col w-1/2">
                            <View className="flex-row items-center">
                                <Ionicons className="pr-2" name="timer-outline" size={16}
                                          style={{color: Colors.Primary["800"]}}/>
                                <Text>{getBasicRecurrenceDescriptions(task.interval_value, task.interval_unit, task.day_of_week, task.date_of_month, task.month_of_year)}</Text>
                            </View>
                        </View>

                    </View>

                </View>
            </TouchableOpacity>
        </View>
    );
};

export default TaskListItem;