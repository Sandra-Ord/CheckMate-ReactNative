import React from 'react';
import {ListRenderItemInfo, Text, TouchableOpacity, View, Image} from 'react-native';
import {User} from '@/types/enums';
import {Colors} from '@/constants/Colors';

// Define the props interface for the UserListItem component
interface UserListItemProps {
    element: ListRenderItemInfo<User>; // Information about the item to render
    onPress: (user: User) => void; // Function to call when the item is pressed
}

// Functional component to display a single user item
const UserListItem = ({element: {item}, onPress}: UserListItemProps) => (
    <TouchableOpacity
        style={{
            flexDirection: 'row', // Align items in a row
            gap: 12, // Space between avatar and user info
            alignItems: 'center', // Center items vertically
        }}
        // Call the onPress function with the user object when the item is pressed
        onPress={() => onPress(item)}
    >
        {/* Display user avatar */}
        <Image
            source={{uri: item.avatar_url}}
            style={{
                width: 30, // Set avatar width
                height: 30, // Set avatar height
                borderRadius: 40, // Make avatar circular
            }}
        />
        <View>
            {/* Display user's first name */}
            <Text style={{fontSize: 16, fontWeight: 'semibold'}}>{item.first_name}</Text>
            {/* Display user's email */}
            <Text style={{color: Colors.grey}}>{item.email}</Text>
        </View>
    </TouchableOpacity>
);

export default UserListItem;