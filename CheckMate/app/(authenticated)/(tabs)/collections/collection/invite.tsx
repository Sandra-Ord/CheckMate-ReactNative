import React, { useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { DefaultTheme } from '@react-navigation/native';
import { useSupabase } from '@/context/SupabaseContext';
import { User } from '@/types/enums';
import UserListItem from '@/components/UserListItem';

// If this doesn't work, enable the pg_trgm extension in Supabase extensions
const Invite = () => {
    // Retrieve the `id` parameter from the route
    const { id } = useLocalSearchParams<{ id?: string }>();

    // Access functions from Supabase context
    const { findUsers, addUserToBoard } = useSupabase();

    // State to keep track of the search input
    const [search, setSearch] = useState("");

    // State to store the list of found users
    const [userList, setUserList] = useState<User[]>([]);

    // Function to search for users based on the search input
    const onSearchUser = async () => {
        console.log("searching user", search);
        const data = await findUsers!(search);
        setUserList(data);
        console.log("found users", data);
    };

    // Function to add a user to the board
    const onAddUser = async (user: User) => {
        console.log('adding user', user);
        await addUserToBoard!(id!, user.id);
        router.dismiss(2);
    };

    return (
        <View style={{ flex: 1, padding: 8 }}>
            <Stack.Screen
                options={{
                    // Remove shadow from the header
                    headerShadowVisible: false,
                    // Set the background color for the header
                    headerStyle: {
                        backgroundColor: DefaultTheme.colors.background,
                    },
                    // Configure the search bar options in the header
                    headerSearchBarOptions: {
                        autoCapitalize: 'none', // Disable auto-capitalization
                        autoFocus: true, // Automatically focus the search bar
                        placeholder: 'Invite by name, username or email', // Placeholder text
                        cancelButtonText: 'Done', // Text for the cancel button
                        onChangeText: (e) => setSearch(e.nativeEvent.text), // Update state on text change
                        onCancelButtonPress: onSearchUser, // Trigger search on cancel button press
                    },
                }}
            />
            <FlatList
                style={{ marginTop: 100 }}
                // Render the list of users
                data={userList}
                renderItem={(item) => (
                    <UserListItem onPress={onAddUser} element={item} />
                )}
            />
        </View>
    );
};

export default Invite;
