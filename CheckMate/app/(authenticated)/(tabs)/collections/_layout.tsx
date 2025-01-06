import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {Stack, useRouter} from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import {Colors} from "@/constants/Colors";
import * as DropDownMenu from "zeego/dropdown-menu";

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
                                   <View className="flex-row gap-x-2 items-center">
                                       <TouchableOpacity onPress={() => router.navigate('/(authenticated)/(tabs)/collections/invitations')}>
                                           <Ionicons
                                               name='mail-outline'
                                               size={22}
                                               style={{color: Colors.primaryGray}}
                                           />
                                       </TouchableOpacity>
                                       <TouchableOpacity onPress={() => router.navigate('/(authenticated)/(tabs)/collections/new-collection')}>
                                           <Ionicons
                                               name='add'
                                               size={22}
                                               style={{color: Colors.primaryGray}}
                                           />
                                       </TouchableOpacity>
                                   </View>
                               )
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

            <Stack.Screen name="invitations"
                          options={{
                              headerShown: true,
                              headerStyle: {backgroundColor: Colors.Complementary["400"]},
                              headerTitle: "Pending Invitations",
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