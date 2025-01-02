import {BottomSheetView} from "@gorhom/bottom-sheet";
import {Image, Text, TextInput, TouchableOpacity, View} from "react-native";
import React, {useState} from "react";
import {Colors} from "@/constants/Colors";
import {useSupabase} from "@/context/SupabaseContext";


const NewTagModal = ({ onTagCreated }: { onTagCreated: () => void }) => {

    const [tagName, setTagName] = useState();
    const [tagIcon, setTagIcon] = useState();

    const {createTag} = useSupabase();

    // Create a new board and return to Collections page
    const onCreateTag = async () => {

        if (!tagName.trim()) {
            alert('Please enter a tag name.');
            return;
        }
        console.log("Create a tag with the name: " + tagName);
        await createTag(tagName.trim());
        onTagCreated(); // close the modal
    };


    return (
        <BottomSheetView className="px-5 ">

            {/*Tag Name Input*/}
            <View className="pt-5">
                <Text className="text-sm my-2" style={{color: Colors.Primary["800"]}}>Tag Name:</Text>
                {/* Input for updating the collection name */}
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
                    autoFocus
                />
            </View>

            <View className="items-center pt-10 pb-10">
                <TouchableOpacity
                    className="py-2 px-8 mx-16 rounded-xl items-center"
                    style={{backgroundColor: Colors.Complementary["700"]}}
                    onPress={() => onCreateTag()}
                >
                    <Text style={{color: Colors.Complementary["100"]}}>Create Tag</Text>
                </TouchableOpacity>
            </View>

        </BottomSheetView>
    );
};

export default NewTagModal;