import React from 'react';
import {Stack, useRouter} from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import {Colors} from "@/constants/Colors";

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
                                      name="arrow-back"
                                      size={24}
                                      color={Colors.Complementary["900"]}
                                      onPress={() => router.back()}
                                      className="pr-2"
                                  />
                              )
                          }}
            />

            <Stack.Screen name="invite"
                          options={{
                              headerTitle: "Invite to Collection",
                              headerShown: true,
                              headerStyle: {backgroundColor: Colors.Complementary["400"]},
                              headerTitleAlign: 'left',
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

            <Stack.Screen name="new_task"
                          options={{
                              headerTitle: "New Task",
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