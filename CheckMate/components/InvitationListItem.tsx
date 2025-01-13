import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import {Colors} from "@/constants/Colors";
import {formatShortDate} from "@/utils/textUtils";

const InvitationListItem = ({
                                invitation,
                                setCollectionName,
                                setInvitationId,
                                setIsRespondingModalOpen,
                            }) => {
    const handlePress = () => {
        setCollectionName(invitation.collections.name);
        setInvitationId(invitation.id);
        setIsRespondingModalOpen(true);
    };

    return (
        <View className="py-1">
            <TouchableOpacity className="rounded-3xl w-full py-4 px-4"
                              style={{backgroundColor: Colors.Complementary["50"]}}>
                <View className="flex-col">

                    {/* on top of the separator line */}
                    <View className="flex-row justify-between">

                        <Text className="text-lg font-bold">
                            {invitation.collections.name}
                        </Text>
                        <TouchableOpacity onPress={handlePress}>

                            <Ionicons name="send-outline" size={20} style={{color: Colors.Primary["800"]}}/>
                        </TouchableOpacity>

                    </View>

                    {/* separator line */}
                    <View
                        style={{
                            height: 1,
                            backgroundColor: Colors.Complementary["800"],
                        }}
                        className="my-2"
                    />

                    {/* under the separator line */}
                    <View className="flex-row justify-between px-1">
                        {/* aligned to the left */}
                        <View className="flex-col">
                            <View className="flex-row items-center pb-1">
                                <Ionicons className="pr-2" name="person-circle-outline" size={16}
                                          style={{color: Colors.Primary["800"]}}/>
                                <Text>Invited by: {invitation.users.first_name}</Text>
                            </View>
                            <View className="flex-row items-center">
                                <Ionicons className="pr-2" name="person-circle-outline" size={16}
                                          style={{color: Colors.Primary["800"]}}/>
                                <Text>Collection owner: {invitation.collections.users.first_name}</Text>
                            </View>
                        </View>
                        <Text>{formatShortDate(invitation.invited_at)}</Text>
                    </View>

                </View>
            </TouchableOpacity>
        </View>
    );
};

export default InvitationListItem;