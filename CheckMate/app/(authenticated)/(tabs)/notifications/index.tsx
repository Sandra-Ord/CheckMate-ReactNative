import React from 'react';
import { Text, View } from 'react-native';
import {Colors} from "@/constants/Colors.ts";

const NotificationsView = () => {
    return (
        <View className="w-full h-full" style={{backgroundColor: Colors.Complementary["300"]}}>
            <Text>
                Notifications inside notifications
            </Text>
        </View>
    );
};

export default NotificationsView;