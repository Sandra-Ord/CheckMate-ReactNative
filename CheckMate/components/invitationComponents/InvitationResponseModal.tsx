import React from 'react';
import {Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import {Colors} from "@/constants/Colors";
import ActionButton from "@/components/uiComponents/ActionButton";

const InvitationResponseModal = ({collectionName, responseModalVisible, setResponseModalVisible, onAcceptInvitation, onRejectInvitation}) => {
    return (
        <Modal
            visible={responseModalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setResponseModalVisible(false)}
        >
            <TouchableOpacity
                className="justify-center flex-1"
                style={{backgroundColor: "rgba(0, 0, 0, 0.3)"}}
                onPress={() => setResponseModalVisible(false)}
            >

                <TouchableWithoutFeedback>
                    <View className="rounded-lg p-4 mx-4"
                          style={{backgroundColor: Colors.Complementary["100"]}}>

                        <View className="flex-row justify-between items-center">
                            <Text className="text-2xl font-bold">
                                {collectionName}
                            </Text>
                            <TouchableOpacity onPress={() => setResponseModalVisible(false)}>
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
                                If you reject, you will not be able to undo the action, unless a new invitation
                                is
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
                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </Modal>
    );
};

export default InvitationResponseModal;