import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Colors} from "@/constants/Colors";
import {Ionicons} from "@expo/vector-icons";

const NotificationListItem = () => {
    return (
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
};

export default NotificationListItem;