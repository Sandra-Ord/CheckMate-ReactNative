import React from 'react';
import { Text, View, Image } from 'react-native';
import {Tabs} from "expo-router";
import {FontAwesome, Ionicons} from "@expo/vector-icons";
import {Colors} from "@/constants/Colors.ts";

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
                             headerTitle: "Calendar",
                             headerTitleAlign: 'left',
                             headerStyle: {backgroundColor: Colors.Complementary["400"]},
                             tabBarIcon: ({size, color}) => (<FontAwesome name="calendar" size={size} color={color}/>)
                         }}
            />

            <Tabs.Screen name="todo"
                         options={{
                             title: 'To Do',
                             headerShown: true,
                             headerTitle: "To Do",
                             headerTitleAlign: 'left',
                             headerStyle: {backgroundColor: Colors.Complementary["400"]},
                             tabBarIcon: ({size, color}) => (<Ionicons name="list-outline" size={size} color={color} />)
                         }}
            />


            <Tabs.Screen name="collections"
                         options={{
                             headerShown: false,
                             tabBarIcon: ({size, color}) => (<Image style={{width: size, height: size}} source={require('@/assets/images/logo-icon-transparent.png')}/>)
                        }}
            />

            <Tabs.Screen name="notifications"
                         options={{
                             title: 'Notifcations',
                             headerShown: false,
                             tabBarIcon: ({size, color}) => (<Ionicons name="notifications-outline" size={size} color={color}/>)
                         }}
            />

            <Tabs.Screen name="account"
                         options={{
                             title: 'Account',
                             headerShown: true,
                             headerTitle: "Account",
                             headerTitleAlign: 'left',
                             headerStyle: {backgroundColor: Colors.Complementary["400"]},
                             tabBarIcon: ({size, color}) => (<FontAwesome name="user-circle" size={size} color={color}/>)
                         }}
            />
        </Tabs>
    );
};

export default Layout;