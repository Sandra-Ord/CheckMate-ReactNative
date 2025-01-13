import React from 'react';
import { Text, View } from 'react-native';
import {Colors} from "@/constants/Colors";

interface SeparatorProps {
    height: number;
    margin: string;
    color?: string;
}

const Separator: React.FC<SeparatorProps> = ({ height, margin = 8, color = Colors.Primary['800'] }) => {
    return (
        <View
            style={{
                height: height,
                marginVertical: margin,
                backgroundColor: color,
            }}
        />
    );
};

export default Separator;