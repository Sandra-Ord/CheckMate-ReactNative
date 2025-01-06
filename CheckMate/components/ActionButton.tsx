import React from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

type ActionButtonProps = {
    onPress: () => void;
    iconName: string;
    text: string;
    textColor: string;
    buttonColor: string;
};

const ActionButton: React.FC<ActionButtonProps> = ({
                                                       onPress,
                                                       iconName,
                                                       text,
                                                       textColor,
                                                       buttonColor
                                                   }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="py-2 px-10 rounded-xl items-center flex-row gap-x-2"
            style={{ backgroundColor: buttonColor }}
        >
            <Ionicons name={iconName} size={20} style={{ color: textColor }} />
            <Text className="text" style={{ color: textColor }}>
                {text}
            </Text>
        </TouchableOpacity>
    );
};

export default ActionButton;

// Example use
//  <ActionButton
//     onPress={handlePress}
//     iconName="checkbox-outline"
//     text="Complete"
//     textColor={Colors.Complementary["100"]}
//     buttonColor={Colors.Complementary["600"]}
// />