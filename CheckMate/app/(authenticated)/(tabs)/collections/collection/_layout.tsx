import React from 'react';
import { Text, View, Image } from 'react-native';
import {Stack, Tabs} from "expo-router";
import {Colors} from "@/constants/Colors";
import DropdownPlus from "@/components/DropdownPlus";


const Layout = () => {
    return (
        <Stack>
            <Stack.Screen name="index"
                           options={{
                               headerShown: true,
                               headerStyle: {backgroundColor: Colors.Complementary["400"]},
                               headerTitle: () => (
                                   <Image
                                       className="w-8 h-8"
                                       style={{resizeMode: 'contains' }}
                                       source={require('@/assets/images/logo-icon-transparent.png')}
                                   />
                               ),
                               headerTitleAlign: 'center',
                           }}
            />
            <Stack.Screen name="log"
                          options={{
                              headerShown: false
                          }}
            />
        </Stack>
    );
};

export default Layout;