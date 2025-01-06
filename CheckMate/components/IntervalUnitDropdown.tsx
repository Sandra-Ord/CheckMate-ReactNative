import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

const IntervalDropdown = () => {

    const [intervalUnit, setIntervalUnit] = useState("days");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const options = ["days", "weeks", "months", "years"];

    const handleSelect = (value) => {
        setIntervalUnit(value);
        setIsDropdownOpen(false);
    };

    return (
        <View>
            <Text className="text-sm pt-5" style={{ color: Colors.Primary["800"] }}>
                Select Interval Unit:
            </Text>
            {/* Dropdown Trigger */}
            <TouchableOpacity
                onPress={() => setIsDropdownOpen(true)}
                style={styles.dropdownTrigger}
            >
                <Text style={{ color: Colors.Primary["800"] }}>{intervalUnit}</Text>
            </TouchableOpacity>

            {/* Modal for Dropdown */}
            <Modal
                visible={isDropdownOpen}
                transparent
                animationType="fade"
                onRequestClose={() => setIsDropdownOpen(false)}
            >
                <TouchableOpacity
                    style={styles.overlay}
                    onPress={() => setIsDropdownOpen(false)}
                >
                    <View style={styles.dropdownContainer}>
                        <FlatList
                            data={options}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => handleSelect(item)}
                                    style={styles.dropdownItem}
                                >
                                    <Text style={styles.dropdownText}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    dropdownTrigger: {
        padding: 12,
        backgroundColor: Colors.Complementary["50"],
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.Complementary["200"],
        marginTop: 8,
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        justifyContent: "center",
        alignItems: "center",
    },
    dropdownContainer: {
        backgroundColor: "white",
        borderRadius: 8,
        padding: 10,
        width: "80%",
    },
    dropdownItem: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.Complementary["200"],
    },
    dropdownText: {
        fontSize: 16,
        color: Colors.Primary["800"],
    },
});

export default IntervalDropdown;
