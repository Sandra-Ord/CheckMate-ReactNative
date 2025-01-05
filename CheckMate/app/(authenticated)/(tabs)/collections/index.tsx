import React, {useCallback, useMemo, useRef, useState} from 'react';
import {FlatList, RefreshControl, SafeAreaView, Text, View} from 'react-native';
import {useFocusEffect} from "expo-router";
import {useSupabase} from "@/context/SupabaseContext";
import CollectionCard from "@/components/CollectionCard";
import {Colors} from "@/constants/Colors";

const Index = () => {

    // State to manage the refresh control
    const [refreshing, setRefreshing] = useState(false);
    const [collections, setCollections] = useState<[]>();
    const {userId, getCollections} = useSupabase();

    const loadCollections = async () => {
        const data = await getCollections!();
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
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadCollections} />}
                        keyExtractor={(item) => item.id.toString()}
                    />

                </View>

            </View>
        </SafeAreaView>
    );
};

export default Index;