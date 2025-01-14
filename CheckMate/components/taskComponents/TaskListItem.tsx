import React from 'react';
import {Href, Link} from "expo-router";
import {Text, TouchableOpacity, View} from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import {Colors} from "@/constants/Colors";
import {Task} from "@/types/enums";
import {formatShortDate, getBasicRecurrenceDescriptions} from "@/utils/textUtils";
import {getTaskState, isCompleted} from "@/utils/taskUtils";

const TaskListItem = ({task, onTaskComplete}: { task: Task, onTaskComplete: (task: Task) => void }) => {

    const {state, icon, color} = getTaskState(task);

    return (
        <View className="py-1">
            <Link
                href={`/(authenticated)/(tabs)/collections/collection/task/${task.id}` as Href}
                key={`new-task-${task.id}`}
                asChild
            >
                <TouchableOpacity className="rounded-3xl w-full px-4 py-4"
                                  style={{backgroundColor: Colors.Complementary["50"]}}
                >
                    {/*task state badge*/}
                    <View
                        className="gap-x-2 flex-row items-center absolute px-2.5 py-0.5 rounded-xl"
                        style={{
                            top: -10,
                            right: 10,
                            backgroundColor: color,
                        }}
                    >
                        <Ionicons name={icon} size={14} className="" color="white"/>
                        <Text className="font-bold" style={{color: "white", fontSize: 12}}>{state}</Text>
                    </View>

                    <View className="flex-col">

                        {/* on top of the separator line */}
                        <View className="flex-row justify-between">

                            {/*aligned to the left*/}
                            <View className="flex-row items-center flex-1">

                                {isCompleted(task) ? (
                                    <View className="px-1">
                                        <Ionicons name="checkbox-outline" size={20} style={{color: Colors.Primary["800"]}}/>
                                    </View>
                                ) : (
                                    <TouchableOpacity className="px-1" onPress={() => onTaskComplete(task)}>
                                        <Ionicons name="square-outline" size={20} style={{color: Colors.Primary["800"]}}/>
                                    </TouchableOpacity>
                                )}

                                <Ionicons name="notifications-outline" size={18}
                                          style={{color: Colors.Primary["800"]}}/>
                                <View className="pl-1 flex-shrink flex-1 ">

                                    <Text className="text-xl font-bold px-1 flex-wrap"
                                          style={{color: Colors.Primary["800"]}}>
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
                                    <TouchableOpacity className="px-1">
                                        <Ionicons name="pencil" size={20} style={{color: Colors.Primary["800"]}}/>
                                    </TouchableOpacity>
                                </Link>
                                <Link
                                    href={`/(authenticated)/(tabs)/collections/collection/task/log?id=${task.id}&collectionId=${task.collection_id}` as Href}
                                    key={`task-log-${task.id}`}
                                    asChild
                                >
                                    <TouchableOpacity className="px-1">
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
                        <View className="flex-row px-1 gap-x-2">

                            {/* aligned to the left */}
                            <View className="flex-col w-1/2 gap-y-1">
                                <View className="flex-row items-center gap-x-2 ">
                                    <Ionicons className="" name="calendar-outline" size={16}
                                              style={{color: Colors.Primary["800"]}}/>
                                    <Text
                                        className="flex-1">{task.next_due_at ? `Due ${formatShortDate(task.next_due_at)}` : "No due date"}</Text>
                                </View>
                                <View className="flex-row items-center gap-x-2">
                                    <Ionicons className="" name="person-circle-outline" size={16}
                                              style={{color: Colors.Primary["800"]}}/>
                                    {task.users && task.users.first_name ? (
                                        <Text className="flex-1">Assigned to {task.users.first_name}</Text>
                                    ) : (
                                        <Text className="flex-1">Not Assigned</Text>
                                    )}
                                </View>
                            </View>

                            {/* aligned to the right*/}
                            <View className="flex-col w-1/2 gap-y-1">
                                <View className="flex-row items-center gap-x-2">
                                    <Ionicons className="" name="repeat-outline" size={16}
                                              style={{color: Colors.Primary["800"]}}/>
                                    <Text
                                        className="flex-1">{getBasicRecurrenceDescriptions(task.interval_value, task.interval_unit, task.day_of_week, task.date_of_month, task.month_of_year)}</Text>
                                </View>
                            </View>

                        </View>

                    </View>
                </TouchableOpacity>
            </Link>
        </View>
    );
};

export default TaskListItem;