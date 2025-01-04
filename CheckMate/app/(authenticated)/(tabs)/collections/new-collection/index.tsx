import React, {useState} from 'react';
import {Stack, router} from "expo-router";
import {SafeAreaView, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useSupabase} from "@/context/SupabaseContext";
import {Colors} from "@/constants/Colors";

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

            <View className="px-4 pb-8 pt-2" >
                <Text className="text-sm my-2" style={{color: Colors.Primary["800"]}}>Collection Name</Text>

                {/* Input for updating the collection name */}
                <TextInput
                    value={collectionName}
                    placeholder="New Collection Name"
                    onChangeText={setCollectionName}
                    className="rounded-md p-2"
                    style={{ backgroundColor: Colors.Complementary["50"] }}
                    returnKeyType="done"
                    enterKeyHint="done"
                    autoFocus
                />
            </View>

        </View>
    );
};

export default Index;