import React, {useCallback, useState} from 'react';
import {Text, TouchableOpacity, useWindowDimensions, View} from 'react-native';
import {Href, Link, useFocusEffect} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import {useHeaderHeight} from "@react-navigation/elements";
import {useSupabase} from "@/context/SupabaseContext";
import {Collection} from "@/types/enums";
import {Colors} from "@/constants/Colors";

const CollectionCard = (collection: Collection) => {

    const [members, setMembers] = useState();
    const [tasks, setTasks] = useState();
    const [pendingTasks, setPendingTasks] = useState();

    const {userId, getAcceptedUsersCount, getActiveTasksCount, getPendingTaskCount} = useSupabase();

    const {width, height} = useWindowDimensions();
    const headerHeight = useHeaderHeight();

    // -----------------------------------------------------------------------------------------------------------------
    // -------------------------------------------- LOAD INFORMATION ---------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------

    const loadMemberCount = async () => {
        const data = await getAcceptedUsersCount!(collection.id);
        setMembers(data);
    };
    const loadTaskCount = async () => {
        const data = await getActiveTasksCount!(collection.id);
        setTasks(data);
    };
    const loadPendingTaskCount = async () => {
        const data = await getPendingTaskCount!(collection.id);
        setPendingTasks(data);
    };

    useFocusEffect(
        useCallback(() => {
            loadMemberCount();
            loadTaskCount();
            loadPendingTaskCount();
        }, [])
    );

    return (
        <View className="px-2 items-center">
            <Link
                href={`/(authenticated)/(tabs)/collections/collection/${collection.id}` as Href}
                key={`1}`}
                asChild
            >
                <TouchableOpacity
                    className="rounded-3xl w-full px-6 py-4"
                    style={{
                        backgroundColor: Colors.Complementary["50"],
                        width: width * 0.9,
                        height: (height - headerHeight) * 0.75
                    }}
                >
                    <View className="border-b border-b-gray-500 pb-2">
                        <Text className="text-xl font-bold px-1" style={{color: Colors.Primary["800"]}}>
                            {collection.name}
                        </Text>
                    </View>
                    <View className="mx-2 py-4 gap-y-5">
                        <View className="flex-row items-center gap-x-4">
                            <Ionicons name="people-circle-outline" size={24} color={Colors.Primary["800"]}/>
                            <Text>{members} Members</Text>
                        </View>
                        <View className="flex-row items-center gap-x-4">
                            <Ionicons name="shield-checkmark-outline" size={24} color={Colors.Primary["800"]}/>
                            <Text>
                                {collection.owner_id === userId
                                    ? "You are the owner"
                                    : `${collection.users.first_name.endsWith('s')
                                        ? `${collection.users.first_name}' collection`
                                        : `${collection.users.first_name}'s collection`}`}
                            </Text>
                        </View>
                        <View className="flex-row items-center gap-x-4">
                            <Ionicons name="checkbox-outline" size={24} color={Colors.Primary["800"]}/>
                            <Text>
                                {pendingTasks} Pending Tasks
                            </Text>
                        </View>
                        <View className="flex-row items-center gap-x-4">
                            <Ionicons name="list" size={24} color={Colors.Primary["800"]}/>
                            <Text>
                                {tasks} Active Tasks
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </Link>
        </View>
    );
};

export default CollectionCard;