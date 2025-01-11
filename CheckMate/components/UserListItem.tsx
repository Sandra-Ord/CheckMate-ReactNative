import React from 'react';
import {ListRenderItemInfo, Text, TouchableOpacity, View, Image} from 'react-native';
import {User} from '@/types/enums';
import {Colors} from '@/constants/Colors';

interface UserListItemProps {
    element: ListRenderItemInfo<User>;
    onPress: (user: User) => void;
}

const UserListItem = ({element: {item}, onPress}: UserListItemProps) => (
    <TouchableOpacity
        className="flex-row gap-x-4 items-center mx-2"
        onPress={() => onPress(item)}
    >
        <Image
            source={{uri: item.avatar_url}}
            style={{
                width: 30,
                height: 30,
                borderRadius: 40,
            }}
        />
        <View>
            <Text className="text-lg font-semibold" style={{color: Colors.Primary["900"]}}>{item.first_name}</Text>
            <Text style={{color: Colors.Primary["900"]}}>{item.email}</Text>
        </View>

    </TouchableOpacity>
);

export default UserListItem;