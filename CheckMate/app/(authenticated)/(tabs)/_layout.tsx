import React from 'react';
import { Text, View, Image } from 'react-native';
import {Tabs} from "expo-router";
import {FontAwesome, Ionicons} from "@expo/vector-icons";

const Layout = () => {
    return (
        <Tabs>
            <Tabs.Screen name="calendar"
                         options={{title: 'Calendar',
                                   headerShown: true,
                                   tabBarIcon: ({size, color}) => (<FontAwesome name="calendar" size={size} color={color}/>)
                         }}
            />
{/*
            <Tabs.Screem name="todo"/>
*/}
            <Tabs.Screen name="collections"
                         options={{
                             headerShown: false,
                             tabBarIcon: ({size, color}) => (<Image style={{width: size, height: size}} source={require('@/assets/images/logo-icon-transparent.png')}/>)
                        }}
            />

            <Tabs.Screen name="notifications"
                         options={{
                             title: 'Notifcations',
                             headerShown: true,
                             tabBarIcon: ({size, color}) => (<Ionicons name="notifications-outline" size={size} color={color}/>)
                         }}
            />

            <Tabs.Screen name="account"
                         options={{
                             title: 'Account',
                             headerShown: true,
                             tabBarIcon: ({size, color}) => (<FontAwesome name="user-circle" size={size} color={color}/>)
                         }}
            />
        </Tabs>
    );
};

export default Layout;