import React from 'react';
import {View, Text, TextInput} from 'react-native';
import {Colors} from "@/constants/Colors";

const VerticalInputField = ({
                                labelText,
                                placeholder,
                                value,
                                onChangeText,
                                inputBackgroundColor = Colors.Complementary["50"],
                                textColor = Colors.Primary["800"],
                                keyboardType = "default",
                                multiline = false,
                                numberOfLines = 1,
                                editable = true
                            }) => {
    return (
        <View className="">
            <Text className="text-sm my-1" style={{color: textColor}}>
                {labelText}
            </Text>
            <TextInput
                value={value}
                placeholder={placeholder}
                onChangeText={onChangeText}
                className="rounded-lg p-2"
                style={{backgroundColor: inputBackgroundColor}}
                returnKeyType="done"
                enterKeyHint="done"
                keyboardType={keyboardType}
                multiline={multiline}
                numberOfLines={numberOfLines}
                editable={editable}
            />
        </View>
    );
};

export default VerticalInputField;