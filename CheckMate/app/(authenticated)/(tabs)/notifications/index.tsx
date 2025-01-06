import React, {useCallback, useState} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import {useFocusEffect} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import {Colors} from "@/constants/Colors";

const NotificationsView = () => {

    const [refreshing, setRefreshing] = useState(false);
    const [notifications, setNotifications] = useState<[]>([]);

    const loadNotifications = async () => {
        const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        setNotifications(data);
    };

    useFocusEffect(
        useCallback(() => {
            loadNotifications();
        }, [])
    );

    const NotificationListItem = ({id}) => (
        <View>
            <View className="py-1">
                <TouchableOpacity className="w-full px-3 py-1 rounded-sm flex-row items-center "
                                  style={{backgroundColor: Colors.Complementary["50"], aspectRatio: 10 / 2}}>
                    {/* First Column: Icon */}
                    <View className="pr-3">
                        <Ionicons
                            name="notifications" // Placeholder icon
                            size={24}
                            color={Colors.Complementary["900"]}
                        />
                    </View>

                    {/* Second Column: Text and Timestamp */}
                    <View className="flex-1 flex-col">
                        {/* Notification Text */}
                        <Text className="text-base text-primary-800 mb-1">
                            This is a placeholder notification.
                        </Text>
                        {/* Notification Timestamp */}
                        <Text className="text-xs text-gray-600 text-right">
                            5m ago
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View className="w-full h-full" style={{backgroundColor: Colors.Complementary["300"]}}>
            <View className="flex-1 justify-center items-center pb-3 px-4">
                <FlatList
                    data={notifications}
                    renderItem={NotificationListItem}
                    // refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadBoards} />}
                    keyExtractor={(item) => `${item}`}
                />

            </View>
        </View>
    );
};

export default NotificationsView;