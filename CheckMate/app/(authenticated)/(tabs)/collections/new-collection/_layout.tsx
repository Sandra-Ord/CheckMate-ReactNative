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
                              title: "Create a Collection",
                              headerShown: true,
                              headerStyle: {
                                  backgroundColor: Colors.Complementary['400'],
                              },
                          }}
            />
        </Stack>
    );
};

export default Layout;