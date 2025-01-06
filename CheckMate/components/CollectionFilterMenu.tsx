import React from "react";
import {View, Text, TouchableOpacity, ScrollView, SafeAreaView} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "@/constants/Colors";
import {Collection, Task, User} from "@/types/enums";


const FilterMenu = ({
                        onClose,
                        users,
                        filters,
                        toggleFilter,
                        toggleUserFilter,
                    }) => {
    return (
        <View
            className="flex-1 border pt-safe"
            style={{
                backgroundColor: Colors.Complementary["50"],
                borderColor: Colors.Complementary["300"],
            }}
        >
            <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 16 }}>
                <Text style={{ fontSize: 18, fontWeight: "bold", color: Colors.Complementary["900"] }}>Filters</Text>
                <TouchableOpacity onPress={onClose}>
                    <Ionicons name="close" size={24} color={Colors.Complementary["900"]} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: 16 }}>
                {/* Example Filter Options */}
                <View className="gap-y-2 pb-2">
                    <Text className="font-bold mb-2" style={{ color: Colors.Complementary["800"] }}>Sort By:</Text>
                    <TouchableOpacity className="flex-row gap-x-2">
                        <Ionicons name="square-outline" size={16} style={{color: Colors.Primary["800"]}}/>
                        <Text style={{ color: Colors.Primary["800"] }}>Due Date</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row gap-x-2">
                        <Ionicons name="square-outline" size={16} style={{color: Colors.Primary["800"]}}/>
                        <Text style={{ color: Colors.Primary["800"] }}>Open for Completion</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row gap-x-2">
                        <Ionicons name="square-outline" size={16} style={{color: Colors.Primary["800"]}}/>
                        <Text style={{ color: Colors.Primary["800"] }}>Assignment</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row gap-x-2">
                        <Ionicons name="square-outline" size={16} style={{color: Colors.Primary["800"]}}/>
                        <Text style={{ color: Colors.Primary["800"] }}>A - Z</Text>
                    </TouchableOpacity>
                </View>

                <View className="gap-y-2 pt-2">
                    <Text className="font-bold mb-2" style={{ color: Colors.Complementary["800"] }}>Filter By:</Text>
                    {[
                        { key: "openForCompletion", label: "Open for Completion" },
                        { key: "inSeason", label: "In Season" },
                        { key: "outOfSeason", label: "Out of Season" },
                        { key: "notArchived", label: "Not Archived" },
                        { key: "archived", label: "Archived" },
                    ].map(({ key, label }) => (
                        <TouchableOpacity key={key} onPress={() => toggleFilter(key)} className="flex-row gap-x-2">
                            <Ionicons
                                name={filters[key] ? "checkbox-outline" : "square-outline"}
                                size={16}
                                style={{ color: Colors.Primary["800"] }}
                            />
                            <Text style={{ color: Colors.Primary["800"] }}>{label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View className="gap-y-2 pt-2">
                    {/* User Buttons */}
                    <Text className="font-bold mb-2" style={{ color: Colors.Complementary["800"] }}>Filter By Users:</Text>

                    {[{ id: null, first_name: 'Not Assigned' }, ...users].map((user) => (
                        <TouchableOpacity
                            key={user.id}
                            onPress={() => user.id ? toggleUserFilter(user.id) : toggleFilter('notAssigned')} // Toggle Not Assigned filter
                            className="flex-row gap-x-2"
                        >
                            <Ionicons
                                name={filters.selectedUsers.includes(user.id) || (user.id === null && filters.notAssigned) ? "checkbox-outline" : "square-outline"}
                                size={16}
                                style={{ color: Colors.Primary["800"] }}
                            />
                            <Text style={{ color: Colors.Primary["800"] }}>{user.first_name}</Text>
                        </TouchableOpacity>
                    ))}

                </View>


            </ScrollView>
        </View>
    );
};

export default FilterMenu;
