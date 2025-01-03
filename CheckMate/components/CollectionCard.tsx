import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Href, Link} from "expo-router";
import {Collection} from "@/types/enums";
import {Colors} from "@/constants/Colors";

const CollectionCard = (collection: Collection) => {
    return (
        <View className="px-8">
            <Link
                href={`/(authenticated)/(tabs)/collections/collection/${collection.id}` as Href} // Hack for faster loading
                key={`1}`}
                asChild
            >
                <TouchableOpacity
                    className="rounded-3xl w-full px-6 py-4"
                    style={{backgroundColor: Colors.Complementary["50"], aspectRatio: 4/5}}>
                    <View className="border-b border-b-gray-500 pb-2">
                        <Text className="text-xl font-bold px-1" style={{color: Colors.Primary["800"]}}>
                            {collection.name}
                        </Text>
                    </View>
                </TouchableOpacity>
            </Link>
        </View>
    );
};


export default CollectionCard;