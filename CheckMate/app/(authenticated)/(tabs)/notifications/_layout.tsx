import React from 'react';
import {Stack, useRouter} from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import {Colors} from "@/constants/Colors";

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
                              headerStyle: {backgroundColor: Colors.Complementary["400"]},
                              headerLeft: () => (
                                  <Ionicons
                                      name="arrow-back"
                                      size={24}
                                      color={Colors.Complementary["900"]}
                                      onPress={() => router.back()}
                                      className="pr-2"
                                  />
                              )
                          }}
            />
        </Stack>
    );
};

export default Layout;