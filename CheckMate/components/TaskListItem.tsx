import React from 'react';
import {Href, Link} from "expo-router";
import {Text, TouchableOpacity, View} from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import {Colors} from "@/constants/Colors";
import {Task} from "@/types/enums";
import {formatShortDate, getBasicRecurrenceDescriptions} from "@/utils/textUtils";

const getTaskState = (task) => {
    const now = new Date();
    const inSeason = !task.season_start || !task.season_end ||
        (
            new Date(task.season_start).setFullYear(2000) <= now.setFullYear(2000) &&
            now.setFullYear(2000) <= new Date(task.season_end).setFullYear(2000)
        );
    const isArchived = task.archived_at;
    const isOverdue = task.next_due_at && new Date(task.next_due_at) < now;
    const isOpenForCompletion =
        (!task.next_due_at) ||
        (task.completion_start && task.next_due_at &&
            new Date(task.completion_start) <= now &&
            now <= new Date(task.next_due_at)) ||
        (!task.completion_start && !task.completion_window_days);

    if (isArchived) return {state: "Archived", icon: "archive-outline", color: Colors.Primary["400"]};
    if (!inSeason) return {state: "Out of Season", icon: "moon-outline", color: Colors.Primary["600"]};
    if (isOverdue) return {state: "Overdue", icon: "warning-outline", color: Colors.Red["600"]};
    if (isOpenForCompletion) return {state: "Open", icon: "timer-outline", color: Colors.Green["600"]};
    return {state: "Not Open", icon: "pause-circle-outline", color: Colors.Yellow["600"]};
};

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
                        style={{
                            position: "absolute",
                            top: -10,
                            right: 10,
                            backgroundColor: color,
                            paddingHorizontal: 10,
                            paddingVertical: 3,
                            borderRadius: 12,
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <Ionicons name={icon} size={14} color="white" style={{marginRight: 6}}/>
                        <Text style={{color: "white", fontSize: 12, fontWeight: "bold"}}>{state}</Text>
                    </View>

                    <View className="flex-col">

                        {/* on top of the separator line */}
                        <View className="flex-row justify-between">

                            {/*aligned to the left*/}
                            <View className="flex-row items-center flex-1">
                                <TouchableOpacity className="px-1" onPress={() => onTaskComplete(task)}>
                                    <Ionicons name="square-outline" size={20} style={{color: Colors.Primary["800"]}}/>
                                </TouchableOpacity>
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
                                    href={`/(authenticated)/(tabs)/collections/collection/task/log?id=${task.id}` as Href}
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
                                    <Ionicons className="" name="timer-outline" size={16}
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