import React from 'react';
import {FlatList, Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import {Colors} from "@/constants/Colors";

const DropdownModal = ({
                           isVisible,
                           close,
                           options,
                           handleSelect,
                           backgroundColor = Colors.Complementary["50"],
                           textColor = Colors.Primary["800"],
                           separatorColor = Colors.Complementary["300"]

                       }) => {
    return (
        <Modal
            visible={isVisible}
            transparent
            animationType="fade"
            onRequestClose={close}
        >
            <TouchableOpacity
                className="justify-center items-center flex-1"
                style={{backgroundColor: "rgba(0, 0, 0, 0.3)"}}
                onPress={close}
            >
                <TouchableWithoutFeedback>
                    <View className="rounded-lg p-4 w-4/5"
                          style={{backgroundColor: backgroundColor}}>
                        <FlatList
                            data={options}
                            keyExtractor={(item) => item}
                            renderItem={({item}) => (
                                <TouchableOpacity
                                    onPress={() => handleSelect(item)}
                                    className="py-3 border-b"
                                    style={{borderBottomColor: separatorColor}}
                                >
                                    <Text className=""
                                          style={{color: textColor}}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </Modal>
    );
};

export default DropdownModal;