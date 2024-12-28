import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Stack, useRouter} from "expo-router";
import {Colors} from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";

const Layout = () => {
    const router = useRouter();
    return (
        <Stack>
            <Stack.Screen name="index"
                          options={{
                              title: "New Collection",
                              headerShown: true,
                              headerStyle: {
                                  backgroundColor: Colors.Complementary['100'],
                              },

                              /*                              headerLeft: () => (
                                                                <TouchableOpacity onPress={() => router.back()}>
                                                                    <Ionicons name="close" size="25" color={Colors.primaryGray}/>
                                                                </TouchableOpacity>
                                                            )*/
                          }}
            />
        </Stack>
    );
};

export default Layout;