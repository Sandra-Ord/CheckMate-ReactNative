import {
    FlatList,
    KeyboardAvoidingView,
    Modal, Platform,
    SafeAreaView,
    ScrollView,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import React, {useCallback, useEffect, useState} from "react";
import {useLocalSearchParams, useRouter, Stack, useFocusEffect} from "expo-router";
import {useSupabase} from "@/context/SupabaseContext";
import {getRecurrenceDescription} from "@/utils/textUtils";
import {Colors} from "@/constants/Colors";
import {Task} from "@/types/enums";
import Ionicons from "@expo/vector-icons/Ionicons";
import ActionButton from "@/components/uiComponents/ActionButton";
import HorizontalInputField from "@/components/uiComponents/HorizontalInput";
import VerticalInputField from "@/components/uiComponents/VerticalInput";
import SwitchInput from "@/components/uiComponents/SwitchInput";
import CustomVerticalInput from "@/components/uiComponents/CustomVerticalInput";
import DropdownModal from "@/components/uiComponents/DropdownModal";
import CustomHorizontalInput from "@/components/uiComponents/CustomHorizontalnput";

const NewTaskView = () => {

    // todo get collection id from search params for new task

    const router = useRouter();
    const {collectionId} = useLocalSearchParams<{ collectionId?: string }>()
    const {id} = useLocalSearchParams<{ id?: string }>()
    console.log(collectionId);

    const {
        getTaskInformation,
        createTask,
        updateTask,
        archiveTask,
        unArchiveTask,
        deleteTask
    } = useSupabase();

    const [task, setTask] = useState<Task>();
    console.log("Task name" + task?.name)
    const [taskName, setTaskName] = useState("");
    const [description, setDescription] = useState("");
    const [isRecurring, setIsRecurring] = useState<boolean>(true);
    const [skipMissedDueDates, setSkipMissedDueDates] = useState<boolean>(true);

    const [intervalValue, setIntervalValue] = useState();
    const [intervalUnit, setIntervalUnit] = useState("");

    const [dayOfWeek, setDayOfWeek] = useState("");
    const [dateOfMonth, setDateOfMonth] = useState("");
    const [monthOfYear, setMonthOfYear] = useState("");

    const [seasonalTask, setSeasonalTask] = useState<boolean>(false);
    const [seasonStart, setSeasonStart] = useState("");
    const [seasonEnd, setSeasonEnd] = useState("");

    const [timingOption, setTimingOption] = useState("auto"); // 'auto', 'previous', 'next'
    const [dueDate, setDueDate] = useState("");
    const [lastCompletedAt, setLastCompletedAt] = useState("");
    const [completionWindow, setCompletionWindow] = useState(null);

    const [isIntervalUnitDropdownOpen, setIsIntervalUnitDropdownOpen] = useState(false);
    const [isWeekdayDropdownOpen, setIsWeekdayDropdownOpen] = useState(false);
    const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);

    const [showSkipMissedDueDatesInfo, setShowSkipMissedDueDatesInfo] = useState<boolean>(false);
    const [showCompletionWindowsInfo, setShowCompletionWindowsInfo] = useState<boolean>(false);

    // -----------------------------------------------------------------------------------------------------------------
    // -------------------------------------------- TEMP CONSTANTS -----------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------

    const days = "day";
    const weeks = "week";
    const months = "month";
    const years = "year";

    const intervalOptions = [days, weeks, months, years];
    const weekdayOptions = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const dateOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
    const monthOptions = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // -----------------------------------------------------------------------------------------------------------------
    // ------------------------------------------ CLOSE MODALS ---------------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------

    const handleIntervalInput = (txt) => {
        const numericValue = txt.replace(/[^0-9]/g, '');
        const nonNegativeValue = numericValue === '' ? '' : Math.max(0, parseInt(numericValue, 10));
        setIntervalValue(nonNegativeValue.toString());
    }

    const handleCompletionWindowInput = (txt) => {
        const numericValue = txt.replace(/[^0-9]/g, '');
        const nonNegativeValue = numericValue === '' ? '' : Math.max(0, parseInt(numericValue, 10));
        setCompletionWindow(nonNegativeValue.toString());
    }

    const handleDateOfMonthInput = (txt) => {
        const numericValue = txt.replace(/[^0-9]/g, '');

        let clampedValue = parseInt(numericValue, 10);
        if (!isNaN(clampedValue)) {
            clampedValue = Math.max(1, Math.min(clampedValue, 31));
        } else {
            clampedValue = '';
        }

        setDateOfMonth(clampedValue.toString());
    }

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

    // -----------------------------------------------------------------------------------------------------------------
    // -------------------------------------------------- HANDLE CRUD METHODS ------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------

    const onCreateTask = async () => {
        if (!taskName.trim()) {
            alert('Please enter a task name.');
            return;
        }
        const newTask = {
            collection_id: collectionId,
            name: taskName.trim(),
            description: description?.trim() || null,
            recurring: isRecurring,
            interval_value: intervalValue ? parseInt(intervalValue) : null,
            interval_unit: intervalUnit || null,
            day_of_week: dayOfWeek ? weekdayOptions.indexOf(dayOfWeek) : null,
            date_of_month: dateOfMonth ? parseInt(dateOfMonth) : null,
            month_of_year: monthOfYear ? monthOptions.indexOf(monthOfYear) : null,
            season_start: seasonStart || null,
            season_end: seasonEnd || null,
            last_completed_at: lastCompletedAt || null,
            completion_window_days: completionWindow !== null ? parseInt(completionWindow) : null,
            next_due_at: dueDate || null,
            assigned_to_user_id: null, // Assuming no user is assigned by default
        };

        await createTask(newTask);
        router.back();
    };


    const onUpdateTask = async () => {
        if (!task) {
            alert('You are in edit mode without a task');
            router.back();
            return;
        }
        if (!taskName.trim()) {
            alert('Please enter a task name.');
            return;
        }
        task.name = taskName.trim();
        task.description = description ? description.trim() : null;
        task.recurring = isRecurring;
        task.interval_value = intervalValue ? parseInt(intervalValue) : null;
        task.interval_unit = intervalUnit;
        task.day_of_week = dayOfWeek ? weekdayOptions.indexOf(dayOfWeek) : null;
        task.date_of_month = dateOfMonth ? parseInt(dateOfMonth) : null;
        task.month_of_year = monthOfYear ? monthOptions.indexOf(monthOfYear) : null;
        task.season_start = seasonStart ? seasonStart : null;
        task.season_end = seasonEnd ? seasonEnd : null;
        task.last_completed_at = lastCompletedAt ? lastCompletedAt : null;
        task.completion_window_days = completionWindow !== null ? parseInt(completionWindow) : null;
        task.next_due_at = dueDate ? dueDate : null;
        await updateTask(task);
        router.back();
    };

    const onDeleteTask = async () => {
        await deleteTask(task.id);
        router.back();
    }

    const onArchiveTask = async () => {
        await archiveTask(task.id);
        router.back();
    }

    const onUnarchiveTask = async () => {
        await unArchiveTask(task.id);
        router.back();
    }

    const loadTask = async () => {
        if (!id) return;
        const task: Task = await getTaskInformation!(id);
        setTask(task);

        setTaskName(task.name);
        setDescription(task.description);
        setIsRecurring(task.recurring);

        setIntervalValue(task.interval_value?.toString());
        setIntervalUnit(task.interval_unit);

        setDayOfWeek(task.day_of_week);
        setDateOfMonth(task.date_of_month?.toString());
        setMonthOfYear(task.month_of_year);

        if (task.season_start !== null && task.season_end !== null) {
            setSeasonalTask(true);
        }
        setSeasonStart(task.season_start?.toString());
        setSeasonEnd(task.season_end?.toString());

        setDueDate(task.next_due_at);
        setLastCompletedAt(task.last_completed_at);
        setCompletionWindow(task.completion_window_days);
    };

    // If the modal is opened in edit more

    useFocusEffect(
        useCallback(() => {
            if (id) {
                loadTask();
            }
        }, [])
    );

    return (
        <SafeAreaView className="flex-1">


            <Stack.Screen
                options={{
                    headerTitle: task == null ? 'New Task:' : `Edit ${task.name}:`,
                }}
            />

            {/* Use KeyboardAvoidingView to adjust the layout when keyboard is visible */}
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}  // Adjust behavior based on platform
                style={{flex: 1}}
            >
                {/* Scrollable container */}
                <ScrollView
                    contentContainerStyle={{flexGrow: 1}}
                    keyboardShouldPersistTaps="handled"  // Ensures taps outside input fields close keyboard
                >
                    <View className="w-full h-full" style={{backgroundColor: Colors.Complementary["300"]}}>
                        <View className="px-5 py-5">


                            <View className="gap-y-2">

                                <Text className="text-2xl font-bold"
                                      style={{color: Colors.Complementary["800"]}}>
                                    {`${task === null ? "New Task:" : "Edit Task:"}`}
                                </Text>

                                {/* Task Name Input */}
                                <VerticalInputField
                                    labelText="Task Name:"
                                    placeholder="New Task's Name"
                                    value={taskName}
                                    onChangeText={setTaskName}
                                />

                                {/* Task Description Input */}
                                <VerticalInputField
                                    labelText="Task Description (Optional):"
                                    placeholder="Additional Information About the Task"
                                    value={description}
                                    onChangeText={setDescription}
                                    multiline={true}
                                />

                                {/* Recurring Toggle Switch */}
                                <SwitchInput
                                    labelText="Is this task recurring?"
                                    value={isRecurring}
                                    onValueChange={setIsRecurring}
                                />

                                {/* Conditional Fields for Recurring or Non-recurring */}
                                {isRecurring ? (
                                    <>
                                        <Text className="text-sm" style={{color: Colors.Primary["600"]}}>
                                            {getRecurrenceDescription(intervalValue, intervalUnit, dayOfWeek, dateOfMonth, monthOfYear)}
                                        </Text>

                                        {/* Interval Input */}
                                        <View className="flex-row items-center gap-x-5">

                                            {/* Interval Value Input Field */}
                                            <View className="flex-1">
                                                <VerticalInputField
                                                    labelText="Interval Value:"
                                                    placeholder="Interval Value"
                                                    value={intervalValue}
                                                    onChangeText={handleIntervalInput}
                                                    keyboardType="numeric"
                                                />
                                            </View>

                                            {/* Interval Unit Input Field */}
                                            <View className="flex-1">
                                                <CustomVerticalInput
                                                    labelText="Interval Unit:"
                                                    value={intervalUnit}
                                                    handlePress={() => setIsIntervalUnitDropdownOpen(true)}
                                                />
                                                <DropdownModal
                                                    isVisible={isIntervalUnitDropdownOpen}
                                                    close={() => setIsIntervalUnitDropdownOpen(false)}
                                                    options={intervalOptions}
                                                    handleSelect={handleSelectIntervalUnit}
                                                />
                                            </View>

                                        </View>

                                        {/* Conditional Fields Based on Interval Unit */}

                                        {intervalUnit === weeks && (
                                            <>
                                                <CustomHorizontalInput
                                                    labelText="Day of Week:"
                                                    value={dayOfWeek != "" ? dayOfWeek : "Nothing Selected"}
                                                    handlePress={() => setIsWeekdayDropdownOpen(true)}
                                                />
                                                <DropdownModal
                                                    isVisible={isWeekdayDropdownOpen}
                                                    close={() => setIsWeekdayDropdownOpen(false)}
                                                    options={weekdayOptions}
                                                    handleSelect={handleSelectWeekday}
                                                />
                                            </>
                                        )}

                                        {intervalUnit === years && (
                                            <>
                                                <CustomHorizontalInput
                                                    labelText="Month of Year:"
                                                    value={monthOfYear != "" ? monthOfYear : "Nothing Selected"}
                                                    handlePress={() => setIsMonthDropdownOpen(true)}
                                                />
                                                <DropdownModal
                                                    isVisible={isMonthDropdownOpen}
                                                    close={() => setIsMonthDropdownOpen(false)}
                                                    options={monthOptions}
                                                    handleSelect={handleSelectMonth}
                                                />
                                            </>
                                        )}

                                        {(intervalUnit === months || (intervalUnit === years && monthOfYear)) && (
                                            <HorizontalInputField
                                                labelText="Date of Month:"
                                                placeholder="Date of Month"
                                                value={dateOfMonth}
                                                onChangeText={handleDateOfMonthInput}
                                                keyboardType="numeric"
                                            />

                                        )}

                                        {/* Seasonal Task */}
                                        {intervalUnit !== null && intervalUnit !== years && (
                                            <View className="gap-y-64">
                                                <SwitchInput
                                                    labelText="Is this task seasonal?"
                                                    value={seasonalTask}
                                                    onValueChange={setSeasonalTask}
                                                />

                                                {seasonalTask && (
                                                    <View className="flex-row items-center gap-x-5">
                                                        {/* Season Start and End */}
                                                        <View className="flex-1">
                                                            <VerticalInputField
                                                                labelText="From:"
                                                                placeholder="YYYY-MM-DD"
                                                                value={seasonStart}
                                                                onChangeText={setSeasonStart}
                                                            />
                                                        </View>
                                                        <View className="flex-1">
                                                            <VerticalInputField
                                                                labelText="Until:"
                                                                placeholder="YYYY-MM-DD"
                                                                value={seasonEnd}
                                                                onChangeText={setSeasonEnd}
                                                            />
                                                        </View>
                                                    </View>
                                                )}
                                            </View>
                                        )}

                                        {/* Skip missed due dates Toggle Switch */}
                                        <View className="flex-row justify-between items-center">
                                            <TouchableOpacity className="flex-row "
                                                              onPress={() => setShowSkipMissedDueDatesInfo(!showSkipMissedDueDatesInfo)}>

                                                <Text className="text-sm" style={{color: Colors.Primary["800"]}}>
                                                    Skip missed due dates: &nbsp;
                                                </Text>
                                                <Ionicons name="information-circle-outline" size={10} style={{}}/>

                                            </TouchableOpacity>
                                            <Switch value={skipMissedDueDates} onValueChange={setSkipMissedDueDates}/>
                                        </View>
                                        {showSkipMissedDueDatesInfo && (
                                            <View>
                                                <Text className="text-xs italic" style={{color: Colors.Primary["600"]}}>
                                                    If skipping missed due dates, then upon completing a task, the next
                                                    due date will be calculated to happen after the completing date
                                                    (skipping due dates in between).
                                                    Otherwise, the next due date will be calculated from the previous
                                                    due date.
                                                </Text>
                                            </View>
                                        )}


                                        <View>
                                            <Text className="text-sm my-1 pt-5" style={{color: Colors.Primary["800"]}}>
                                                How should the next due date be determined?
                                            </Text>

                                            {/* Timing Options */}
                                            <View className="flex-row justify-between pt-3 gap-x-2">
                                                <TouchableOpacity
                                                    className={`py-2 px-4 rounded-lg ${timingOption === "previous" ? "bg-blue-500" : "bg-gray-300"}`}
                                                    onPress={() => setTimingOption("previous")}
                                                >
                                                    <Text className="text-xs"
                                                          style={{color: timingOption === "previous" ? "white" : "black"}}>Previously
                                                        Completed</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    className={`py-2 px-4 rounded-lg ${timingOption === "next" ? "bg-blue-500" : "bg-gray-300"}`}
                                                    onPress={() => setTimingOption("next")}
                                                >
                                                    <Text className="text-xs"
                                                          style={{color: timingOption === "next" ? "white" : "black"}}>Next
                                                        Due</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    className={`py-2 px-4 rounded-lg ${timingOption === "auto" ? "bg-blue-500" : "bg-gray-300"}`}
                                                    onPress={() => setTimingOption("auto")}
                                                >
                                                    <Text className="text-xs"
                                                          style={{color: timingOption === "auto" ? "white" : "black"}}>Auto-Calculate</Text>
                                                </TouchableOpacity>
                                            </View>

                                            {/* Input Fields Based on Selection */}
                                            {timingOption === "previous" && (
                                                <View className="pt-5">
                                                    <Text className="text-sm text-gray-600">
                                                        Next due date will be calculated from the last completion.
                                                    </Text>
                                                    <Text className="text-sm my-1 pt-2"
                                                          style={{color: Colors.Primary["800"]}}>
                                                        Enter Last Completion Date:
                                                    </Text>
                                                    <TextInput
                                                        value={lastCompletedAt}
                                                        placeholder="YYYY-MM-DD"
                                                        onChangeText={setLastCompletedAt}
                                                        className="rounded-lg p-2"
                                                        style={{backgroundColor: Colors.Complementary["50"]}}
                                                    />
                                                </View>
                                            )}

                                            {timingOption === "next" && (
                                                <View className="pt-5">
                                                    <Text className="text-sm my-1"
                                                          style={{color: Colors.Primary["800"]}}>
                                                        Enter Next Due Date:
                                                    </Text>
                                                    <TextInput
                                                        value={dueDate}
                                                        placeholder="YYYY-MM-DD"
                                                        onChangeText={setDueDate}
                                                        className="rounded-lg p-2"
                                                        style={{backgroundColor: Colors.Complementary["50"]}}
                                                    />
                                                </View>
                                            )}

                                            {timingOption === "auto" && (
                                                <View className="pt-5">
                                                    <Text className="text-sm text-gray-600">
                                                        Next due date will be calculated automatically from the current
                                                        moment.
                                                    </Text>
                                                </View>
                                            )}
                                        </View>

                                    </>

                                ) : (
                                    // Non-recurring task fields (Due Date + Completion Window)
                                    <View>

                                        <HorizontalInputField
                                            labelText="Due Date:"
                                            placeholder="Select Due Date"
                                            value={dueDate}
                                            onChangeText={setDueDate}
                                            inputBackgroundColor={Colors.Complementary['50']}
                                            textColor={Colors.Primary['800']}
                                        />

                                    </View>
                                )}

                                {/*Completion Window Input*/}
                                {(dueDate || isRecurring) && (
                                    <>
                                        <View className="flex-row gap-x-5 items-center">
                                            <TouchableOpacity className="flex-row"
                                                              onPress={() => setShowCompletionWindowsInfo(!showCompletionWindowsInfo)}>
                                                <Text className="text-sm" style={{color: Colors.Primary["800"]}}>
                                                    Completion Window:
                                                </Text>
                                                <Ionicons name="information-circle-outline" size={10} style={{}}/>
                                            </TouchableOpacity>
                                            <TextInput
                                                value={completionWindow}
                                                placeholder="Enter Completion Window"
                                                onChangeText={handleCompletionWindowInput}
                                                className="rounded-lg flex-1 p-2"
                                                style={{backgroundColor: Colors.Complementary["50"]}}
                                                keyboardType="numeric"
                                                returnKeyType="done"
                                                enterKeyHint="done"
                                            />
                                        </View>
                                        {showCompletionWindowsInfo && (
                                            <View>
                                                <Text className="text-xs italic" style={{color: Colors.Primary["600"]}}>
                                                    The amount of days before the due date, that the task is available
                                                    for completion.
                                                </Text>
                                            </View>
                                        )}
                                    </>
                                )}

                                {task ?
                                    <View className="gap-y-5">
                                        <View className="flex-row items-center justify-between px-5 pt-10">
                                            <ActionButton
                                                onPress={onUpdateTask}
                                                iconName={"checkmark-circle-outline"}
                                                text={"Update"}
                                                textColor={Colors.Complementary["100"]}
                                                buttonColor={Colors.Yellow["600"]}
                                            />
                                            <ActionButton
                                                onPress={onDeleteTask}
                                                iconName={"trash-bin-outline"}
                                                text={"Delete"}
                                                textColor={Colors.Complementary["100"]}
                                                buttonColor={Colors.Red["600"]}
                                            />
                                        </View>

                                        <View className="flex-row items-center justify-center px-5 pb-10">
                                            <ActionButton
                                                onPress={() => {
                                                    if (task.archived_at === null) {
                                                        onArchiveTask();
                                                    } else {
                                                        onUnarchiveTask();
                                                    }
                                                }}
                                                iconName={task.archived_at === null ? "archive-outline" : "arrow-up-circle-outline"}
                                                text={task.archived_at === null ? "Archive" : "Unarchive"}
                                                textColor={Colors.Complementary["100"]}
                                                buttonColor={Colors.Blue["600"]}
                                            />
                                        </View>

                                    </View>
                                    :
                                    <View className="items-center pt-10 pb-10">
                                        <ActionButton
                                            onPress={onCreateTask}
                                            iconName={"add-outline"}
                                            text={"Create Task"}
                                            textColor={Colors.Complementary["100"]}
                                            buttonColor={Colors.Complementary["600"]}
                                        />
                                    </View>
                                }
                            </View>


                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
        ;
};

export default NewTaskView;