import React from 'react';
import { Text, View, Image } from 'react-native';
import {Stack, Tabs, useRouter} from "expo-router";
import {Colors} from "@/constants/Colors";
import DropdownPlus from "@/components/DropdownPlus";
import Ionicons from "@expo/vector-icons/Ionicons";


const Layout = () => {
    const router = useRouter();

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
                               headerRight: () => (
                                   <Ionicons
                                       name='add'
                                       size={24}
                                       onPress={() => router.navigate('/(authenticated)/(tabs)/collections/new-collection')}
                                       style={{color: Colors.primaryGray}}
                                   />
                               )
                               //headerRight: () => (<DropdownPlus/>)
                           }}
            />

            <Stack.Screen name="collection"
                          options={{
                              headerShown: false
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