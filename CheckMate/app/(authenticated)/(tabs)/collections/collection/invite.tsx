import React, {useState} from 'react';
import {FlatList, Text, View} from 'react-native';
import {useLocalSearchParams, Stack, router} from 'expo-router';
import {DefaultTheme} from '@react-navigation/native';
import {useSupabase} from '@/context/SupabaseContext';
import UserListItem from '@/components/UserListItem';
import {User} from '@/types/enums';

// If this doesn't work, enable the pg_trgm extension in Supabase extensions
const Invite = () => {

    const {id} = useLocalSearchParams<{ id?: string }>();

    const {findUsers, addUserToBoard} = useSupabase();

    const [search, setSearch] = useState("");
    const [userList, setUserList] = useState<User[]>([]);

    const onSearchUser = async () => {
        console.log("searching user", search);
        const data = await findUsers!(search);
        setUserList(data);
        console.log("found users", data);
    };

    const onAddUser = async (user: User) => {
        console.log('adding user', user);
        await addUserToBoard!(id!, user.id);
        router.dismiss(2);
    };

    return (
        <View style={{flex: 1, padding: 8}}>

            <Stack.Screen
                options={{
                    headerShadowVisible: false,
                    headerStyle: {
                        backgroundColor: DefaultTheme.colors.background,
                    },
                    headerSearchBarOptions: {
                        autoCapitalize: 'none',
                        autoFocus: true,
                        placeholder: 'Invite by name, username or email',
                        cancelButtonText: 'Done',
                        onChangeText: (e) => setSearch(e.nativeEvent.text),
                        onCancelButtonPress: onSearchUser,
                    },
                }}
            />

            <FlatList
                style={{marginTop: 100}}
                // Render the list of users
                data={userList}
                renderItem={(item) => (
                    <UserListItem onPress={onAddUser} element={item}/>
                )}
            />

        </View>
    );
};

export default Invite;
