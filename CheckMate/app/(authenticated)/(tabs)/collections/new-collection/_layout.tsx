import React from 'react';
import {Stack, useRouter} from "expo-router";
import {Colors} from "@/constants/Colors";

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