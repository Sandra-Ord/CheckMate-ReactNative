import React, {useCallback, useMemo, useRef, useState} from 'react';
import {FlatList, RefreshControl, SafeAreaView, Text, useWindowDimensions, View} from 'react-native';
import {useFocusEffect} from "expo-router";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import {useSupabase} from "@/context/SupabaseContext";
import CollectionCard from "@/components/CollectionCard";
import {Colors} from "@/constants/Colors";
import {useSharedValue} from "react-native-reanimated";
import {useHeaderHeight} from "@react-navigation/elements";

const Index = () => {

    const { width, height } = useWindowDimensions();
    const ref = useRef<ICarouselInstance>(null);
    const scrollOffsetValue = useSharedValue(0);
    const progress = useSharedValue(0);

    // State to manage the refresh control
    const [refreshing, setRefreshing] = useState(false);
    const [collections, setCollections] = useState<[]>();
    const {userId, getCollections} = useSupabase();

    const headerHeight = useHeaderHeight();

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
            <View className="w-full h-full" style={{backgroundColor: Colors.Complementary["300"], paddingTop: headerHeight/2}}>

                <Carousel
                    data={collections}
                    loop={true}
                    defaultScrollOffsetValue={scrollOffsetValue}
                    renderItem={({ item }) => <CollectionCard {...item} />}
                    vertical={false}
                    width={width}
                    height={height}
                />

                {/*<View className="flex-1 justify-center items-center">*/}
                {/*    <FlatList*/}
                {/*        data={collections}*/}
                {/*        renderItem={({ item }) => <CollectionCard {...item} />}*/}
                {/*        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadCollections} />}*/}
                {/*        keyExtractor={(item) => item.id.toString()}*/}
                {/*    />*/}

                {/*</View>*/}

            </View>
        </SafeAreaView>
    );
};

export default Index;