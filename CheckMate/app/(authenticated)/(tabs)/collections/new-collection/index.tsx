import React, {useState} from 'react';
import {Stack, router} from "expo-router";
import {SafeAreaView, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Colors} from "@/constants/Colors.ts";
import {useSupabase} from "@/context/SupabaseContext.tsx";

const Index = () => {

    const [collectionName, setCollectionName] = useState<string>("");

    const {createCollection} = useSupabase();

    //Create a new board and return to Collections page
    const onCreateCollection = async () => {
        console.log("Creating Collection with name: " + collectionName);
        await createCollection(collectionName);
        router.dismiss();
    };

    return (
        <View className="w-full h-full " style={{backgroundColor: Colors.Complementary["100"]}}>

            <Stack.Screen options={{
                            headerRight: () => (
                                <TouchableOpacity onPress={onCreateCollection} disabled={collectionName === ''}>
                                    <Text className={collectionName === '' ? "disabled" : ""}>Create</Text>
                                </TouchableOpacity>
                            )
                          }}
            >
            </Stack.Screen>

            <View className="px-2 pt-4">
                <TextInput
                    className="text-black text-sm border-b border-b-gray-500 pt-5 px-1"
                    value={collectionName}
                    onChangeText={setCollectionName}
                    placeholder="New Collection Name"
                    autoFocus
                />
            </View>

        </View>
    );
};

export default Index;