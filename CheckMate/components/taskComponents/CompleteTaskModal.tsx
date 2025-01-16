import React, {useState} from 'react';
import {FlatList, Modal, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import {Colors} from "@/constants/Colors";
import HorizontalInput from "@/components/uiComponents/HorizontalInput";
import ActionButton from "@/components/uiComponents/ActionButton";
import CustomHorizontalInput from "@/components/uiComponents/CustomHorizontalnput";
import UserListItem from "@/components/UserListItem";

const CompleteTaskModal = ({
                               task,
                               completeTaskModalVisible,
                               setCompleteTaskModalVisible,
                               completeTaskDate,
                               setCompleteTaskDate,
                               completionComment,
                               setCompletionComment,
                               assignTaskToUser,
                               setAssignTaskToUser,
                               onCompleteTask,
                               users
                           }) => {
    const [showUserList, setShowUserList] = useState();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState(users);

    const toggleShowUserList = () => {
        setShowUserList(!showUserList);
        setSearchTerm("");
        setSearchResults(users);
    };

    const closeModal = () => {
        setAssignTaskToUser(null);
        setCompletionComment("");
        setCompleteTaskDate(null);
        setSearchResults(users);
        setSearchTerm("");
        setShowUserList(false);
        setCompleteTaskModalVisible(false);
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        if (term.trim() === '') {
            setSearchResults(users); // Show all users if search is empty
        } else {
            const filteredUsers = users.filter((user) =>
                user.first_name.toLowerCase().includes(term.toLowerCase()) ||
                user.email.toLowerCase().includes(term.toLowerCase())
            );
            setSearchResults(filteredUsers);
        }
    };

    return (
        <Modal
            visible={completeTaskModalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => closeModal(false)}
        >
            <TouchableOpacity
                className="justify-center flex-1"
                style={{backgroundColor: "rgba(0, 0, 0, 0.3)"}}
                onPress={() => {
                    closeModal();
                }
                }
            >
                <TouchableWithoutFeedback>
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

                            {task?.recurring && (
                                <>
                                    <CustomHorizontalInput
                                        labelText={"Assign User:"}
                                        placeholder={"No user assigned"}
                                        value={assignTaskToUser ? `${assignTaskToUser?.first_name} (${assignTaskToUser?.email})` : "No user assigned"}
                                        handlePress={toggleShowUserList}
                                    />

                                    {showUserList && (
                                        <View>
                                            <TextInput
                                                placeholder="Search users..."
                                                autoFocus={true}
                                                className="rounded-lg p-2"
                                                style={{
                                                    borderWidth: 1,
                                                    backgroundColor: Colors.Complementary["50"],
                                                    borderColor: Colors.Complementary["600"],
                                                    marginBottom: 8,
                                                    color: Colors.Primary["800"]
                                                }}
                                                value={searchTerm}
                                                onChangeText={handleSearch}
                                            />

                                            <FlatList
                                                style={{
                                                    height: 60
                                                }}
                                                data={searchResults}
                                                keyExtractor={(item) => `${item.id}`}
                                                renderItem={({item}) => (
                                                    <UserListItem
                                                        element={{item}}
                                                        onPress={(item) => {
                                                            setAssignTaskToUser(item);
                                                            toggleShowUserList();
                                                        }}
                                                    />
                                                )}
                                            />

                                            <View className="items-center pt-3">
                                                <ActionButton
                                                    onPress={() => {
                                                        setAssignTaskToUser(null);
                                                        toggleShowUserList();
                                                    }}
                                                    iconName="close"
                                                    text="Unassign"
                                                    textColor={Colors.Complementary["100"]}
                                                    buttonColor={Colors.Primary["600"]}
                                                />
                                            </View>
                                        </View>
                                    )}
                                </>
                            )}


                            <View className="flex-row items-center justify-center px-5 ">
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
                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </Modal>
    )
        ;
};

export default CompleteTaskModal;