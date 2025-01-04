import {BottomSheetView} from "@gorhom/bottom-sheet";
import {
    FlatList,
    Image, KeyboardAvoidingView,
    Modal, Platform,
    SafeAreaView,
    ScrollView, StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import React, {useCallback, useState} from "react";
import {useLocalSearchParams} from "expo-router";
import {useSupabase} from "@/context/SupabaseContext";
import {getRecurrenceDescription} from "@/utils/textUtils";
import {Colors} from "@/constants/Colors";

const NewTaskView = () => {

    const { id } = useLocalSearchParams<{ id?: string }>()

    const [taskName, setTaskName] = useState("");
    const [description, setDescription] = useState("");
    const [isRecurring, setIsRecurring] = useState();

    const [intervalValue, setIntervalValue] = useState("");
    const [intervalUnit, setIntervalUnit] = useState("");

    const [dayOfWeek, setDayOfWeek] = useState("");
    const [dateOfMonth, setDateOfMonth] = useState("");
    const [monthOfYear, setMonthOfYear] = useState("");

    const [seasonalTask, setSeasonalTask] = useState(false);
    const [seasonStart, setSeasonStart] = useState("");
    const [seasonEnd, setSeasonEnd] = useState("");

    const [isNextDueDate, setIsNextDueDate] = useState(true);
    const [timingOption, setTimingOption] = useState("auto"); // 'auto', 'previous', 'next'
    const [dueDate, setDueDate] = useState();
    const [lastCompletedAt, setLastCompletedAt] = useState("");
    const [completionWindow, setCompletionWindow] = useState();



    const [isIntervalUnitDropdownOpen, setIsIntervalUnitDropdownOpen] = useState(false);
    const [isWeekdayDropdownOpen, setIsWeekdayDropdownOpen] = useState(false);
    const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);

    const days = "day";
    const weeks = "week";
    const months = "month";
    const years = "year";

    const intervalOptions = [days, weeks, months, years];
    const weekdayOptions = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const dateOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
    const monthOptions = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const handleSelectIntervalUnit = (value) => {
        setIntervalUnit(value);
        setIsIntervalUnitDropdownOpen(false);
    };
    const handleSelectWeekday = (value) => {
        setDayOfWeek(value);
        setIsWeekdayDropdownOpen(false);
    };
    const handleSelectMonth = (value) => {
        setMonthOfYear(value);
        setIsMonthDropdownOpen(false);
    };

    const {createToDoTask} = useSupabase();

    // Create a new board and return to Collections page
    const onCreateToDoTask = async () => {
        if (!taskName.trim()) {
            alert('Please enter a task name.');
            return;
        }
        await createToDoTask(taskName.trim(), description, dueDate);
        onToDoTaskCreated(); // close the modal
    };

    return (
        <SafeAreaView className="flex-1">
            {/* Use KeyboardAvoidingView to adjust the layout when keyboard is visible */}
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}  // Adjust behavior based on platform
                style={{ flex: 1 }}
            >
                {/* Scrollable container */}
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"  // Ensures taps outside input fields close keyboard
            >
            <View className="w-full h-full" style={{backgroundColor: Colors.Complementary["300"]}}>
                <View className="px-5">


                <Text className="pt-5 text-2xl font-bold" style={{color: Colors.Complementary["800"]}}>New Task:</Text>

                {/* Task Name Input */}
                <View className="pt-2">
                    <Text className="text-sm my-1" style={{color: Colors.Primary["800"]}}>Task Name:</Text>
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

                {/* Task Description Input */}
                <View className="pt-2">
                    <Text className="text-sm my-1" style={{color: Colors.Primary["800"]}}>Task Description (Optional):</Text>
                    <TextInput
                        value={description}
                        placeholder="Additional Information About the Task"
                        onChangeText={setDescription}
                        className="rounded-lg p-2"
                        style={{ backgroundColor: Colors.Complementary["50"] }}
                        returnKeyType="done"
                        enterKeyHint="done"
                        autoFocus
                    />
                </View>

                {/* Recurring Toggle Switch */}
                <View className="pt-2 flex-row justify-between items-center">
                    <Text className="text-sm my-1" style={{ color: Colors.Primary["800"] }}>
                        Is this task recurring?
                    </Text>
                    <Switch value={isRecurring} onValueChange={setIsRecurring} />
                </View>

                {/* Conditional Fields for Recurring or Non-recurring */}
                {isRecurring ? (

                    <View>

                        <Text className="pt-2 text-sm" style={{ color: Colors.Primary["600"] }}>
                            {getRecurrenceDescription(intervalValue, intervalUnit, dayOfWeek, dateOfMonth, monthOfYear)}
                        </Text>

                        {/* Interval Input */}
                        <View className="flex-row items-center pt-5 gap-x-5 ">

                            {/* Interval Value Input Field */}
                            <View className="flex-1">
                                <Text className="text-sm my-1" style={{ color: Colors.Primary["800"] }}>
                                    Interval Value:
                                </Text>
                                <TextInput
                                    value={intervalValue}
                                    placeholder="Interval Value"
                                    onChangeText={setIntervalValue}
                                    className="rounded-lg p-2"
                                    style={{ backgroundColor: Colors.Complementary["50"] }}
                                />
                            </View>

                            {/* Interval Unit Input Field */}
                            <View className="flex-1">
                                <Text className="text-sm my-1" style={{ color: Colors.Primary["800"] }}>
                                    Interval Unit:
                                </Text>
                                <View className="flex-row items-center ">

                                    <TouchableOpacity
                                        onPress={() => setIsIntervalUnitDropdownOpen(true)}
                                        className="flex-1 rounded-lg p-2"
                                        style={{backgroundColor: Colors.Complementary["50"]}}
                                    >
                                        <Text style={{ color: Colors.Primary["800"] }}>{intervalUnit}</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Modal for Dropdown */}
                                <Modal
                                    visible={isIntervalUnitDropdownOpen}
                                    transparent
                                    animationType="fade"
                                    onRequestClose={() => setIsIntervalUnitDropdownOpen(false)}
                                >
                                    <TouchableOpacity
                                        className="justify-center items-center flex-1"
                                        style={{backgroundColor: "rgba(0, 0, 0, 0.3)"}}
                                        onPress={() => setIsIntervalUnitDropdownOpen(false)}
                                    >
                                        <View  className="rounded-lg p-4 w-4/5" style={{backgroundColor: Colors.Complementary["50"]}}>
                                            <FlatList
                                                data={intervalOptions}
                                                keyExtractor={(item) => item}
                                                renderItem={({ item }) => (
                                                    <TouchableOpacity
                                                        onPress={() => handleSelectIntervalUnit(item)}
                                                        className="py-3 border-b"
                                                        style={{borderBottomColor: Colors.Complementary["300"]}}
                                                    >
                                                        <Text className="" style={{color: Colors.Primary["800"]}}>{item}</Text>
                                                    </TouchableOpacity>
                                                )}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                </Modal>

                            </View>

                        </View>

                        {/* Conditional Fields Based on Interval Unit */}

                        {intervalUnit === weeks && (
                            <View className="flex-row pt-5 gap-x-5 items-center">
                                <Text className="text-sm my-1" style={{ color: Colors.Primary["800"] }}>
                                    Day of Week:
                                </Text>
                                <View className=" ">
                                    <TouchableOpacity
                                        onPress={() => setIsWeekdayDropdownOpen(true)}
                                        className=" rounded-lg p-2 px-5"
                                        style={{backgroundColor: Colors.Complementary["50"]}}
                                    >
                                        <Text style={{ color: Colors.Primary["800"] }}>{dayOfWeek != "" ? dayOfWeek : "Nothing Selected"}</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Modal for Weekday Dropdown */}
                                <Modal
                                    visible={isWeekdayDropdownOpen}
                                    transparent
                                    animationType="fade"
                                    onRequestClose={() => setIsWeekdayDropdownOpen(false)}
                                >
                                    <TouchableOpacity
                                        className="justify-center items-center flex-1"
                                        style={{backgroundColor: "rgba(0, 0, 0, 0.3)"}}
                                        onPress={() => setIsWeekdayDropdownOpen(false)}
                                    >
                                        <View  className="rounded-lg p-4 w-4/5" style={{backgroundColor: Colors.Complementary["50"]}}>
                                            <FlatList
                                                data={weekdayOptions}
                                                keyExtractor={(item) => item}
                                                renderItem={({ item }) => (
                                                    <TouchableOpacity
                                                        onPress={() => handleSelectWeekday(item)}
                                                        className="py-3 border-b"
                                                        style={{borderBottomColor: Colors.Complementary["300"]}}
                                                    >
                                                        <Text className="" style={{color: Colors.Primary["800"]}}>{item}</Text>
                                                    </TouchableOpacity>
                                                )}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                </Modal>

                            </View>
                        )}

                        {intervalUnit === months && (
                            <View className="flex-row pt-5 gap-x-5 items-center">
                                <Text className="text-sm my-1" style={{ color: Colors.Primary["800"] }}>
                                    Date of Month:
                                </Text>
                                <TextInput
                                    value={dateOfMonth}
                                    placeholder="Date of the month"
                                    onChangeText={setDateOfMonth}
                                    className="rounded-lg p-2"
                                    style={{ backgroundColor: Colors.Complementary["50"] }}
                                />
                            </View>
                        )}

                        {intervalUnit === years && (
                            <>
                                <View className="flex-row pt-5 gap-x-5 items-center">
                                    <Text className="text-sm" style={{ color: Colors.Primary["800"] }}>
                                        Month of Year:
                                    </Text>
                                    <View className=" ">
                                        <TouchableOpacity
                                            onPress={() => setIsMonthDropdownOpen(true)}
                                            className=" rounded-lg p-2 px-5"
                                            style={{backgroundColor: Colors.Complementary["50"]}}
                                        >
                                            <Text style={{ color: Colors.Primary["800"] }}>{monthOfYear != "" ? monthOfYear : "Nothing Selected"}</Text>
                                        </TouchableOpacity>
                                    </View>

                                    {/* Modal for Month Dropdown */}
                                    <Modal
                                        visible={isMonthDropdownOpen}
                                        transparent
                                        animationType="fade"
                                        onRequestClose={() => setIsMonthDropdownOpen(false)}
                                    >
                                        <TouchableOpacity
                                            className="justify-center items-center flex-1"
                                            style={{backgroundColor: "rgba(0, 0, 0, 0.3)"}}
                                            onPress={() => setIsMonthDropdownOpen(false)}
                                        >
                                            <View  className="rounded-lg p-4 w-4/5" style={{backgroundColor: Colors.Complementary["50"]}}>
                                                <FlatList
                                                    data={monthOptions}
                                                    keyExtractor={(item) => item}
                                                    renderItem={({ item }) => (
                                                        <TouchableOpacity
                                                            onPress={() => handleSelectMonth(item)}
                                                            className="py-3 border-b"
                                                            style={{borderBottomColor: Colors.Complementary["300"]}}
                                                        >
                                                            <Text className="" style={{color: Colors.Primary["800"]}}>{item}</Text>
                                                        </TouchableOpacity>
                                                    )}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    </Modal>
                                </View>

                                {monthOfYear && (
                                    <View className="flex-row pt-5 gap-x-5 items-center">
                                        <Text className="text-sm" style={{ color: Colors.Primary["800"] }}>
                                            Date of Month:
                                        </Text>
                                        <TextInput
                                            value={dateOfMonth}
                                            placeholder="Date of the month"
                                            onChangeText={setDateOfMonth}
                                            className="rounded-lg p-2"
                                            style={{ backgroundColor: Colors.Complementary["50"] }}
                                        />
                                    </View>
                                )}
                            </>
                        )}

                        {/* Seasonal Task */}
                        <View className="flex-row justify-between items-center pt-5">
                            <Text className="text-sm" style={{ color: Colors.Primary["800"] }}>
                                Is this task seasonal?
                            </Text>
                            <Switch value={seasonalTask} onValueChange={setSeasonalTask} />
                        </View>

                        {seasonalTask && (
                            <View>
                                {/* Season Start and End */}
                                <View className="flex-row pt-2 gap-x-5">
                                    <View style={{ flex: 1 }}>
                                        <Text className="text-sm my-1" style={{ color: Colors.Primary["800"] }}>
                                            From:
                                        </Text>
                                        <TextInput
                                            value={seasonStart}
                                            placeholder="Start Date"
                                            onChangeText={setSeasonStart}
                                            className="rounded-lg p-2"
                                            style={{ backgroundColor: Colors.Complementary["50"] }}
                                        />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text className="text-sm my-1" style={{ color: Colors.Primary["800"] }}>
                                            Until:
                                        </Text>
                                        <TextInput
                                            value={seasonEnd}
                                            placeholder="End Date"
                                            onChangeText={setSeasonEnd}
                                            className="rounded-lg p-2"
                                            style={{ backgroundColor: Colors.Complementary["50"] }}
                                        />
                                    </View>
                                </View>
                            </View>
                        )}



                    </View>

                ) : (
                    // Non-recurring task fields (Due Date + Completion Window)
                    <View>
                        <View className="flex-row items-center pt-5 gap-x-5">
                            <Text className="text-sm my-1" style={{ color: Colors.Primary["800"] }}>
                                Due Date:
                            </Text>
                            <TextInput
                                value={dueDate}
                                placeholder="Select Due Date"
                                onChangeText={setDueDate}
                                className="rounded-lg flex-1 p-2"
                                style={{ backgroundColor: Colors.Complementary["50"] }}
                            />
                        </View>

                        {dueDate && (
                            <View className="flex-row items-center pt-5 gap-x-5">
                                <Text className="text-sm my-1" style={{ color: Colors.Primary["800"] }}>
                                    Completion Window:
                                </Text>
                                <TextInput
                                    value={completionWindow}
                                    placeholder="Enter Completion Window"
                                    onChangeText={setCompletionWindow}
                                    className="rounded-lg p-2"
                                    style={{ backgroundColor: Colors.Complementary["50"] }}
                                />
                            </View>
                        )}
                    </View>
                )}


                    <View>
                        <Text className="text-sm my-1 pt-5" style={{ color: Colors.Primary["800"] }}>
                            How should the next due date be determined?
                        </Text>

                        {/* Timing Options */}
                        <View className="flex-row justify-between pt-3 gap-x-2">
                            <TouchableOpacity
                                className={`py-2 px-4 rounded-lg ${timingOption === "previous" ? "bg-blue-500" : "bg-gray-300"}`}
                                onPress={() => setTimingOption("previous")}
                            >
                                <Text className="text-xs" style={{ color: timingOption === "previous" ? "white" : "black" }}>Previously Completed</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className={`py-2 px-4 rounded-lg ${timingOption === "next" ? "bg-blue-500" : "bg-gray-300"}`}
                                onPress={() => setTimingOption("next")}
                            >
                                <Text className="text-xs" style={{ color: timingOption === "next" ? "white" : "black" }}>Next Due</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className={`py-2 px-4 rounded-lg ${timingOption === "auto" ? "bg-blue-500" : "bg-gray-300"}`}
                                onPress={() => setTimingOption("auto")}
                            >
                                <Text className="text-xs" style={{ color: timingOption === "auto" ? "white" : "black" }}>Auto-Calculate</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Input Fields Based on Selection */}
                        {timingOption === "previous" && (
                            <View className="pt-5">
                                <Text className="text-sm text-gray-600">
                                    Next due date will be calculated from the last completion.
                                </Text>
                                <Text className="text-sm my-1 pt-2" style={{ color: Colors.Primary["800"] }}>
                                    Enter Last Completion Date:
                                </Text>
                                <TextInput
                                    value={lastCompletedAt}
                                    placeholder="YYYY-MM-DD"
                                    onChangeText={setLastCompletedAt}
                                    className="rounded-lg p-2"
                                    style={{ backgroundColor: Colors.Complementary["50"] }}
                                />
                            </View>
                        )}

                        {timingOption === "next" && (
                            <View className="pt-5">
                                <Text className="text-sm my-1" style={{ color: Colors.Primary["800"] }}>
                                    Enter Next Due Date:
                                </Text>
                                <TextInput
                                    value={dueDate}
                                    placeholder="YYYY-MM-DD"
                                    onChangeText={setDueDate}
                                    className="rounded-lg p-2"
                                    style={{ backgroundColor: Colors.Complementary["50"] }}
                                />
                            </View>
                        )}

                        {timingOption === "auto" && (
                            <View className="pt-5">
                                <Text className="text-sm text-gray-600">
                                    Next due date will be calculated automatically from the current moment.
                                </Text>
                            </View>
                        )}
                    </View>


                {/*/!*Due Date Input*!/*/}
                {/*<View className="flex-row items-center pt-5 gap-x-2 ">*/}
                {/*    <Text className="text-sm " style={{color: Colors.Primary["800"]}}>Due Date:</Text>*/}
                {/*    /!* Input for updating the collection name *!/*/}
                {/*    <TextInput*/}
                {/*        value={dueDate}*/}
                {/*        placeholder="Select Due Date"*/}
                {/*        onChangeText={setDueDate}*/}
                {/*        className="rounded-lg flex-1 p-2"*/}
                {/*        style={{ backgroundColor: Colors.Complementary["50"] }}*/}
                {/*        returnKeyType="done"*/}
                {/*        enterKeyHint="done"*/}
                {/*        autoFocus*/}
                {/*    />*/}
                {/*</View>*/}

                <View className="items-center pt-10 pb-10">
                    <TouchableOpacity
                        className="py-2 px-8 mx-16 rounded-xl items-center"
                        style={{backgroundColor: Colors.Complementary["700"]}}
                        onPress={() => onCreateToDoTask()}
                    >
                        <Text style={{color: Colors.Complementary["100"]}}>Create Task</Text>
                    </TouchableOpacity>
                </View>

                </View>
            </View>
            </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default NewTaskView;