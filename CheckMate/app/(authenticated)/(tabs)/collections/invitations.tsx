import React, {useCallback, useState} from 'react';
import {
    FlatList,
    RefreshControl,
    SafeAreaView,
    View
} from 'react-native';
import {useFocusEffect} from "expo-router";
import {useSupabase} from "@/context/SupabaseContext";
import {Colors} from "@/constants/Colors";
import InvitationListItem from "@/components/invitationComponents/InvitationListItem";
import InvitationResponseModal from "@/components/invitationComponents/InvitationResponseModal";
import EmptyInvitationListItem from "@/components/invitationComponents/EmptyInvitationListItem";

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
        await loadInvitations();
    }

    const onRejectInvitation = async () => {
        await rejectInvitation(invitationId);
        setIsRespondingModalOpen(false);
        await loadInvitations();
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

    return (
        <SafeAreaView className="flex-1">
            <View className="w-full h-full" style={{backgroundColor: Colors.Complementary["300"]}}>

                <View className="flex-1 justify-center pt-2 pb-3 px-5">
                    <FlatList
                        data={invitations}
                        renderItem={({item}) =>
                            <InvitationListItem
                                invitation={item}
                                setCollectionName={setCollectionName}
                                setInvitationId={setInvitationId}
                                setIsRespondingModalOpen={setIsRespondingModalOpen}
                            />
                        }
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadInvitations}/>}
                        keyExtractor={(item) => `${item.id.toString()}`}
                        ListEmptyComponent={<EmptyInvitationListItem/>}
                    />

                </View>

                {/* Modal for Responding */}
                <InvitationResponseModal
                    collectionName={collectionName}
                    responseModalVisible={isRespondingModalOpen}
                    setResponseModalVisible={setIsRespondingModalOpen}
                    onAcceptInvitation={onAcceptInvitation}
                    onRejectInvitation={onRejectInvitation}
                />

            </View>
        </SafeAreaView>
    );
};

export default InvitationsView;