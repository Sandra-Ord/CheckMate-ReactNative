import React from 'react';
import {View} from 'react-native';
import {Colors} from "@/constants/Colors";
import {Calendar} from 'react-native-calendars';

const CalendarView = () => {

    const handlePress = (day) => {
        const date = new Date(Date.UTC(day.year, day.month - 1, day.day));
        console.log(date);
    }
    return (
        <View className="w-full h-full  justify-center" style={{backgroundColor: Colors.Complementary["300"]}}>
            <Calendar
                onDayPress={handlePress}

            />
        </View>
    );
};

export default CalendarView;