import React from 'react';
import {ListRenderItemInfo, Text, TouchableOpacity, View, Image} from 'react-native';
import {User} from '@/types/enums';
import {Colors} from '@/constants/Colors';
import Ionicons from "@expo/vector-icons/Ionicons";

interface UserListItemProps {
    element: ListRenderItemInfo<User>;
    onPress: (user: User) => void;
}

const UserListItem = ({element: {item}, onPress}: UserListItemProps) => (
    <TouchableOpacity
        className="flex-row gap-x-4 items-center mx-2"
        onPress={() => {onPress(item)}}
    >
        <Image
            source={{uri: item.avatar_url}}
            style={{
                width: 30,
                height: 30,
                borderRadius: 40,
            }}
        />

        {/*{user.avatar_url ? (*/}
        {/*    <Image*/}
        {/*        source={{uri: user.avatar_url}}*/}
        {/*        style={{*/}
        {/*            width: 20,*/}
        {/*            height: 20,*/}
        {/*            borderRadius: 40,*/}
        {/*        }}*/}
        {/*    />*/}
        {/*) : (*/}
        {/*    <Ionicons name="person-circle-outline" size={20} style={{color: Colors.Primary["600"]}}/>*/}
        {/*)}*/}
        <View>
            <Text className="text-lg font-semibold" style={{color: Colors.Primary["900"]}}>{item.first_name}</Text>
            <Text style={{color: Colors.Primary["900"]}}>{item.email}</Text>
        </View>

    </TouchableOpacity>
);

export default UserListItem;