import React from 'react';
import { Text, View } from 'react-native';
import {Colors} from "@/constants/Colors";
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';


const CalendarView = () => {
    return (
        <View className="w-full h-full  justify-center" style={{backgroundColor: Colors.Complementary["300"]}}>
            <Calendar
                onDayPress={day => {
                    console.log('selected day', day);
                }}
            />

            {/* CalendarList configured for a week view */}
            <CalendarList
                onDayPress={(day) => {
                    console.log("selected day", day);
                }}
                pastScrollRange={1} // Limit past scrolling range
                futureScrollRange={1} // Limit future scrolling range
                horizontal={true} // Enable horizontal scrolling
                pagingEnabled={true} // Snap to week
                calendarWidth={400} // Adjust for better week view display
            />
        </View>
    );
};

export default CalendarView;