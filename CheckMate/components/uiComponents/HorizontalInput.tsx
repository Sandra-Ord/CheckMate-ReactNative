import React from 'react';
import {View, Text, TextInput} from 'react-native';
import {Colors} from "@/constants/Colors";

const HorizontalInputField = ({
                                  labelText,
                                  placeholder,
                                  value,
                                  onChangeText,
                                  inputBackgroundColor = Colors.Complementary["50"],
                                  textColor = Colors.Primary["800"],
                                  keyboardType = "default",
                                  multiline = false,
                                  numberOfLines = 1,
                                  editable = true,
                                  onEndEditing,
                              }) => {
    return (
        <View className="flex-row items-center gap-x-5">
            <Text className="text-sm my-1" style={{color: textColor}}>
                {labelText}
            </Text>
            <TextInput
                value={value}
                placeholder={placeholder}
                onChangeText={onChangeText}
                className="rounded-lg flex-1 p-2"
                style={{backgroundColor: inputBackgroundColor}}
                returnKeyType="done"
                enterKeyHint="done"
                keyboardType={keyboardType}
                multiline={multiline}
                numberOfLines={numberOfLines}
                editable={editable}
                onEndEditing={onEndEditing}
            />
        </View>
    );
};

export default HorizontalInputField;