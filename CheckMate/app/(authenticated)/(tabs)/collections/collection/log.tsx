import React, {useCallback, useState} from 'react';
import {FlatList, RefreshControl, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import CollectionCard from "@/components/CollectionCard.tsx";
import {Colors} from "@/constants/Colors.ts";
import {useFocusEffect, useLocalSearchParams} from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

const LogView = () => {

    return (
        <View>
            log view
        </View>
    );
};

export default LogView;


