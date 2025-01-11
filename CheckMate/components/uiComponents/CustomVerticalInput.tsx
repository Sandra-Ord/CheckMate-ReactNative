import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Colors} from "@/constants/Colors";

const CustomVerticalInput = ({
                                 labelText,
                                 placeholder,
                                 value,
                                 handlePress,
                                 inputBackgroundColor = Colors.Complementary["50"],
                                 textColor = Colors.Primary["800"],
                             }) => {
    return (
        <View className="">
            <Text className="text-sm my-1" style={{color: textColor}}>
                {labelText}
            </Text>
            <TouchableOpacity
                value={value}
                onPress={handlePress}
                className="rounded-lg p-2"
                style={{backgroundColor: inputBackgroundColor}}
            >
                <Text style={{color: textColor}}>{value || placeholder}</Text>
            </TouchableOpacity>
        </View>
    );
};

export default CustomVerticalInput;