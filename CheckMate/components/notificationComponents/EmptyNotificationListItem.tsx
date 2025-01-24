import React from 'react';
import {Alert, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import {useSupabase} from "@/context/SupabaseContext";
import {Colors} from "@/constants/Colors";
import {Notification} from "@/types/enums";
import {getNotificationLink, getNotificationText, timeSinceNotificationCreated} from "@/utils/textUtils";
import {checkTaskAccess} from "@/utils/taskUtils";

const EmptyNotificationListItem = () => {
    return (
        <View>
            <View className="py-1">
                <View className="w-full px-3 py-1 rounded-sm flex-row items-center "
                                  style={{
                                      backgroundColor: Colors.Complementary["200"],
                                      aspectRatio: 10 / 2
                                  }}
                >
                    <View className="pr-3">
                        <Ionicons
                            name="notifications-off"
                            size={24}
                            color={Colors.Complementary["600"]}
                        />
                    </View>

                    <View className="flex-1 flex-col">
                        {/* No notifications Text */}
                        <Text className="text-base text-primary-800 mb-1" style={{color: Colors.Primary["600"]}}>
                            Nothing to see here for now. Check back later!
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default EmptyNotificationListItem;