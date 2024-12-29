import React, {useCallback, useState} from 'react';
import {FlatList, RefreshControl, SafeAreaView, Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import CollectionCard from "@/components/CollectionCard.tsx";
import {Colors} from "@/constants/Colors.ts";
import {Link, router, useFocusEffect, useLocalSearchParams, Stack} from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useSupabase} from "@/context/SupabaseContext.tsx";
import {Collection} from "@/types/enums.ts";
import {useHeaderHeight} from "@react-navigation/elements";

const CollectionView = () => {

    const { id } = useLocalSearchParams<{ id: string; bg?: string }>();
    const [tasks, setTasks] = useState<[]>([]);
    // State to manage the refresh control
    const {getCollectionInfo} = useSupabase();
    const [collection, setCollection] = useState<Collection>();
    const [refreshing, setRefreshing] = useState(false);
    const headerHeight = useHeaderHeight();

    // Function to load collection's tasks from Supabase
    const loadTasks = async () => {
        const data = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        setTasks(data);
    };

    const loadCollectionInfo = async () => {
        if (!id) return;
        const data = await getCollectionInfo!(id);
        console.log(data);
        setCollection(data);
    }

    // Load boards when the screen gains focus
    useFocusEffect(
        useCallback(() => {
            loadCollectionInfo();
            loadTasks();
        }, [])
    );

    const TaskListItem = ({id}) => (
        <View className="py-1">
            <TouchableOpacity className="rounded-3xl w-full px-6 py-4" style={{backgroundColor: Colors.Complementary["50"], aspectRatio: 9/2}}>
                <View className="border-b border-b-gray-500 pb-2">
                    <Text className="text-xl font-bold px-1" style={{color: Colors.Primary["800"]}}>
                        Task
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    );

    // Custom header component
    const CustomHeader = () => (
        <View className="" style={{backgroundColor: Colors.Complementary["400"]}}>
            <View className="flex-row items-center justify-between bg-complementary-400 px-4 py-3">
                {/* Close button */}
                <TouchableOpacity className="pr-2" onPress={() => router.back()}>
                    <Ionicons name="close" size={24} color={Colors.Complementary["900"]} />
                </TouchableOpacity>

                {/* Collection name and user information */}
                <View style={{ flex: 1 }}>
                    <Text style={{ color: Colors.Complementary["900"], fontSize: 16 }}>{collection?.name}</Text>
                    <Text style={{ color: Colors.Complementary["900"], fontSize: 12 }}>Collection of {collection?.users.first_name}</Text>
                </View>

                {/* Icon buttons for filter, notifications, and settings */}
                <View style={{ flexDirection: 'row', gap: 16 }}>
                    <TouchableOpacity onPress={() => {}}>
                        <Ionicons name="filter-circle-outline" size={26} color={Colors.Complementary["900"]} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {}}>
                        <Ionicons name="notifications-outline" size={26} color={Colors.Complementary["900"]} />
                    </TouchableOpacity>
                    <Link href={`/(authenticated)/(tabs)/collections/collection/settings?id=${id}`} asChild>
                        <TouchableOpacity>
                            <Ionicons name="ellipsis-horizontal" size={26} color={Colors.Complementary["900"]} />
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
        </View>
    );


    return (
        <SafeAreaView>

            <Stack.Screen
                options={{
                    header: () => <CustomHeader />,
                    title: collection?.name,
                    headerTransparent: false,
                }}
            />

            <View className="w-full h-full" style={{backgroundColor: Colors.Complementary["300"]}}>

                <View className="flex-row w-full justify-between px-4 py-2">
                    <View className="flex-row">
                        <Ionicons name='filter' size={20} style={{color: Colors.primaryGray}}/>
                        <Text className="pl-3">Filter/Sort</Text>
                    </View>
                    <View className="flex-row">
                        <Text className="pr-2">Add Task</Text>
                        <Ionicons name='add' size={20} style={{color: Colors.primaryGray}}/>
                    </View>
                </View>

                <View className="flex-1 justify-center items-center pb-3 px-4">
                    <FlatList
                        data={tasks}
                        renderItem={TaskListItem}
                        // refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadBoards} />}
                        keyExtractor={(item) => `${item}`}
                    />

                </View>

            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingHorizontal: 14,
        height: 50,
    },
});

export default CollectionView;


