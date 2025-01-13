import React from 'react';
import { Text, View } from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import {Colors} from "@/constants/Colors";

interface IconTextProps {
    icon: string;
    text: string;
    color?: string;
}

const IconText: React.FC<IconTextProps> = ({ icon, text, color = Colors.Primary['900'] }) => {
    return (
        <View className="flex-row items-center gap-x-2">
            <Ionicons className="" name={icon} size={16}
                      style={{color: color}}/>
            <Text className="flex-1" style={{color: color}}>
                {text}
            </Text>
        </View>
    );
};

export default IconText;