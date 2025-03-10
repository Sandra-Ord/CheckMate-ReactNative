import React, {useCallback, useState} from 'react';
import {Text, View, TouchableOpacity, FlatList, Alert} from 'react-native';
import {Link, Stack, useFocusEffect, useLocalSearchParams, useRouter} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import {useSupabase} from "@/context/SupabaseContext";
import {Colors} from "@/constants/Colors";
import {Collection, User} from "@/types/enums";
import ActionButton from "@/components/uiComponents/ActionButton";
import VerticalInputField from "@/components/uiComponents/VerticalInput";
import UserListItem from "@/components/UserListItem";
import SeparatorLine from "@/components/uiComponents/SeparatorLine";

const Settings = () => {

    const router = useRouter();

    const {id} = useLocalSearchParams<{ id?: string }>();

    const [collection, setCollection] = useState<Collection>();
    const [members, setMembers] = useState<User[]>([]);

    const {
        getCollectionInfo,
        updateCollection,
        deleteCollection,
        getCollectionUsers,
        leaveCollection,
        removeFromCollection,
        userId
    } = useSupabase();

    // -----------------------------------------------------------------------------------------------------------------
    // -------------------------------------------- DATABASE OPERATIONS ------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------

    const confirmDeleteCollection = () => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete this collection? This action will delete all tasks and their logs inside the collection and cannot be undone. The collection will also be deleted for all members.",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        await onDeleteCollection();
                    },
                }
            ]
        );
    };

    const confirmLeaveCollection = () => {
        Alert.alert(
            "Confirm Leave Collection",
            "Are you sure you want to leave from this collection? You will not be able to access the contents of the collection anymore, until you are invited again.",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Leave",
                    style: "destructive",
                    onPress: async () => {
                        await onLeaveCollection();
                    },
                }
            ]
        );
    };

    const confirmRemoveUserFromCollection = (user: User) => {
        if (userId !== collection.owner_id) {
            Alert.alert("Permission Denied", "Only the owner can remove users from the collection.");
            return;
        }
        if (user.id === collection.owner_id) {
            Alert.alert("Forbidden Action", "The owner can't be removed from the collection.");
            return;
        }

        Alert.alert(
            "Confirm Removal",
            `Do you want to remove ${user.first_name} (${user.email}) from the ${collection.name} collection?`,
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Remove",
                    style: "destructive",
                    onPress: async () => {
                        await onRemoveUser(user);
                    },
                }
            ]
        );
    };

    const onRemoveUser = async (user: User) => {
        if (userId !== collection.owner_id || user.id === collection.owner_id) {
            return;
        }
        await removeFromCollection(collection.id, user.id);
        loadCollectionInfo();
    };

    const onLeaveCollection = async () => {
        if (!id) return;
        if (userId === collection.owner_id){
            console.warn("The owner can't leave their own collection.");
            return;
        }
        const data = await leaveCollection(id);
        router.dismissTo("/(authenticated)/(tabs)/collections");
    };

    const onUpdateCollection = async () => {
        const updated = await updateCollection!(collection!);
        setCollection(updated);
        router.dismissAll();
    };

    const onDeleteCollection = async () => {
        if (!id) return;
        if (userId !== collection.owner_id) return;
        await deleteCollection!(id);
        router.dismissTo("/(authenticated)/(tabs)/collections");
    };

    // -----------------------------------------------------------------------------------------------------------------
    // -------------------------------------------- LOAD INFORMATION ---------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------

    const loadCollectionInfo = async () => {
        if (!id) return;
        const data = await getCollectionInfo(id);
        setCollection(data);

        const members = await getCollectionUsers(id);
        setMembers(members);
    };

    useFocusEffect(
        useCallback(() => {
            loadCollectionInfo();
        }, [])
    );

    return (
        <View className="w-full h-full" style={{backgroundColor: Colors.Complementary["300"]}}>

            <Stack.Screen
                options={{
                    headerTitle: `${collection?.name} Settings`,
                }}
            />

            <View className="px-2 gap-y-8 py-4">

                <View className="px-2">
                    <VerticalInputField
                        labelText="Collection Name"
                        placeholder="Collection"
                        value={collection?.name}
                        onChangeText={(text) => setCollection({...collection!, name: text})}
                        onEndEditing={onUpdateCollection}
                    />
                </View>

                <SeparatorLine height={0.5} margin={4} color={Colors.Complementary["500"]}/>

                <View className="px-2">

                    <View className="flex-row items-center">
                        <Ionicons name={'people-outline'} size={20} color={Colors.Primary["900"]}/>
                        <Text className="pl-2 font-bold text-lg" style={{color: Colors.Primary["900"]}}>Members</Text>
                    </View>

                    {/* FlatList to display the members of the collection */}
                    <FlatList
                        data={members}
                        keyExtractor={(item) => `${item.id}`}
                        renderItem={(item) =>
                            <UserListItem
                                onPress={() => confirmRemoveUserFromCollection(item.item)}
                                element={item}
                            />
                        }
                        ItemSeparatorComponent={
                        <SeparatorLine height={0.5} margin={8} color={Colors.Complementary["400"]}/>
                        }
                        className="my-5"
                    />

                    {/* Link to invite a new member to the collection */}
                    <View className="items-center">
                        <Link href={`/(authenticated)/(tabs)/collections/collection/invite?id=${id}`} asChild>
                            <TouchableOpacity className="py-2 px-8 rounded-xl items-center flex-row gap-x-2"
                                              style={{backgroundColor: Colors.Complementary["600"]}}>
                                <Ionicons name={"person-add-outline"} size={20}
                                          style={{color: Colors.Complementary["100"]}}/>
                                <Text className="text" style={{color: Colors.Complementary["100"]}}>Invite...</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>

                </View>

                <SeparatorLine height={0.5} margin={4} color={Colors.Complementary["500"]}/>

                {/* Button to delete the collection (for owner) and leave collection (for member) */}
                <View className="items-center">

                    {collection === null ? (
                        <ActionButton
                            onPress={() => {
                            }}
                            iconName={"ellipsis-horizontal-circle-outline"}
                            text={"Loading..."}
                            textColor={Colors.Complementary["100"]}
                            buttonColor={Colors.Primary["600"]}
                        />
                    ) : (collection?.owner_id === userId) ? (
                        <ActionButton
                            onPress={confirmDeleteCollection}
                            iconName={"trash-bin-outline"}
                            text={"Delete Collection"}
                            textColor={Colors.Complementary["100"]}
                            buttonColor={Colors.Red["600"]}
                        />
                    ) : (
                        <ActionButton
                            onPress={confirmLeaveCollection}
                            iconName={"exit-outline"}
                            text={"Leave Collection"}
                            textColor={Colors.Complementary["100"]}
                            buttonColor={Colors.Blue["600"]}
                        />
                    )}
                </View>

            </View>

        </View>
    );
};

export default Settings;