import React from 'react';
import {Href, Link} from "expo-router";
import {Image, Text, TouchableOpacity, useWindowDimensions, View} from 'react-native';
import Carousel from "react-native-reanimated-carousel";
import Ionicons from "@expo/vector-icons/Ionicons";
import {Colors} from "@/constants/Colors";
import {IntervalUnit, Task} from "@/types/enums";
import {getTaskState, isArchived, isCompleted, isInSeason} from "@/utils/taskUtils";
import {formatDate, formatShortDate, getBasicRecurrenceDescriptions} from "@/utils/textUtils";
import IconText from "@/components/uiComponents/IconText";
import SeparatorLine from "@/components/uiComponents/SeparatorLine";

const TaskCard = ({task, photoUrls, onTaskComplete}: {
    task: Task,
    photoUrls: string[],
    onTaskComplete: (task: Task) => void
}) => {

    const {state, icon, color} = getTaskState(task);
    const {width, height} = useWindowDimensions();

    return (
        <View className="py-1">
            <View className="rounded-3xl w-full px-4 py-4"
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

                    <SeparatorLine height={1} margin={8}/>

                    {/* under the separator line */}
                    <View className="flex-row px-1 gap-x-2">

                        {/* aligned to the left */}
                        <View className="flex-col w-1/2 gap-y-1">
                            <IconText icon="calendar-outline"
                                      text={task.next_due_at ? `Due ${formatShortDate(task.next_due_at)}` : "No due date"}/>
                            <IconText icon="person-circle-outline"
                                      text={task.users && task.users.first_name ? (
                                          `Assigned to ${task.users.first_name}`
                                      ) : (
                                          "Not Assigned"
                                      )}/>
                        </View>

                        {/* aligned to the right*/}
                        <View className="flex-col w-1/2 gap-y-1">
                            <IconText icon="repeat-outline"
                                      text={getBasicRecurrenceDescriptions(task.interval_value, task.interval_unit, task.day_of_week, task.date_of_month, task.month_of_year)}/>
                        </View>

                    </View>

                    <SeparatorLine height={1} margin={8}/>

                    <View className="px-1 gap-x-2 gap-y-4">

                        {task.description && (
                            <View className="gap-y-2">
                                <IconText icon="chatbubble-outline" text={task.description}/>
                            </View>
                        )}

                        {(task.recurring && task.interval_unit !== IntervalUnit.Years) && (
                            <View className="gap-y-2">
                                <Text className="text-lg font-semibold">Season Info:</Text>
                                <IconText icon="earth-outline"
                                          text={(task?.season_start === null && task?.season_end === null) ? "Season: Always" : `Season: ${formatDate(task.season_start)} - ${formatDate(task?.season_end)}`}/>
                                <IconText icon={!isInSeason(task) ? "moon-outline" : "sunny-outline"}
                                          text={!isInSeason(task) ? "Currently: Out of Season" : "Currently: In Season"}/>

                            </View>
                        )}

                        <View className="gap-y-2">

                            <Text className="text-lg font-semibold">Completion Info:</Text>
                            {(task.recurring) && (
                                <IconText icon="arrow-forward-circle-outline"
                                          text={task.skip_missed_due_dates ? "Skip missed due dates" : "Don't skip missed due dates"}/>
                            )}
                            <IconText icon="checkmark-circle-outline"
                                      text={task.last_completed_at ? `Last Completed: ${formatShortDate(task.last_completed_at)}` : "Not completed before"}/>
                            {(task.completion_window_days && task.completion_start) && (
                                <IconText icon="timer-outline"
                                          text={`Complete from ${formatDate(task.completion_start)}`}/>
                            )}
                            <IconText icon="alarm-outline"
                                      text={task.completion_window_days ? `Complete up to ${task.completion_window_days} ${task.completion_window_days === 1 ? "day" : "days"} before due date` : "Always available for completion"}/>

                        </View>

                        {!isArchived(task) && (
                            <IconText icon="archive-outline" text="Archived"/>
                        )}

                        <View className=" items-center">
                            <Carousel
                                data={photoUrls}
                                loop={false}
                                width={width * 0.9}
                                height={height * 0.6}
                                renderItem={({item}) => (
                                    <View className="items-center">

                                        <Image
                                            source={{uri: item}}
                                            style={{
                                                width: width * 0.9,
                                                height: height * 0.6,
                                                borderRadius: 20,
                                                alignSelf: 'center',
                                                resizeMode: 'cover'
                                            }}
                                        />
                                    </View>
                                )}
                                vertical={false}
                            />
                        </View>

                    </View>

                </View>
            </View>
        </View>
    );
};

export default TaskCard;