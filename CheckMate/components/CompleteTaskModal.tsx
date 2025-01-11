import React from 'react';
import {Modal, Text, TouchableOpacity, View} from 'react-native';
import {Colors} from "@/constants/Colors.ts";
import Ionicons from "@expo/vector-icons/Ionicons";
import HorizontalInput from "@/components/uiComponents/HorizontalInput.tsx";
import ActionButton from "@/components/uiComponents/ActionButton.tsx";

const CompleteTaskModal = ({task, completeTaskModalVisible, setCompleteTaskModalVisible, completeTaskDate, setCompleteTaskDate, completionComment, setCompletionComment, assignTaskToUserId, setAssignTaskToUserId, onCompleteTask}) => {
    return (
        <Modal
            visible={completeTaskModalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setCompleteTaskModalVisible(false)}
        >
            <TouchableOpacity
                className="justify-center flex-1"
                style={{backgroundColor: "rgba(0, 0, 0, 0.3)"}}
                onPress={() => setCompleteTaskModalVisible(false)}
            >
                <TouchableOpacity>
                    <View className="rounded-lg p-4 mx-4"
                          style={{backgroundColor: Colors.Complementary["100"]}}>

                        <View className="flex-row justify-between items-center">
                            <Text className="text-2xl font-bold">
                                Mark as Complete:
                            </Text>

                            <TouchableOpacity onPress={() => setCompleteTaskModalVisible(false)}>
                                <Ionicons name="close" size={28} style={{color: Colors.Primary["800"]}}/>
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

                        <View className="py-2 gap-y-5">
                            <View className="flex-row items-center gap-x-5">
                                <Text className="text-sm" style={{color: Colors.Primary["800"]}}>
                                    Task:
                                </Text>
                                <Text className=" font-bold">
                                    {task?.name}
                                </Text>
                            </View>

                            <HorizontalInput
                                labelText="Completed at:"
                                placeholder="YYYY-MM-DD"
                                value={completeTaskDate?.toISOString().split('T')[0]}
                                onChangeText={setCompleteTaskDate}
                            />
                            <HorizontalInput
                                labelText="Comment:"
                                placeholder=""
                                value={completionComment}
                                onChangeText={setCompletionComment}
                                multiline={true}
                                numberOfLines={3}
                            />
                            <HorizontalInput
                                labelText="Assign User:"
                                placeholder="Assign a user..."
                                value={assignTaskToUserId}
                                onChangeText={setAssignTaskToUserId}
                            />

                            <View className="flex-row items-center justify-center px-5 py-5">
                                <ActionButton
                                    onPress={onCompleteTask}
                                    iconName="checkbox-outline"
                                    text="Complete"
                                    textColor={Colors.Complementary["100"]}
                                    buttonColor={Colors.Complementary["600"]}
                                />
                            </View>

                        </View>
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};

export default CompleteTaskModal;