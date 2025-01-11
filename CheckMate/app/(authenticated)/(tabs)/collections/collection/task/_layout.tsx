import React from 'react';
import Ionicons from "@expo/vector-icons/Ionicons";
import {Text, View} from 'react-native';
import {Stack, useRouter} from "expo-router";
import {Colors} from "@/constants/Colors";

const Layout = () => {
    const router = useRouter();

    return (
        <Stack>
            <Stack.Screen name="[id]"
                          options={{
                              headerTitle: "Task Log",
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

            <Stack.Screen name="log"
                          options={{
                              headerTitle: "Task Log",
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

            {/*<Stack.Screen name="statistics"*/}
            {/*              options={{*/}
            {/*                  headerShown: false*/}
            {/*              }}*/}
            {/*/>*/}
        </Stack>
    );
};

export default Layout;