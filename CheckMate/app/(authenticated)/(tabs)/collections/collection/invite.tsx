import React, {useCallback, useState} from 'react';
import {Alert, FlatList, SafeAreaView, View} from 'react-native';
import {useLocalSearchParams, Stack, useFocusEffect} from 'expo-router';
import {useSupabase} from '@/context/SupabaseContext';
import UserListItem from '@/components/UserListItem';
import {Collection, User} from '@/types/enums';
import {Colors} from "@/constants/Colors";

const Invite = () => {

    const {id} = useLocalSearchParams<{ id?: string }>();

    const {getCollectionInfo, findUsers, addUserToCollection} = useSupabase();

    const [collection, setCollection] = useState<Collection>();
    const [search, setSearch] = useState<string>("");
    const [userList, setUserList] = useState<User[]>([]);

    // -----------------------------------------------------------------------------------------------------------------
    // -------------------------------------------- DATABASE OPERATIONS ------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------

    const confirmInviteUserToCollection = (user: User) => {
        Alert.alert(
            "Confirm Invite",
            `Do you want to invite ${user.first_name} (${user.email}) to the ${collection.name} collection?`,
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Invite",
                    style: "default",
                    onPress: async () => {
                        await onAddUser(user);
                    },
                }
            ]
        );
    };

    const onSearchUser = async () => {
        const data = await findUsers!(search);
        setUserList(data);
    };

    const onAddUser = async (user: User) => {
        console.log('adding user', user);
        await addUserToCollection!(id!, user.id);
    };

    // -----------------------------------------------------------------------------------------------------------------
    // -------------------------------------------- LOAD INFORMATION ---------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------

    const loadCollectionInfo = async () => {
        if (!id) return;
        const data = await getCollectionInfo!(id);
        setCollection(data);
    };

    useFocusEffect(
        useCallback(() => {
            loadCollectionInfo();
        }, [])
    );

    return (
        <SafeAreaView>
            <View className="flex w-full h-full py-5 px-5" style={{backgroundColor: Colors.Complementary["300"]}}>

                <Stack.Screen
                    options={{
                        headerSearchBarOptions: {
                            autoCapitalize: 'none',
                            autoFocus: true,
                            placeholder: 'Invite by name or email',
                            cancelButtonText: 'Done',
                            onChangeText: (e) => setSearch(e.nativeEvent.text),
                            onCancelButtonPress: onSearchUser,
                        },
                    }}
                />

                <FlatList
                    // Render the list of users
                    data={userList}
                    renderItem={(item) => (
                        <UserListItem onPress={confirmInviteUserToCollection} element={item}/>
                    )}
                    keyExtractor={(item) => `${item.id}`}
                    ItemSeparatorComponent={() => (
                        <View className="my-2" style={{height: 0.5, backgroundColor: Colors.Primary["600"]}}></View>
                    )}
                />

            </View>
        </SafeAreaView>
    );
};

export default Invite;