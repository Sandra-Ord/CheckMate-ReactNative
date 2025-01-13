import React, {useCallback, useState} from 'react';
import {FlatList, RefreshControl, View} from 'react-native';
import {useFocusEffect} from "expo-router";
import {Colors} from "@/constants/Colors";
import NotificationListItem from "@/components/notificationComponents/NotificationListItem";
import {useSupabase} from "@/context/SupabaseContext";

const NotificationsView = () => {

    const [refreshing, setRefreshing] = useState(false);
    const [notifications, setNotifications] = useState<[]>([]);

    const {getUsersNotifications} = useSupabase();

    // -----------------------------------------------------------------------------------------------------------------
    // -------------------------------------------- LOAD INFORMATION ---------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------

    const loadNotifications = async () => {
        const data = await getUsersNotifications();
        setNotifications(data);
    };

    useFocusEffect(
        useCallback(() => {
            loadNotifications();
        }, [])
    );

    return (
        <View className="w-full h-full" style={{backgroundColor: Colors.Complementary["300"]}}>
            <View className="flex-1 justify-center items-center pb-3 px-4">
                <FlatList
                    className="pt-2"
                    data={notifications}
                    renderItem={({item}) => <NotificationListItem {...item}/>}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadNotifications}/>}
                    keyExtractor={(item) => `${item.id}`}
                />

            </View>
        </View>
    );
};

export default NotificationsView;