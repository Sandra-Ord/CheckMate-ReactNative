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
                               //headerRight: () => (<DropdownPlus/>)
                           }}
            />
            <Stack.Screen name="new-collection"
                          options={{
                              headerShown: false,
                              presentation: 'modal',
                          }}
            />
        </Stack>
    );
};

export default Layout;