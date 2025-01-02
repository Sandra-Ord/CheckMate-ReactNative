import React from 'react';
import {Text, View, Image, TouchableOpacity} from 'react-native';
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
                               headerTitleStyle: {color: Colors.Complementary["900"]},
                               headerTitle: "To Do List",
                               headerTitleAlign: 'left',
                               headerRight: () => (
                                   <View className="flex-row gap-4">
                                       <TouchableOpacity onPress={() => router.navigate('/(authenticated)/(tabs)/todo/tags')}>
                                           <Ionicons name='pricetag-outline' size={24} style={{color: Colors.Complementary["900"]}}/>
                                       </TouchableOpacity>
                                       <TouchableOpacity onPress={() => router.navigate('/(authenticated)/(tabs)/todo/archive')}>
                                           <Ionicons name='archive' size={24} style={{color: Colors.Complementary["900"]}}/>
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