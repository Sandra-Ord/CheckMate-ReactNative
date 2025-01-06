import React from 'react';
import {View} from 'react-native';
import {Colors} from "@/constants/Colors";
import {Calendar} from 'react-native-calendars';


const CalendarView = () => {
    return (
        <View className="w-full h-full  justify-center" style={{backgroundColor: Colors.Complementary["300"]}}>
            <Calendar
                onDayPress={day => {
                    console.log('selected day', day);
                }}
            />

        </View>
    );
};

export default CalendarView;