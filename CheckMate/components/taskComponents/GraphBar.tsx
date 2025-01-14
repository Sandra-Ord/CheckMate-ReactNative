import React from 'react';
import { Text, View } from 'react-native';
import {CollectionInvitationStatus} from "@/types/enums";

const GraphBar = ({user, text, width, mainColor, dimColor}) => {
    return (
        <View className="flex-row items-center gap-x-2">
            <View
                className="h-4"
                style={{
                    backgroundColor: user.status === CollectionInvitationStatus.Accepted ? mainColor : dimColor,
                    width: width,
                }}
            />
            <Text className="text-xs"
                  style={{color: mainColor}}>
                {text}
            </Text>
        </View>
    );
};

export default GraphBar;