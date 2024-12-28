import "../global.css";
import {Stack, useSegments, useRouter} from "expo-router";
import {ActionSheetProvider} from "@expo/react-native-action-sheet";
import React, {useEffect} from "react";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import * as SecureStorage from "expo-secure-store";
import {ClerkProvider, useAuth} from "@clerk/clerk-expo";
import {SupabaseProvider} from "@/context/SupabaseContext";

const EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string;

const tokenCache = {
    // Code source: https://clerk.com/docs/quickstarts/expo#configure-the-token-cache-with-expo
    async getToken(key: string) {
        try {
            const item = await SecureStorage.getItemAsync(key)
            if (item) {
                console.log(`${key} was used 🔐 \n`)
            } else {
                console.log('No values stored under key: ' + key)
            }
            return item
        } catch (error) {
            console.error('SecureStore get item error: ', error)
            await SecureStorage.deleteItemAsync(key)
            return null
        }
    },
    async saveToken(key: string, value: string) {
        try {
            return SecureStorage.setItemAsync(key, value)
        } catch (err) {
            return
        }
    },
}

const InitialLayout = () => {

    const router = useRouter();

    const {isLoaded, isSignedIn} = useAuth();

    const segments = useSegments();

    useEffect(() => {
        if (!isLoaded) return;

        console.log('segments: ', segments)
        const inAuthGroup = segments[0] === '(authenticated)';

        if (isSignedIn && !inAuthGroup) {
            router.replace('/(authenticated)/(tabs)/collections');
        } else if (!isSignedIn) {
            router.replace('/');
        }

    }, [isSignedIn]);

    return (
        <SupabaseProvider>
            <Stack>
                <Stack.Screen name="index" options={{headerShown: false}}/>
                <Stack.Screen name="(authenticated)" options={{headerShown: false}}/>
            </Stack>
        </SupabaseProvider>
    );
}

export default function RootLayout() {
    return (
        <ClerkProvider publishableKey={EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
            <ActionSheetProvider>
                <GestureHandlerRootView>
                    <InitialLayout/>
                </GestureHandlerRootView>
            </ActionSheetProvider>
        </ClerkProvider>
    )
}