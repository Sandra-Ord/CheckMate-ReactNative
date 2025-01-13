import React from 'react';
import {Href, Link} from "expo-router";
import {Text, TouchableOpacity, View} from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import {Colors} from "@/constants/Colors";

interface NoTasksListItemProps {
    onOpenFilterMenu: () => void;
    newTaskLink: string;
}

const NoTasksListItem: React.FC<NoTasksListItemProps> = ({onOpenFilterMenu, newTaskLink}) => {
    return (
        <View className="p-1">
            <View className="rounded-3xl w-full px-4 py-3"
                  style={{backgroundColor: Colors.Complementary["50"]}}
            >
                <View className="flex-col gap-y-2">

                    <Text
                        className="text-center text-lg"
                        style={{color: Colors.Primary["600"]}}
                    >
                        No tasks match your search.
                    </Text>

                    <View className="gap-y-1">

                        <TouchableOpacity
                            onPress={onOpenFilterMenu}
                            className="gap-x-2 flex-row items-center justify-center"
                        >
                            <Ionicons name="filter" size={18} style={{color: Colors.Primary["500"]}}/>
                            <Text style={{color: Colors.Primary["500"]}}>
                                Try adjusting your filters
                            </Text>
                        </TouchableOpacity>

                        <View className="items-center justify-center">
                            <Text className="text-xs" style={{color: Colors.Primary["500"]}}>
                                or
                            </Text>
                        </View>

                        <Link href={newTaskLink} asChild>
                            <TouchableOpacity
                                className="gap-x-2 flex-row items-center justify-center"
                            >
                                <Ionicons name="add" size={18} style={{color: Colors.Primary["500"]}}/>
                                <Text style={{color: Colors.Primary["500"]}}>
                                    Create a new task
                                </Text>
                            </TouchableOpacity>
                        </Link>

                    </View>

                </View>
            </View>
        </View>
    );
};

export default NoTasksListItem;