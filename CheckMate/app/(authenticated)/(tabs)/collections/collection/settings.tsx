import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, TextInput, TouchableOpacity, FlatList} from 'react-native';
import {Link, router, Stack, useLocalSearchParams, useRouter} from "expo-router";
import {useSupabase} from "@/context/SupabaseContext";
import {Collection, User} from "@/types/enums";
import {Colors} from "@/constants/Colors";
import {Ionicons} from "@expo/vector-icons";
import UserListItem from "@/components/UserListItem";
import {useHeaderHeight} from "@react-navigation/elements";

const Settings = () => {
    // Extract the 'id' parameter from the URL
    const { id } = useLocalSearchParams<{ id?: string }>();

    // Supabase methods for getting, updating, and deleting collection information
    const { getCollectionInfo, updateCollection, deleteCollection, getCollectionMembers } = useSupabase();
    const headerHeight = useHeaderHeight();

    const router = useRouter();

    // State to hold the collection information
    const [collection, setCollection] = useState<Collection>();

    // State to hold the members of the collection
    const [members, setMembers] = useState<User[]>([]);

    // Load collection  information when the component mounts
    useEffect(() => {
        if (!id) return;
        loadCollectionInfo();
    }, []);

    // Function to fetch collection information and members from Supabase
    const loadCollectionInfo = async () => {
        if (!id) return;
        const data = await getCollectionInfo!(id);
        setCollection(data);

        const members = await getCollectionMembers!(id);
        setMembers(members);
    };

    // Function to update the collection's name
    const onUpdateCollection = async () => {
        const updated = await updateCollection!(collection!);
        setCollection(updated);
        router.dismissAll(); // Dismisses all modals or screens after updating
    };

    // Function to delete the collection
    const onDeleteCollection = async () => {
        if (!id) return;
        await deleteCollection!(id);
        router.dismissAll(); // Dismisses all modals or screens after deletion
    };


    // Custom header component
    const CustomHeader = () => (
        <View className="" style={{backgroundColor: Colors.Complementary["400"]}}>
            <View className="flex-row items-center justify-between bg-complementary-400 px-4 py-3">
                {/* Close button */}
                <TouchableOpacity className="pr-2" onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={Colors.Complementary["900"]} />
                </TouchableOpacity>

                {/* Collection name */}
                <View style={{ flex: 1 }}>
                    <Text style={{ color: Colors.Complementary["900"], fontSize: 20 }}>{collection?.name} Settings</Text>
                </View>

            </View>
        </View>
    );




    return (
        <View className="w-full h-full" style={{backgroundColor: Colors.Complementary["300"]}}>

            <Stack.Screen
                options={{
                    header: () => <CustomHeader />,
                    title: collection?.name,
                    headerTransparent: false,
                }}
            />


            <View className="px-4 pb-8 pt-2" >
                <Text className="text-sm my-2" style={{color: Colors.Primary["800"]}}>Collection Name</Text>

                {/* Input for updating the collection name */}
                <TextInput
                    value={collection?.name}
                    onChangeText={(text) => setCollection({...collection!, name: text})}
                    className="rounded-md p-2"
                    style={{ backgroundColor: Colors.Complementary["50"] }}
                    returnKeyType="done"
                    enterKeyHint="done"
                    onEndEditing={onUpdateCollection}
                />
            </View>



            <View className="px-4 pt-4 pb-32 border-b" style={{borderColor: Colors.Complementary["500"]}}>

                <View className="flex-row items-center" >
                    <Ionicons name={'person-outline'} size={18} color={Colors.Primary["900"]} />
                    <Text className="pl-2 font-bold text-lg" style={{color: Colors.Primary["900"] }}>Members</Text>
                </View>

                {/* FlatList to display the members of the collection */}
                <FlatList
                    data={members}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={(item) => <UserListItem onPress={() => {}} element={item} />}
                    contentContainerStyle={{ gap: 8 }}
                    style={{ marginVertical: 12 }}
                />

                {/* Link to invite a new member to the collection */}
                <Link href={`/(authenticated)/(tabs)/collections/collection/invite?id=${id}`} asChild>
                    <TouchableOpacity className="py-2 mx-20 rounded-2xl items-center" style={{backgroundColor: Colors.Complementary["600"]}} >
                        <Text className="text-lg" style={{ color: Colors.fontLight }}>Invite...</Text>
                    </TouchableOpacity>
                </Link>

            </View>

            {/* Button to delete the collection */}
            <View className="pt-8">
                <TouchableOpacity
                    className=" py-2 mx-16 rounded-lg items-center"
                    style={{backgroundColor: Colors.primaryGray}}
                    onPress={onDeleteCollection}
                >
                    <Text className="font-bold" style={{color: Colors.danger}}>Delete Collection</Text>
                </TouchableOpacity>
            </View>

        </View>

    );
};

export default Settings;
