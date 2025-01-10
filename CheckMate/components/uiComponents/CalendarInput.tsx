import React from 'react';
import {FlatList, Modal, Text, TouchableOpacity, View} from 'react-native';
import {Colors} from "@/constants/Colors";
import {Calendar} from 'react-native-calendars';
import ActionButton from "@/components/uiComponents/ActionButton.tsx";


const CalendarInput = ({
                           labelText,
                           isVisible,
                           close,
                           value,
                           handleSelect,
                           backgroundColor = Colors.Complementary["50"],
                           textColor = Colors.Primary["800"]
                       }) => {

    const handlePress = (day) => {
        console.log(day)
        const date = new Date(Date.UTC(day.year, day.month - 1, day.day));
        console.log(date);
        handleSelect(date);
    }
    const handleCancel = () => {
        handleSelect(null);
    }
    return (
        <Modal
            visible={isVisible}
            transparent
            animationType="fade"
            onRequestClose={close}
        >
            <TouchableOpacity
                className="justify-center items-center flex-1"
                style={{backgroundColor: "rgba(0, 0, 0, 0.3)"}}
                onPress={close}
            >
                <View className="rounded-lg p-4 w-4/5"
                      style={{backgroundColor: backgroundColor}}>
                    <View className="w-full justify-center" style={{backgroundColor: backgroundColor}}>
                        <Text className="text-lg font-bold" style={{color: textColor}}>
                            {labelText}
                        </Text>
                        <Calendar
                            onDayPress={handlePress}
                        />

                        <View className="items-center">
                            <ActionButton onPress={handleCancel} iconName={"close-circle-outline"} text={"Unselect"} textColor={Colors.Primary["800"]} buttonColor={Colors.Yellow["600"]}/>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

export default CalendarInput;