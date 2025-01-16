import {BottomSheetView} from "@gorhom/bottom-sheet";
import {Alert, Text, TextInput, View} from "react-native";
import React, {useEffect, useState} from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useSupabase} from "@/context/SupabaseContext";
import {Colors} from "@/constants/Colors";
import {Tag} from "@/types/enums";
import ActionButton from "@/components/uiComponents/ActionButton";

const NewTagModal = ({
                         closeModal,
                         reload,
                         tag
                     }: {
    closeModal: () => void,
    reload: () => void,
    tag?: Tag
}) => {

    const [tagName, setTagName] = useState();
    const [tagIcon, setTagIcon] = useState();

    const {createTag, updateTag, deleteTag} = useSupabase();

    // -----------------------------------------------------------------------------------------------------------------
    // -------------------------------------------- DATABASE OPERATIONS ------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------

    const onCreateTag = async () => {
        if (!tagName.trim()) {
            Alert.alert("Missing Data", "Please enter a tag name.");
            return;
        }
        await createTag(tagName.trim());
        reload();
        closeModal();
    };

    const onUpdateTag = async () => {
        if (!tagName.trim()) {
            Alert.alert("Missing Data", "Please enter a tag name.");
            return;
        }
        tag.tag = tagName.trim();
        tag.icon = tagIcon;
        await updateTag(tag);
        reload();
        closeModal();
    };

    const onDeleteTag = async () => {
        await deleteTag(tag.id);
        closeModal();
        reload();
    }

    useEffect(() => {
        if (tag) {
            setTagName(tag.tag);
            setTagIcon(tag.tag_icon || '');
        }
    }, [tag]);

    return (
        <BottomSheetView className="px-5 ">

            {/* Modal Title */}
            <View className="flex-row justify-between items-center">
                <Text className="pt-5 text-2xl font-bold" style={{color: Colors.Complementary["800"]}}>
                    {tag == null ? 'New Tag:' : 'Edit Tag:'}
                </Text>
                <Ionicons onPress={() => closeModal()} name="close" size={20}
                          style={{color: Colors.Complementary["800"]}}/>
            </View>

            {/*Tag Name Input*/}
            <View className="pt-5">
                <Text className="text-sm my-2" style={{color: Colors.Primary["800"]}}>Tag Name:</Text>
                {/* Input for updating the tag name */}
                <TextInput
                    value={tagName}
                    placeholder="New Tag's Name"
                    onChangeText={setTagName}
                    className="rounded-lg p-2"
                    style={{backgroundColor: Colors.Complementary["50"]}}
                    returnKeyType="done"
                    enterKeyHint="done"
                    autoFocus
                />
            </View>

            {/*Tag Icon Input*/}
            <View className="flex-row items-center pt-10 gap-x-2 ">
                <Text className="text-sm " style={{color: Colors.Primary["800"]}}>Tag Icon:</Text>
                {/* Input for updating the collection name */}
                <TextInput
                    value={tagIcon}
                    placeholder="Select Tag Icon"
                    onChangeText={setTagIcon}
                    className="rounded-lg flex-1 p-2"
                    style={{backgroundColor: Colors.Complementary["50"]}}
                    returnKeyType="done"
                    enterKeyHint="done"
                />
            </View>


            {tag ?
                // Update and Delete Button
                <View className="flex-row items-center justify-between px-5 py-10">
                    <ActionButton
                        onPress={onUpdateTag}
                        iconName={"checkmark-circle-outline"}
                        text={"Update"}
                        textColor={Colors.Complementary["100"]}
                        buttonColor={Colors.Yellow["600"]}
                    />
                    <ActionButton
                        onPress={onDeleteTag}
                        iconName={"trash-bin-outline"}
                        text={"Delete"}
                        textColor={Colors.Complementary["100"]}
                        buttonColor={Colors.Red["600"]}
                    />
                </View>
                :
                // Create Button
                <View className="items-center pt-10 pb-10">
                    <ActionButton
                        onPress={onCreateTag}
                        iconName={"add-outline"}
                        text={"Create Tag"}
                        textColor={Colors.Complementary["100"]}
                        buttonColor={Colors.Complementary["600"]}
                    />
                </View>
            }

        </BottomSheetView>
    );
};

export default NewTagModal;