import {BottomSheetView} from "@gorhom/bottom-sheet";
import {Text, TextInput, TouchableOpacity, View} from "react-native";
import React, {useEffect, useState} from "react";
import {useSupabase} from "@/context/SupabaseContext";
import {Colors} from "@/constants/Colors";
import {Tag} from "@/types/enums";
import Ionicons from "@expo/vector-icons/Ionicons";


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

    const onCreateTag = async () => {

        if (!tagName.trim()) {
            alert('Please enter a tag name.');
            return;
        }
        console.log("Create a tag with the name: " + tagName);
        await createTag(tagName.trim());
        reload();
        closeModal();
    };

    const onUpdateTag = async () => {
        if (!tagName.trim()) {
            alert('Please enter a tag name.');
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

    // If the modal is opened in edit more
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
                <Ionicons onPress={() => closeModal()} name="close" size={20} style={{color: Colors.Complementary["800"]}}/>
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
                    style={{ backgroundColor: Colors.Complementary["50"] }}
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
                    style={{ backgroundColor: Colors.Complementary["50"] }}
                    returnKeyType="done"
                    enterKeyHint="done"
                />
            </View>


            {tag ?
                // Update and Delete Button
                <View className="flex-row items-center justify-between px-5 py-10">
                    <TouchableOpacity
                        className="py-2 px-8  rounded-xl items-center flex-row gap-x-2"
                        style={{backgroundColor: Colors.Yellow["600"]}}
                        onPress={() => onUpdateTag()}
                    >
                        <Ionicons name="checkmark-circle-outline" size={20} style={{color: Colors.Complementary["100"]}}/>
                        <Text style={{color: Colors.Complementary["100"]}}>Update</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="py-2 px-8 rounded-xl items-center flex-row gap-x-2"
                        style={{backgroundColor: Colors.Red["600"]}}
                        onPress={() => onDeleteTag()}
                    >
                        <Ionicons name="trash-bin-outline" size={20} style={{color: Colors.Complementary["100"]}}/>
                        <Text style={{color: Colors.Complementary["100"]}}>Delete</Text>
                    </TouchableOpacity>
                </View>
                :
                // Create Button
                <View className="items-center pt-10 pb-10">
                    <TouchableOpacity
                        className="py-2 px-8 mx-16 rounded-xl items-center"
                        style={{backgroundColor: Colors.Complementary["700"]}}
                        onPress={() => onCreateTag()}
                    >
                        <Text style={{color: Colors.Complementary["100"]}}>Create Tag</Text>
                    </TouchableOpacity>
                </View>
            }

        </BottomSheetView>
    );
};

export default NewTagModal;