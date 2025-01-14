import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, SafeAreaView, RefreshControl} from 'react-native';
import {useLocalSearchParams} from "expo-router";
import {Colors} from "@/constants/Colors";
import SeparatorLine from "@/components/uiComponents/SeparatorLine";
import {useSupabase} from "@/context/SupabaseContext";
import {CollectionInvitationStatus} from "@/types/enums";
import UserGraph from "@/components/taskComponents/UserGraph";

const TaskStatisticsView = () => {

    const {collectionId} = useLocalSearchParams<{ collectionId?: string }>()
    const {id} = useLocalSearchParams<{ id?: string }>();
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const [stats, setStats] = useState([]);
    const [maxTasks, setMaxTasks] = useState();
    const [totalTasksCompleted, setTotalTasksCompleted] = useState();

    const {getRelevantCollectionUsers, getTaskCompletionStats} = useSupabase();

    const loadStats = async () => {
        if (!collectionId || !id) return;

        const collectionUsers = await getRelevantCollectionUsers(collectionId);
        if (!collectionUsers || collectionUsers.length === 0) {
            return [];
        }

        const taskCompletionStats = await getTaskCompletionStats(id);
        if (!taskCompletionStats) {
            return [];
        }

        const statistics = collectionUsers.map((user) => {
            const userId = user.user_id;
            const userStats = taskCompletionStats[userId] || {onTime: 0, overdue: 0, total: 0};
            return {
                user: user.users.first_name,
                avatar_url: user.users.avatar_url,
                completedOnTime: userStats.onTime,
                overdue: userStats.overdue,
                total: userStats.total,
                status: user.status,
            };
        }).filter(user => user.status === CollectionInvitationStatus.Accepted || (user.status === CollectionInvitationStatus.Cancelled && user.total > 0))
            .sort((a, b) =>
                a.status !== b.status
                    ? a.status === CollectionInvitationStatus.Accepted ? -1 : 1
                    : b.total - a.total || b.completedOnTime - a.completedOnTime
            );

        setStats(statistics);

        setTotalTasksCompleted(
            statistics.reduce(
                (total, user) => total + user.total,
                0
            )
        );

        setMaxTasks(
            Math.max(...statistics.map((user) => user.total))
        );

        return statistics
    };

    useEffect(() => {
        const fetchStatistics = async () => {
            if (!collectionId || !id) return;

            await loadStats(Number(collectionId), Number(id));
        };
        fetchStatistics();
    }, [collectionId, id]);


    return (
        <SafeAreaView className="flex-1">

            <ScrollView className="p-4 bg-white"
                        style={{backgroundColor: Colors.Complementary["300"]}}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadStats}/>}
            >
                <View className="py-1">
                    <View className="rounded-3xl w-full px-4 py-4"
                          style={{backgroundColor: Colors.Complementary["50"]}}
                    >

                        <View className="gap-y-4">
                            <Text className="text-xl font-bold text-center"
                                  style={{color: Colors.Primary["800"]}}>
                                Task Statistics
                            </Text>
                            <Text className="text-base text-center"
                                  style={{color: Colors.Primary["600"]}}>
                                Total Tasks Completions: {totalTasksCompleted}
                            </Text>
                        </View>

                        <SeparatorLine height={1} margin={8}/>

                        <View className="gap-y-6">
                            {/* Bars for each user */}
                            {stats.map((user, index) => (
                                <UserGraph key={index} user={user} index={index} maxTasks={maxTasks}/>
                            ))}
                        </View>

                        <SeparatorLine height={1} margin={20} color={Colors.Primary["600"]}/>

                        {/* Legend */}
                        <View className="gap-y-2">

                            <Text className="text-base font-semibold"
                                  style={{color: Colors.Primary["800"]}}>
                                Legend:
                            </Text>

                            <View className="gap-y-1">
                                <View className="flex-row items-center gap-x-2 mb-2">
                                    <View className="h-4 w-4"
                                          style={{backgroundColor: Colors.Blue["600"]}}/>
                                    <Text style={{color: Colors.Primary["800"]}}>Total</Text>
                                </View>
                                <View className="flex-row items-center gap-x-2 mb-2">
                                    <View className="h-4 w-4"
                                          style={{backgroundColor: Colors.Green["600"]}}/>
                                    <Text style={{color: Colors.Primary["800"]}}>On Time</Text>
                                </View>
                                <View className="flex-row items-center gap-x-2">
                                    <View className="h-4 w-4"
                                          style={{backgroundColor: Colors.Red["600"]}}/>
                                    <Text style={{color: Colors.Primary["800"]}}>Overdue</Text>
                                </View>
                            </View>

                        </View>

                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default TaskStatisticsView;