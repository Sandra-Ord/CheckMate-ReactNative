import React, {useCallback, useState} from 'react';
import {FlatList, RefreshControl, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {Link, useFocusEffect} from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useSupabase} from "@/context/SupabaseContext";
import {Colors} from "@/constants/Colors";
import NotificationListItem from "@/components/notificationComponents/NotificationListItem";

const NotificationsView = () => {

    const [refreshing, setRefreshing] = useState(false);
    const [notifications, setNotifications] = useState<[]>([]);

    const [allSelected, setAllSelected] = useState<boolean>(false);

    const {getUsersNotifications, readAllNotifications} = useSupabase();

    // -----------------------------------------------------------------------------------------------------------------
    // -------------------------------------------- LOAD INFORMATION ---------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------

    const loadNotifications = async () => {
        const data = await getUsersNotifications();
        setNotifications(data);
    };

    const toggleAllSelected = () => {
        setAllSelected(!allSelected);
    }

    const onReadAll = async () => {
        const data = await readAllNotifications();
        await loadNotifications();
    };

    useFocusEffect(
        useCallback(() => {
            loadNotifications();
        }, [])
    );

    return (
        <SafeAreaView className="flex-1">
            <View className="w-full h-full" style={{backgroundColor: Colors.Complementary["300"]}}>

                <View className="flex-row w-full items-center justify-between px-4 py-2">
                    <TouchableOpacity className="flex-row items-center" onPress={() => toggleAllSelected()}>
                        <Ionicons name={allSelected ? 'checkbox-outline' : 'square-outline'} size={20} style={{color: Colors.primaryGray}}/>
                        <Text className="pl-3">{allSelected ? 'Unselect All' : 'Select All Unread'}</Text>
                    </TouchableOpacity>

                    {allSelected ? (
                        <TouchableOpacity className="flex-row items-center" onPress={() => onReadAll()}>
                            <Text className="pr-2">Mark as Read</Text>
                            <Ionicons name='checkmark-done-outline' size={20} style={{color: Colors.primaryGray}}/>
                        </TouchableOpacity>
                    ) : (
                        <></>
                    )}
                </View>

                <View className="flex-1 justify-center items-center pb-3 px-5">
                    <FlatList
                        className="pt-1"
                        data={notifications}
                        renderItem={({item}) => <NotificationListItem notification={item} allSelected={allSelected}/>}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadNotifications}/>}
                        keyExtractor={(item) => `${item.id}`}
                    />
                </View>

            </View>
        </SafeAreaView>
    );
};

export default NotificationsView;