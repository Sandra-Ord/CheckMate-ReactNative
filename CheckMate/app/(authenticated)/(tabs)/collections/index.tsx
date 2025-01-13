import React, {useCallback, useRef, useState} from 'react';
import {SafeAreaView, useWindowDimensions, View} from 'react-native';
import {useFocusEffect} from "expo-router";
import Carousel, {ICarouselInstance} from "react-native-reanimated-carousel";
import {useSharedValue} from "react-native-reanimated";
import {useHeaderHeight} from "@react-navigation/elements";
import {useSupabase} from "@/context/SupabaseContext";
import {Colors} from "@/constants/Colors";
import CollectionCard from "@/components/CollectionCard";
import NewCollectionCard from "@/components/NewCollectionCard";

const CollectionsView = () => {

    const {width, height} = useWindowDimensions();
    const ref = useRef<ICarouselInstance>(null);
    const scrollOffsetValue = useSharedValue(1);
    const progress = useSharedValue(0);

    const [refreshing, setRefreshing] = useState(false);
    const [collections, setCollections] = useState<[]>();
    const [carouselData, setCarouselData] = useState<[]>();
    const {getCollections} = useSupabase();

    const headerHeight = useHeaderHeight();

    // -----------------------------------------------------------------------------------------------------------------
    // -------------------------------------------- LOAD INFORMATION ---------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------

    const loadCollections = async () => {
        const data = await getCollections!();
        setCollections(data);
        setCarouselData([{ isNewCollectionCard: true }, ...(data || [])]);
    };

    useFocusEffect(
        useCallback(() => {
            loadCollections();
        }, [])
    );


    return (
        <SafeAreaView>

            <View className="w-full h-full"
                  style={{backgroundColor: Colors.Complementary["300"], paddingTop: headerHeight / 2}}>

                <Carousel
                    data={carouselData}
                    loop={false}
                    defaultScrollOffsetValue={scrollOffsetValue}
                    renderItem={({ item }) =>
                        item.isNewCollectionCard ? (
                            <NewCollectionCard />
                        ) : (
                            <CollectionCard {...item} />
                        )
                    }
                    vertical={false}
                    width={width}
                    height={height}
                />

            </View>

        </SafeAreaView>
    );
};

export default CollectionsView;