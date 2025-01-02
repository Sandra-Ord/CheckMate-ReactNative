import {BottomSheetView} from "@gorhom/bottom-sheet";
import {Text, TextInput, TouchableOpacity, View} from "react-native";
import React, {useState} from "react";
import "../global.css"
import {Colors} from "@/constants/Colors.ts";
import {useSupabase} from "@/context/SupabaseContext.tsx";


const NewToDoTaskModal = ({ onToDoTaskCreated }: { onToDoTaskCreated: () => void }) => {

    const [taskName, setTaskName] = useState();
    const [comment, setComment] = useState();
    const [dueDate, setDueDate] = useState();
    const [tags, setTags] = useState<[]>();

    const {createToDoTask} = useSupabase();

    // Create a new board and return to Collections page
    const onCreateToDoTask = async () => {
        if (!taskName.trim()) {
            alert('Please enter a task name.');
            return;
        }
        await createToDoTask(taskName.trim(), comment, dueDate);
        onToDoTaskCreated(); // close the modal
    };

    return (
        <BottomSheetView className="px-5 ">

            {/*Task Name Input*/}
            <View className="pt-5">
                <Text className="text-sm my-2" style={{color: Colors.Primary["800"]}}>Task Name:</Text>
                {/* Input for updating the task name */}
                <TextInput
                    value={taskName}
                    placeholder="New Task's Name"
                    onChangeText={setTaskName}
                    className="rounded-lg p-2"
                    style={{ backgroundColor: Colors.Complementary["50"] }}
                    returnKeyType="done"
                    enterKeyHint="done"
                    autoFocus
                />
            </View>

            {/*Task Comment Input*/}
            <View className="pt-5">
                <Text className="text-sm my-2" style={{color: Colors.Primary["800"]}}>Task Description (Optional):</Text>
                {/* Input for updating the collection name */}
                <TextInput
                    value={comment}
                    placeholder="Additional Information About the Task"
                    onChangeText={setComment}
                    className="rounded-lg p-2"
                    style={{ backgroundColor: Colors.Complementary["50"] }}
                    returnKeyType="done"
                    enterKeyHint="done"
                    autoFocus
                />
            </View>

            {/*Due Date Input*/}
            <View className="flex-row items-center pt-5 gap-x-2 ">
                <Text className="text-sm " style={{color: Colors.Primary["800"]}}>Due Date:</Text>
                {/* Input for updating the collection name */}
                <TextInput
                    value={dueDate}
                    placeholder="Select Due Date"
                    onChangeText={setDueDate}
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
                    onPress={() => onCreateToDoTask()}
                >
                    <Text style={{color: Colors.Complementary["100"]}}>Create Task</Text>
                </TouchableOpacity>
            </View>


        </BottomSheetView>
    );
};

export default NewToDoTaskModal;