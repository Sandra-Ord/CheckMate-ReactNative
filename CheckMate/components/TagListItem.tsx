import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import {useSupabase} from "@/context/SupabaseContext";
import {Colors} from "@/constants/Colors";
import {Tag} from "@/types/enums";

const TagListItem = (tag: Tag) => {

    const [isArchived, setIsArchived] = useState<boolean>(tag.archived_at !== null);
    const {archiveTag, unArchiveTag} = useSupabase();

    const onArchiveTag = async () => {
        tag = await archiveTag(tag);
        console.log("Tag " + tag.tag + " archived");
        setIsArchived(true);
    };

    const onUnArchiveTag = async () => {
        tag = await unArchiveTag(tag);
        console.log("Tag " + tag.tag + " unarchived");
        setIsArchived(false);
    };

    return (
        <View className="flex-row justify-between py-3 px-1">
            {/* Left Section: Icon + Tag Name */}
            <View className="flex-row items-center">
                <TouchableOpacity>
                    <Ionicons name="pricetag-outline" size={24} style={{color: Colors.Primary["800"]}}/>
                </TouchableOpacity>
                <Text className="text-base text-primary-800 font-medium ml-3">
                    {tag.tag}
                </Text>
            </View>

            {/* Right Section: Archived + Icon */}
            <View className="flex-row items-center">
                {isArchived ? (
                    <>
                        <Text className="text-sm text-primary-800 mr-3">
                            Archived
                        </Text>
                        <TouchableOpacity onPress={() => onUnArchiveTag()}>
                            <Ionicons name="arrow-up-circle-outline" size={24} style={{color: Colors.Primary["800"]}}/>
                        </TouchableOpacity>
                    </>
                ) : (
                    <TouchableOpacity onPress={() => onArchiveTag()}>
                        <Ionicons name="archive" size={24} style={{color: Colors.Primary["800"]}}/>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default TagListItem;