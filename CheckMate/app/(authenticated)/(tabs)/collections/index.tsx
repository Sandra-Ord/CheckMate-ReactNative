import React, {useCallback, useMemo, useRef, useState} from 'react';
import {FlatList, SafeAreaView, Text, View} from 'react-native';
import CollectionCard from "@/components/CollectionCard";
import {Colors} from "@/constants/Colors";
import {useFocusEffect, useLocalSearchParams} from "expo-router";
import {useSupabase} from "@/context/SupabaseContext";


const Index = () => {

    // State to manage the refresh control
    const [refreshing, setRefreshing] = useState(false);
    const [collections, setCollections] = useState<[]>();
    const {getCollections} = useSupabase();



    // Function to load collection's tasks from Supabase
    const loadTasks = async () => {
        const data = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        setTasks(data);
    };

    const loadCollections = async () => {
        const data = await getCollections!();
        console.log(data);
        setCollections(data);
    };

    // Load collections when the screen gains focus
    useFocusEffect(
        useCallback(() => {
            loadCollections();
        }, [])
    );

    return (
        <SafeAreaView>
            <View className="w-full h-full" style={{backgroundColor: Colors.Complementary["300"]}}>

                <View className="flex-1 justify-center items-center">
                    <FlatList
                        data={collections}
                        renderItem={({ item }) => <CollectionCard {...item} />}
                        // refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadBoards} />}
                        keyExtractor={(item) => item.id.toString()}
                    />

                </View>

            </View>
        </SafeAreaView>
    );
};

export default Index;