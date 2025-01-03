import React from 'react';
import {Stack, useRouter} from "expo-router";
import {Colors} from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";

const Layout = () => {
    const router = useRouter();

    return (
        <Stack>
            <Stack.Screen name="[id]"
                           options={{
                               headerTitle: "Collection",
                               headerShown: true,
                               headerStyle: {backgroundColor: Colors.Complementary["400"]},
                               headerTitleAlign: 'left',
                               headerLeft: () => (
                                   <Ionicons
                                       name="close"
                                       size={24}
                                       color={Colors.Complementary["900"]}
                                       onPress={() => router.back()}
                                       className="pr-2"
                                   />
                               )
                           }}
            />
            <Stack.Screen name="log"
                          options={{
                              headerShown: true
                          }}
            />
            <Stack.Screen name="invite"
                          options={{
                              headerShown: true
                          }}
            />
            <Stack.Screen name="settings"
                          options={{
                              headerTitle: "Collection Settings",
                              headerShown: true,
                              headerStyle: {backgroundColor: Colors.Complementary["400"]},
                              headerTitleAlign: 'left',
                              headerLeft: () => (
                                  <Ionicons
                                      name="close"
                                      size={24}
                                      color={Colors.Complementary["900"]}
                                      onPress={() => router.back()}
                                      className="pr-2"
                                  />
                              )
                          }}
            />

            <Stack.Screen name="task"
                          options={{
                              headerShown: false
                          }}
            />

        </Stack>
    );
};

export default Layout;