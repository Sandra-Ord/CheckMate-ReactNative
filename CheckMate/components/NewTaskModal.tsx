import {BottomSheetView} from "@gorhom/bottom-sheet";
import {Image, Text, TextInput, TouchableOpacity} from "react-native";
import React from "react";
import "../global.css"




const NewTaskModal = (collectionId: number) => {


    return (
        <BottomSheetView className="p-5 gap-10">
            <TextInput>
                todo
            </TextInput>
        </BottomSheetView>
    );
};

export default NewTaskModal;