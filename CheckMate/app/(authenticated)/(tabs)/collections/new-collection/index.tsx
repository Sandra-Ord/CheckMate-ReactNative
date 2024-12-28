import React, {useState} from 'react';
import {Stack, router} from "expo-router";
import {SafeAreaView, Text, TextInput, TouchableOpacity, View} from 'react-native';

const Index = () => {
    const [collectionName, setCollectionName] = useState<string>("");

    // Function to create a new board
    const onCreateCollection = async () => {
        console.log("Creating Collection with name: " + collectionName);
        // Make database query here
        router.dismiss(); // Closes the modal after creating the board
    };

    return (

        <View className="justify-center">

            <Stack.Screen options={{
                            headerRight: () => (
                                <TouchableOpacity onPress={onCreateCollection} disabled={collectionName === ''}>
                                    <Text className={collectionName === '' ? "disabled" : ""}>Create</Text>
                                </TouchableOpacity>
                            )
                          }}
            >

            </Stack.Screen>


            <View className="px-2">
                <TextInput
                    className="text-black text-sm border-b border-b-gray-500 pt-5 px-1"
                    value={collectionName}
                    onChangeText={setCollectionName}
                    placeholder="New Collection"
                    autoFocus
                />
            </View>


        </View>

    );
};

export default Index;