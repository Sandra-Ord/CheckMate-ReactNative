import React, {useCallback, useState} from 'react';
import {FlatList, Modal, RefreshControl, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {useFocusEffect} from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useSupabase} from "@/context/SupabaseContext";
import {CollectionUser} from "@/types/enums";
import {Colors} from "@/constants/Colors";
import {formatShortDate} from "@/utils/textUtils";
import ActionButton from "@/components/uiComponents/ActionButton";

const InvitationsView = () => {

    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [invitations, setInvitations] = useState<[]>([]);

    const [collectionName, setCollectionName] = useState<string>("");
    const [invitationId, setInvitationId] = useState<string>("");
    const [isRespondingModalOpen, setIsRespondingModalOpen] = useState<boolean>(false);

    const {getPendingInvitations, acceptInvitation, rejectInvitation} = useSupabase();

    const onAcceptInvitation = async () => {
        await acceptInvitation(invitationId);
        setIsRespondingModalOpen(false);
    }

    const onRejectInvitation = async () => {
        await rejectInvitation(invitationId);
        setIsRespondingModalOpen(false);
    }

    const loadInvitations = async () => {
        const data = await getPendingInvitations();
        setInvitations(data);
    };

    useFocusEffect(
        useCallback(() => {
            loadInvitations();
        }, [])
    );

    const InvitationListItem = (invitation: CollectionUser) => (
        <View className="py-1">
            <TouchableOpacity className="rounded-3xl w-full py-4 px-4"
                              style={{backgroundColor: Colors.Complementary["50"]}}>
                <View className="flex-col">

                    {/* on top of the separator line */}
                    <View className="flex-row justify-between">

                        <Text className="text-lg font-bold">
                            {invitation.collections.name}
                        </Text>
                        <TouchableOpacity onPress={() => {
                            setCollectionName(invitation.collections.name);
                            setInvitationId(invitation.id);
                            setIsRespondingModalOpen(true);
                        }}>

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
    )

    return (
        <SafeAreaView className="flex-1">
            <View className="w-full h-full" style={{backgroundColor: Colors.Complementary["300"]}}>

                <View className="flex-1 justify-center pt-2 pb-3 px-5">
                    <FlatList
                        data={invitations}
                        renderItem={({item}) => <InvitationListItem {...item} />}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadInvitations}/>}
                        keyExtractor={(item) => `${item.id.toString()}`}
                    />

                </View>

                {/* Modal for Responding */}
                <Modal
                    visible={isRespondingModalOpen}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setIsRespondingModalOpen(false)}
                >
                    <TouchableOpacity
                        className="justify-center  flex-1"
                        style={{backgroundColor: "rgba(0, 0, 0, 0.3)"}}
                        onPress={() => setIsRespondingModalOpen(false)}
                    >

                        <View className="rounded-lg p-4 mx-4" style={{backgroundColor: Colors.Complementary["100"]}}>

                            <View className="flex-row justify-between items-center">
                                <Text className="text-2xl font-bold">
                                    {collectionName}
                                </Text>
                                <TouchableOpacity onPress={() => setIsRespondingModalOpen(false)}>
                                    <Ionicons name="close" size={28} style={{color: Colors.Primary["800"]}}/>
                                </TouchableOpacity>
                            </View>

                            {/* separator line */}
                            <View
                                style={{
                                    height: 1,
                                    backgroundColor: Colors.Complementary["800"],
                                }}
                                className="mt-2"
                            />

                            <View className="py-4 px-1 gap-y-1">
                                <Text className="text-xs italic">
                                    You have been invited to join the "{collectionName}".
                                </Text>
                                <Text className="text-xs italic">
                                    If you reject, you will not be able to undo the action, unless a new invitation is
                                    sent to you.
                                </Text>
                            </View>

                            <View className="flex-row items-center justify-between px-4">
                                <ActionButton
                                    onPress={onAcceptInvitation}
                                    iconName="checkmark-circle-outline"
                                    text="Accept"
                                    textColor={Colors.Complementary["100"]}
                                    buttonColor={Colors.Green["600"]}
                                />
                                <ActionButton
                                    onPress={onRejectInvitation}
                                    iconName="close-circle-outline"
                                    text="Reject"
                                    textColor={Colors.Complementary["100"]}
                                    buttonColor={Colors.Red["600"]}
                                />
                            </View>

                        </View>

                    </TouchableOpacity>
                </Modal>

            </View>
        </SafeAreaView>
    );
};

export default InvitationsView;