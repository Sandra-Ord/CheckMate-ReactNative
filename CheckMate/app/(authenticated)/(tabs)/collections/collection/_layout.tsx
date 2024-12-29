import React from 'react';
import { Text, View, Image } from 'react-native';
import {Stack, Tabs} from "expo-router";
import {Colors} from "@/constants/Colors.ts";
import DropdownPlus from "@/components/DropdownPlus.tsx";


const Layout = () => {
    return (
        <Stack>
            <Stack.Screen name="[id]"
                           options={{
                               headerShown: true,
                               headerStyle: {backgroundColor: Colors.Complementary["400"]},
                               headerTitle: "Collection",
                               headerTitleAlign: 'left',
                           }}
            />
            <Stack.Screen name="log"
                          options={{
                              headerShown: true
                          }}
            />
            <Stack.Screen name="Invite"
                          options={{
                              headerShown: true
                          }}
            />
            <Stack.Screen name="Settings"
                          options={{
                              headerStyle: {backgroundColor: Colors.Complementary["400"]},
                              headerShown: false
                          }}
            />

        </Stack>
    );
};

export default Layout;