import React, {useCallback, useState} from 'react';
import {FlatList, View} from 'react-native';
import {useFocusEffect} from "expo-router";
import {Colors} from "@/constants/Colors";
import NotificationListItem from "@/components/NotificationListItem";

const NotificationsView = () => {

    const [refreshing, setRefreshing] = useState(false);
    const [notifications, setNotifications] = useState<[]>([]);

    // -----------------------------------------------------------------------------------------------------------------
    // -------------------------------------------- LOAD INFORMATION ---------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------

    const loadNotifications = async () => {
        const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
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
                    data={notifications}
                    renderItem={({item}) => <NotificationListItem/>}
                    // refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadBoards} />}
                    keyExtractor={(item) => `${item}`}
                />

            </View>
        </View>
    );
};

export default NotificationsView;