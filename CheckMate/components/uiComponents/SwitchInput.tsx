import React from 'react';
import {View, Text, Switch} from 'react-native';
import {Colors} from "@/constants/Colors";

const SwitchInput = ({
                         labelText,
                         value,
                         onValueChange,
                         textColor = Colors.Primary["800"]
                     }) => {
    return (
        <View className="flex-row justify-between items-center">
            <Text className="text-sm" style={{color: textColor}}>
                {labelText}
            </Text>
            <Switch value={value} onValueChange={onValueChange}/>
        </View>
    );
};

export default SwitchInput;