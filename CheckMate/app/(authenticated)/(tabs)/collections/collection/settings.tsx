import React, {useEffect, useState} from 'react';
import {Text, View, TextInput, TouchableOpacity, FlatList} from 'react-native';
import {Link, Stack, useLocalSearchParams, useRouter} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import {useSupabase} from "@/context/SupabaseContext";
import UserListItem from "@/components/UserListItem";
import {Colors} from "@/constants/Colors";
import {Collection, User} from "@/types/enums";
import ActionButton from "@/components/uiComponents/ActionButton.tsx";

const Settings = () => {
    const router = useRouter();

    const {id} = useLocalSearchParams<{ id?: string }>();

    const [collection, setCollection] = useState<Collection>();
    const [members, setMembers] = useState<User[]>([]);

    const {getCollectionInfo, updateCollection, deleteCollection, getCollectionMembers} = useSupabase();


    useEffect(() => {
        if (!id) return;
        loadCollectionInfo();
    }, []);

    const loadCollectionInfo = async () => {
        if (!id) return;
        const data = await getCollectionInfo!(id);
        setCollection(data);

        const members = await getCollectionMembers!(id);
        setMembers(members);
    };

    const onUpdateCollection = async () => {
        const updated = await updateCollection!(collection!);
        setCollection(updated);
        router.dismissAll(); // Dismisses all modals or screens after updating
    };

    const onDeleteCollection = async () => {
        if (!id) return;
        await deleteCollection!(id);
        router.dismissAll(); // Dismisses all modals or screens after deletion
    };

    return (
        <View className="w-full h-full" style={{backgroundColor: Colors.Complementary["300"]}}>

            <Stack.Screen
                options={{
                    headerTitle: `${collection?.name} Settings`,
                }}
            />

            <View className="px-4 pb-8 pt-2">
                <Text className="text-sm my-2" style={{color: Colors.Primary["800"]}}>Collection Name</Text>

                {/* Input for updating the collection name */}
                <TextInput
                    value={collection?.name}
                    onChangeText={(text) => setCollection({...collection!, name: text})}
                    className="rounded-md p-2"
                    style={{backgroundColor: Colors.Complementary["50"]}}
                    returnKeyType="done"
                    enterKeyHint="done"
                    onEndEditing={onUpdateCollection}
                />
            </View>

            <View className="px-4 pt-4 pb-32 border-b" style={{borderColor: Colors.Complementary["500"]}}>

                <View className="flex-row items-center">
                    <Ionicons name={'person-outline'} size={18} color={Colors.Primary["900"]}/>
                    <Text className="pl-2 font-bold text-lg" style={{color: Colors.Primary["900"]}}>Members</Text>
                </View>

                {/* FlatList to display the members of the collection */}
                <FlatList
                    data={members}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={(item) => <UserListItem onPress={() => {
                    }} element={item}/>}
                    contentContainerStyle={{gap: 8}}
                    style={{marginVertical: 12}}
                />

                {/* Link to invite a new member to the collection */}
                <Link href={`/(authenticated)/(tabs)/collections/collection/invite?id=${id}`} asChild>
                    <TouchableOpacity className="py-2 mx-20 rounded-2xl items-center"
                                      style={{backgroundColor: Colors.Complementary["600"]}}>
                        <Text className="text-lg" style={{color: Colors.fontLight}}>Invite...</Text>
                    </TouchableOpacity>
                </Link>

            </View>

            {/* Button to delete the collection */}
            <View className="items-center pt-8">
                <ActionButton
                    onPress={onDeleteCollection}
                    iconName={"trash-bin-outline"}
                    text={"Delete Collection"}
                    textColor={Colors.Complementary["100"]}
                    buttonColor={Colors.Red["600"]}
                />
            </View>

        </View>
    );
};

export default Settings;
