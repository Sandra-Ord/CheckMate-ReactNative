import React from 'react';
import {Image, Text, View} from 'react-native';
import {router, Stack, useRouter} from "expo-router";
import {Colors} from "@/constants/Colors.ts";
import Ionicons from "@expo/vector-icons/Ionicons";

const Layout = () => {
    const router = useRouter();

    return (
        <Stack>
            <Stack.Screen name="index"
                          options={{
                              headerShown: true,
                              headerStyle: {backgroundColor: Colors.Complementary["400"]},
                              headerTitle: "Notifications",
                              headerTitleAlign: 'left',
                              headerRight: () => (
                                  <Ionicons
                                      name='time-outline'
                                      size={24}
                                      onPress={() => router.navigate('/(authenticated)/(tabs)/notifications/activity')}
                                      style={{color: Colors.primaryGray}}
                                  />
                              )
                          }}
            />

            <Stack.Screen name="activity"
                          options={{
                              headerShown: true,
                              headerTitle: "Activity Feed",
                              headerTitleAlign: 'left',
                              headerStyle: {backgroundColor: Colors.Complementary["400"]},
                          }}
            />
        </Stack>
    );
};

export default Layout;