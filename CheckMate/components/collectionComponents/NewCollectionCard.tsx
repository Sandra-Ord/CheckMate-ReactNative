import React from 'react';
import {Text, TouchableOpacity, useWindowDimensions, View} from 'react-native';
import {Href, Link} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import {useHeaderHeight} from "@react-navigation/elements";
import {Colors} from "@/constants/Colors";

const NewCollectionCard = () => {

    const {width, height} = useWindowDimensions();
    const headerHeight = useHeaderHeight();

    return (
        <View className="px-8 items-center">
            <Link
                href={`/(authenticated)/(tabs)/collections/new-collection` as Href}
                key={`1}`}
                asChild
            >
                <TouchableOpacity
                    className="rounded-3xl w-full px-6 py-4 justify-center items-center"
                    style={{
                        backgroundColor: Colors.Complementary["50"],
                        width: width * 0.9,
                        height: (height - headerHeight) * 0.75
                    }}
                >
                    <Ionicons
                        name="add-circle-outline"
                        size={64}
                        color={Colors.Primary["700"]}
                    />
                    <Text
                        className="text-lg font-bold mt-4"
                        style={{color: Colors.Primary["700"]}}
                    >
                        Create a New Collection
                    </Text>
                </TouchableOpacity>
            </Link>
        </View>
    );
};

export default NewCollectionCard;