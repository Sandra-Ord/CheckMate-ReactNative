import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import {Stack, useRouter} from "expo-router";
import {Colors} from "@/constants/Colors"

const Layout = () => {
    const router = useRouter();

    return (
        <Stack>
            <Stack.Screen name="index"
                          options={{
                              headerShown: true,
                              headerStyle: {backgroundColor: Colors.Complementary["400"]},
                              headerTitleStyle: {color: Colors.Complementary["900"]},
                              headerTitle: () => (
                                  <View className="flex-row items-center gap-x-2">
                                      <Ionicons name="checkbox-outline" size={24}
                                                style={{color: Colors.Complementary["900"]}}/>
                                      <Text className="font-semibold text-xl">To Do List</Text>
                                  </View>
                              ),
                              headerTitleAlign: 'left',
                              headerRight: () => (
                                  <View className="flex-row gap-4">
                                      <TouchableOpacity
                                          onPress={() => router.navigate('/(authenticated)/(tabs)/todo/tags')}>
                                          <Ionicons name='pricetag-outline' size={24}
                                                    style={{color: Colors.Complementary["900"]}}/>
                                      </TouchableOpacity>
                                      <TouchableOpacity
                                          onPress={() => router.navigate('/(authenticated)/(tabs)/todo/archive')}>
                                          <Ionicons name='archive' size={24}
                                                    style={{color: Colors.Complementary["900"]}}/>
                                      </TouchableOpacity>
                                  </View>
                              ),
                          }}
            />

            <Stack.Screen name="archive"
                          options={{
                              headerShown: true,
                              headerStyle: {backgroundColor: Colors.Complementary["400"]},
                              headerTitleStyle: {color: Colors.Complementary["900"]},
                              headerTitle: "Archived To Do List",
                              headerTitleAlign: 'center',
                              headerLeft: () => (
                                  <Ionicons
                                      name="arrow-back"
                                      size={24}
                                      color={Colors.Complementary["900"]}
                                      onPress={() => router.back()}
                                      className="pr-2"
                                  />
                              ),
                          }}
            />

            <Stack.Screen name="tags"
                          options={{
                              headerShown: true,
                              headerStyle: {backgroundColor: Colors.Complementary["400"]},
                              headerTitleStyle: {color: Colors.Complementary["900"]},
                              headerTitle: "Tags",
                              headerTitleAlign: 'center',
                              headerLeft: () => (
                                  <Ionicons
                                      name="arrow-back"
                                      size={24}
                                      color={Colors.Complementary["900"]}
                                      onPress={() => router.back()}
                                      className="pr-2"
                                  />
                              ),
                          }}
            />

        </Stack>
    );
};

export default Layout;