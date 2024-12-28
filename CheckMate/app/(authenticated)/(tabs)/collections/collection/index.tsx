import React from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import CollectionCard from "@/components/CollectionCard";
import {Colors} from "@/constants/Colors.ts";

const Index = () => {
    return (
        <SafeAreaView>
            <View className="w-full h-full" style={{backgroundColor: Colors.Complementary["300"]}}>

                <View className="flex-1 justify-center items-center">
                    <CollectionCard/>
                </View>

            </View>
        </SafeAreaView>
    );
};

export default Index;