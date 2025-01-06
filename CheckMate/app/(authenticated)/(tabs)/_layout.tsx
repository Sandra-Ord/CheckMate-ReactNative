import React from 'react';
import {Image, Text, View} from 'react-native';
import {Tabs} from "expo-router";
import {FontAwesome, Ionicons} from "@expo/vector-icons";
import {Colors} from "@/constants/Colors";

const Layout = () => {
    return (
        <Tabs
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: Colors.Complementary["500"],
                    borderTopWidth: 1,
                },
                tabBarActiveTintColor: Colors.Complementary["900"],
                tabBarInactiveTintColor: Colors.primaryGray,
            }}
        >

            <Tabs.Screen name="calendar"
                         options={{
                             title: 'Calendar',
                             headerShown: true,
                             headerTitle: () => (
                                 <View className="flex-row items-center gap-x-2">
                                     <Ionicons name="calendar-outline" size={24}
                                               style={{color: Colors.Complementary["900"]}}/>
                                     <Text className="font-semibold text-xl">Calendar</Text>
                                 </View>
                             ),
                             headerTitleAlign: 'left',
                             headerStyle: {backgroundColor: Colors.Complementary["400"]},
                             tabBarIcon: ({size, color}) => (<FontAwesome name="calendar" size={size} color={color}/>)
                         }}
            />

            <Tabs.Screen name="todo"
                         options={{
                             title: 'To Do',
                             headerShown: false,
                             headerTitle: "To Do",
                             headerTitleAlign: 'left',
                             headerStyle: {backgroundColor: Colors.Complementary["400"]},
                             tabBarIcon: ({size, color}) => (<Ionicons name="list-outline" size={size} color={color}/>)
                         }}
            />

            <Tabs.Screen name="collections"
                         options={{
                             title: 'Collections',
                             headerTitle: "Collections",
                             headerShown: false,
                             tabBarIcon: ({size, color}) => (
                                 <Image
                                     style={{width: size, height: size}}
                                     source={require('@/assets/images/logo-icon-transparent.png')}
                                 />
                             )
                         }}
            />

            <Tabs.Screen name="notifications"
                         options={{
                             title: 'Notifications',
                             headerShown: false,
                             tabBarIcon: ({size, color}) => (
                                 <Ionicons name="notifications-outline" size={size} color={color}/>)
                         }}
            />

            <Tabs.Screen name="account"
                         options={{
                             title: 'Account',
                             headerShown: true,
                             headerTitle: () => (
                                 <View className="flex-row items-center gap-x-2">
                                     <Ionicons name="person-circle-outline" size={24}
                                               style={{color: Colors.Complementary["900"]}}/>
                                     <Text className="font-semibold text-xl">Account</Text>
                                 </View>
                             ),
                             headerTitleAlign: 'left',
                             headerStyle: {backgroundColor: Colors.Complementary["400"]},
                             tabBarIcon: ({size, color}) => (
                                 <FontAwesome name="user-circle" size={size} color={color}/>)
                         }}
            />

        </Tabs>
    );
};

export default Layout;