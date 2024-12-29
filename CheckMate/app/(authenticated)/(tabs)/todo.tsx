import React from 'react';
import { Text, View } from 'react-native';
import {Colors} from "@/constants/Colors.ts";

const ToDoView = () => {
    return (
        <View className="w-full h-full" style={{backgroundColor: Colors.Complementary["300"]}}>
            <Text>
                to do
            </Text>
        </View>
    );
};

export default ToDoView;