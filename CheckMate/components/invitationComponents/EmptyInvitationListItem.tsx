import React from 'react';
import {Text, View} from 'react-native';
import {Colors} from "@/constants/Colors";

const EmptyInvitationListItem = () => {
    return (
        <View className="py-1">
            <View className="rounded-3xl w-full py-4 px-4"
                  style={{backgroundColor: Colors.Complementary["50"]}}>
                <View className="items-center justify-center my-8">

                    <Text style={{color: Colors.Primary["600"]}}>
                        You do not have any pending invitations.
                    </Text>

                </View>
            </View>
        </View>
    );
};

export default EmptyInvitationListItem;