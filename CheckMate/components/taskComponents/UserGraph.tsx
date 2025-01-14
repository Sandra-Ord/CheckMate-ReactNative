import React from 'react';
import {Image, Text, View} from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import {Colors} from "@/constants/Colors";
import {CollectionInvitationStatus} from "@/types/enums";
import GraphBar from "@/components/taskComponents/GraphBar";

const UserGraph = ({user, index, maxTasks}) => {

    const getBarWidth = (value: number) => {
        return `${(value / maxTasks) * 85}%`;
    };

    return (
        <View key={index} className="gap-y-2">

            <View className="flex-row items-center gap-x-2 ">

                {user.avatar_url ? (
                    <Image
                        source={{uri: user.avatar_url}}
                        style={{
                            width: 20,
                            height: 20,
                            borderRadius: 40,
                        }}
                    />
                ) : (
                    <Ionicons name="person-circle-outline" size={20} style={{color: Colors.Primary["600"]}}/>
                )}

                <Text className="text-lg font-semibold "
                      style={{color: user.status === CollectionInvitationStatus.Accepted ? Colors.Primary["800"] : Colors.Primary["500"]}}>
                    {user.user}
                </Text>

            </View>

            <GraphBar user={user} text={`${user.total} Total`} width={getBarWidth(user.total)} mainColor={Colors.Blue["600"]} dimColor={Colors.Blue["400"]}/>

            <GraphBar user={user} text={`${user.completedOnTime} On Time`} width={getBarWidth(user.completedOnTime)} mainColor={Colors.Green["600"]} dimColor={Colors.Green["400"]}/>

            <GraphBar user={user} text={`${user.overdue} Overdue`} width={getBarWidth(user.overdue)} mainColor={Colors.Red["600"]} dimColor={Colors.Red["400"]}/>

        </View>
    );
};

export default UserGraph;