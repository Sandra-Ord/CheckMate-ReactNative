import React from 'react';
import {Alert, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import {useSupabase} from "@/context/SupabaseContext";
import {Colors} from "@/constants/Colors";
import {Notification} from "@/types/enums";
import {getNotificationLink, getNotificationText, timeSinceNotificationCreated} from "@/utils/textUtils";
import {checkTaskAccess} from "@/utils/taskUtils";

const NotificationListItem = ({notification, allSelected}) => {

    const router = useRouter();
    const {readNotification} = useSupabase();

    const handlePress = async () => {

        const hasAccess = checkTaskAccess(notification);
        await readNotification(notification.id);

        if (hasAccess) {
            router.navigate(getNotificationLink(notification));
        } else {
            Alert.alert("Permission Denied", "You no longer have access to view this.");
        }
    }

    const isUnread = notification.read_at === null;

    return (
        <View>
            <View className="py-1">
                <TouchableOpacity className="w-full px-3 py-1 rounded-sm flex-row items-center "
                                  style={{
                                      backgroundColor: (allSelected && isUnread) ? Colors.Complementary["200"] : Colors.Complementary["50"],
                                      aspectRatio: 10 / 2
                                  }}
                                  onPress={handlePress}
                >
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
                        <Text className={`text-base ${isUnread ? "font-bold" : ""} text-primary-800 mb-1`}>
                            {getNotificationText(notification)}
                        </Text>
                        {/* Notification Timestamp */}
                        <Text className="text-xs text-gray-600 text-right">
                            {timeSinceNotificationCreated(notification)}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default NotificationListItem;