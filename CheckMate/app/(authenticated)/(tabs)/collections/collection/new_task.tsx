import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import React, {useCallback, useState} from "react";
import {useLocalSearchParams, useRouter, Stack, useFocusEffect} from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useSupabase} from "@/context/SupabaseContext";
import {getRecurrenceDescription} from "@/utils/textUtils";
import {days, intervalOptions, monthOptions, months, weekdayOptions, weeks, years} from "@/utils/intervalUtils";
import {Colors} from "@/constants/Colors";
import {Task} from "@/types/enums";
import ActionButton from "@/components/uiComponents/ActionButton";
import HorizontalInputField from "@/components/uiComponents/HorizontalInput";
import VerticalInputField from "@/components/uiComponents/VerticalInput";
import SwitchInput from "@/components/uiComponents/SwitchInput";
import CustomVerticalInput from "@/components/uiComponents/CustomVerticalInput";
import DropdownModal from "@/components/uiComponents/DropdownModal";
import CustomHorizontalInput from "@/components/uiComponents/CustomHorizontalnput";
import {calculateCompletionStartDateString, calculateNextDueDate} from "@/utils/taskDateUtils";
import CalendarInput from "@/components/uiComponents/CalendarInput";

const NewTaskView = () => {

    // todo get collection id from search params for new task

    const router = useRouter();
    const {collectionId} = useLocalSearchParams<{ collectionId?: string }>()
    const {id} = useLocalSearchParams<{ id?: string }>()

    const {
        getTaskInformation,
        createTask,
        updateTask,
        archiveTask,
        unArchiveTask,
        deleteTask
    } = useSupabase();

    const [task, setTask] = useState<Task>();
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

    const [adjustDates, setAdjustDates] = useState<boolean>(false);
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
    // ------------------------------------------ HANDLE INPUTS --------------------------------------------------------
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
    // ------------------------------------------ HANDLE CALENDARS -----------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------

    const [seasonStartCalendarVisible, setSeasonStartCalendarVisible] = useState(false);
    const [seasonEndCalendarVisible, setSeasonEndCalendarVisible] = useState(false);
    const [lastCompletedCalendarVisible, setLastCompletedCalendarVisible] = useState(false);
    const [dueDateCalendarVisible, setDueDateCalendarVisible] = useState(false);

    const handleSelectSeasonStart = (value) => {
        if (value) {
            const formattedDate = value.toISOString();
            setSeasonStart(formattedDate);
        } else {
            setSeasonStart(null);
        }
        setSeasonStartCalendarVisible(false);
    }
    const handleSelectSeasonEnd = (value) => {
        if (value) {
            const formattedDate = value.toISOString();
            setSeasonEnd(formattedDate);
        } else {
            setSeasonEnd(null);
        }
        setSeasonEndCalendarVisible(false);
    }

    const handleSelectLastCompleted = (value) => {
        if (value) {
            const formattedDate = value.toISOString();
            setLastCompletedAt(formattedDate);
        } else {
            setLastCompletedAt(null);
        }
        setLastCompletedCalendarVisible(false);
    }
    const handleSelectDueDate = (value) => {
        if (value) {
            const formattedDate = value.toISOString();
            setDueDate(formattedDate);
        } else {
            setDueDate(null);
        }
        setDueDateCalendarVisible(false);
    }

    // -----------------------------------------------------------------------------------------------------------------
    // -------------------------------------------- DATABASE OPERATIONS ------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------

    const onCreateTask = async () => {
        if (!taskName.trim()) {
            alert('Please enter a task name.');
            return;
        }
        console.log(taskName)
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
            skip_missed_due_dates: skipMissedDueDates,
        };

        if (isRecurring && (!intervalValue || !intervalUnit)) {
            alert('Please enter an interval value and choose a unit.');
            return;
        }
        if (!isRecurring) {
            newTask.recurring = false;
            newTask.interval_value = null;
            newTask.interval_unit = null;
            newTask.day_of_week = null;
            newTask.date_of_month = null;
            newTask.month_of_year = null;
            newTask.skip_missed_due_dates = false;
        } else {
            newTask.recurring = true;
            newTask.interval_value = intervalValue ? parseInt(intervalValue) : null;
            newTask.interval_unit = intervalUnit;

            if (intervalUnit == days) {
                newTask.day_of_week = null;
                newTask.date_of_month = null;
                newTask.month_of_year = null;
            } else if (intervalUnit == weeks) {
                newTask.day_of_week = dayOfWeek ? weekdayOptions.indexOf(dayOfWeek) : null;
                newTask.date_of_month = null;
                newTask.month_of_year = null;
            } else if (intervalUnit == months) {
                newTask.day_of_week = null;
                newTask.date_of_month = dateOfMonth ? parseInt(dateOfMonth) : null;
                newTask.month_of_year = monthOfYear ? monthOptions.indexOf(monthOfYear) : null;
            } else if (intervalUnit == years) {
                newTask.day_of_week = null;
                newTask.date_of_month = dateOfMonth ? parseInt(dateOfMonth) : null;
                newTask.month_of_year = monthOfYear ? monthOptions.indexOf(monthOfYear) : null;
            }
        }

        if (!isRecurring || !seasonalTask || intervalUnit === years) {
            newTask.season_start = null;
            newTask.season_end = null;
        } else {
            newTask.season_start = seasonStart ? seasonStart : null;
            newTask.season_end = seasonEnd ? seasonEnd : null;
        }
        if (!dueDate && !isRecurring) {
            newTask.completion_window_days = null;
        } else {
            newTask.completion_window_days = completionWindow !== null ? parseInt(completionWindow) : null;
        }

        if (timingOption === "previous") {
            newTask.last_completed_at = lastCompletedAt;
            newTask.next_due_at = null;
            newTask.next_due_at = calculateNextDueDate(task, lastCompletedAt);
        } else if (timingOption === "next") {
            newTask.last_completed_at = null;
            newTask.next_due_at = dueDate ? dueDate : null;
        } else if (timingOption === "auto") {
            newTask.last_completed_at = null;
            newTask.next_due_at = null;
            newTask.next_due_at = calculateNextDueDate(newTask, new Date());
        }

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
        if (isRecurring && (!intervalValue || !intervalUnit)) {
            alert('Please enter an interval value and choose a unit.');
            return;
        }
        if (!isRecurring) {
            task.recurring = false;
            task.interval_value = null;
            task.interval_unit = null;
            task.day_of_week = null;
            task.date_of_month = null;
            task.month_of_year = null;
        } else {
            task.recurring = true;
            task.interval_value = intervalValue ? parseInt(intervalValue) : null;
            task.interval_unit = intervalUnit;

            if (intervalUnit == days) {
                task.day_of_week = null;
                task.date_of_month = null;
                task.month_of_year = null;
            } else if (intervalUnit == weeks) {
                task.day_of_week = dayOfWeek ? weekdayOptions.indexOf(dayOfWeek) : null;
                task.date_of_month = null;
                task.month_of_year = null;
            } else if (intervalUnit == months) {
                task.day_of_week = null;
                task.date_of_month = dateOfMonth ? parseInt(dateOfMonth) : null;
                task.month_of_year = monthOfYear ? monthOptions.indexOf(monthOfYear) : null;
            } else if (intervalUnit == years) {
                task.day_of_week = null;
                task.date_of_month = dateOfMonth ? parseInt(dateOfMonth) : null;
                task.month_of_year = monthOfYear ? monthOptions.indexOf(monthOfYear) : null;
            }
        }
        
        if (!isRecurring || !seasonalTask || intervalUnit === years) {
            task.season_start = null;
            task.season_end = null;
        } else {
            task.season_start = seasonStart ? seasonStart : null;
            task.season_end = seasonEnd ? seasonEnd : null;
        }

        task.completion_window_days = completionWindow !== null ? parseInt(completionWindow) : null;

        if (adjustDates) {
            const last_completed_at_date = task.last_completed_at;
            if (timingOption === "previous") {
                task.last_completed_at = lastCompletedAt;
                task.next_due_at = null;
                task.next_due_at = calculateNextDueDate(task, lastCompletedAt);
            } else if (timingOption === "next") {
                task.last_completed_at = null;
                task.next_due_at = dueDate ? dueDate : null;
                task.last_completed_at = last_completed_at_date;
            } else if (timingOption === "auto") {
                task.last_completed_at = null;
                task.next_due_at = null;
                task.next_due_at = calculateNextDueDate(task, new Date());
                task.last_completed_at = last_completed_at_date;
            }
        }
        task.completion_start = calculateCompletionStartDateString(task.next_due_at, task.completion_window_days);


        await updateTask(task);
        router.back();
    };

    const onDeleteTask = async () => {
        await deleteTask(task.id);
        router.back();
    };

    const onArchiveTask = async () => {
        await archiveTask(task.id);
        router.back();
    };

    const onUnarchiveTask = async () => {
        await unArchiveTask(task.id);
        router.back();
    };

    // -----------------------------------------------------------------------------------------------------------------
    // -------------------------------------------- LOAD INFORMATION ---------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------

    const loadTask = async () => {
        if (!id) return;
        const task: Task = await getTaskInformation!(id);
        setTask(task);

        setTaskName(task.name);
        setDescription(task.description);
        setIsRecurring(task.recurring);

        setIntervalValue(task.interval_value?.toString());
        setIntervalUnit(task.interval_unit);

        setDayOfWeek(weekdayOptions[task.day_of_week ? task.day_of_week : 0]);
        setDateOfMonth(task.date_of_month?.toString() ?? null);
        setMonthOfYear(monthOptions[task.month_of_year ? task.month_of_year : 0]);

        if (task.season_start !== null && task.season_end !== null) {
            setSeasonalTask(true);
        }
        setSeasonStart(task.season_start?.toString() ?? null);
        setSeasonEnd(task.season_end?.toString() ?? null);

        setSkipMissedDueDates(task.skip_missed_due_dates);

        setDueDate(task.next_due_at);
        setLastCompletedAt(task.last_completed_at);
        setCompletionWindow(task.completion_window_days);
    };

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

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{flex: 1}}
            >
                {/* Scrollable container */}
                <ScrollView
                    contentContainerStyle={{flexGrow: 1}}
                    keyboardShouldPersistTaps="handled"
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
                                    numberOfLines={3}
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
                                            <View className="gap-y-6">
                                                <SwitchInput
                                                    labelText="Is this task seasonal?"
                                                    value={seasonalTask}
                                                    onValueChange={setSeasonalTask}
                                                />

                                                {seasonalTask && (
                                                    <>
                                                        <View className="flex-row items-center gap-x-5">
                                                            {/* Season Start and End */}
                                                            <View className="flex-1">
                                                                <CustomVerticalInput
                                                                    labelText="From:"
                                                                    placeholder="YYYY-MM-DD"
                                                                    value={seasonStart ? seasonStart.split('T')[0] : "YYYY-MM-DD"}
                                                                    handlePress={() => setSeasonStartCalendarVisible(true)}
                                                                />
                                                            </View>
                                                            <View className="flex-1">
                                                                <CustomVerticalInput
                                                                    labelText="Until:"
                                                                    placeholder="YYYY-MM-DD"
                                                                    value={seasonEnd ? seasonEnd.split('T')[0] : "YYYY-MM-DD"}
                                                                    handlePress={() => setSeasonEndCalendarVisible(true)}
                                                                />
                                                            </View>
                                                        </View>
                                                        <View className="items-center">
                                                            <CalendarInput
                                                                labelText={"Choose the Season's Starting Date:"}
                                                                value={seasonStart}
                                                                handleSelect={handleSelectSeasonStart}
                                                                isVisible={seasonStartCalendarVisible}
                                                                close={() => setSeasonStartCalendarVisible(false)}
                                                            />
                                                            <CalendarInput
                                                                labelText={"Choose the Season's Ending Date:"}
                                                                value={seasonEnd}
                                                                handleSelect={handleSelectSeasonEnd}
                                                                isVisible={seasonEndCalendarVisible}
                                                                close={() => setSeasonEndCalendarVisible(false)}
                                                            />
                                                        </View>

                                                    </>
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

                                        {task && (
                                            <SwitchInput
                                                labelText={"Adjust the due date?"}
                                                value={adjustDates}
                                                onValueChange={setAdjustDates}
                                            />
                                        )}

                                        {(!task || (task && adjustDates)) && (
                                            <View>
                                                <Text className="text-sm my-1 " style={{color: Colors.Primary["800"]}}>
                                                    How should the next due date be determined?
                                                </Text>

                                                {/* Timing Options */}
                                                <View className="flex-row justify-between pt-3 gap-x-2">
                                                    <TouchableOpacity
                                                        className={`py-2 px-4 rounded-lg`}
                                                        style={{
                                                            backgroundColor: timingOption === "previous" ? Colors.Complementary["600"] : Colors.Complementary["400"]
                                                        }}
                                                        onPress={() => setTimingOption("previous")}
                                                    >
                                                        <Text className="text-xs"
                                                              style={{color: timingOption === "previous" ? "white" : "black"}}>Previously
                                                            Completed</Text>
                                                    </TouchableOpacity>

                                                    <TouchableOpacity
                                                        className={`py-2 px-4 rounded-lg`}
                                                        style={{
                                                            backgroundColor: timingOption === "next" ? Colors.Complementary["600"] : Colors.Complementary["400"]
                                                        }}
                                                        onPress={() => setTimingOption("next")}
                                                    >
                                                        <Text className="text-xs"
                                                              style={{color: timingOption === "next" ? "white" : "black"}}>Next
                                                            Due</Text>
                                                    </TouchableOpacity>

                                                    <TouchableOpacity
                                                        className={`py-2 px-4 rounded-lg`}
                                                        style={{
                                                            backgroundColor: timingOption === "auto" ? Colors.Complementary["600"] : Colors.Complementary["400"]
                                                        }}
                                                        onPress={() => setTimingOption("auto")}
                                                    >
                                                        <Text className="text-xs"
                                                              style={{color: timingOption === "auto" ? "white" : "black"}}>Auto-Calculate</Text>
                                                    </TouchableOpacity>
                                                </View>


                                                {/* Input Fields Based on Selection */}
                                                {timingOption === "previous" && (
                                                    <View className="pt-5 flex">
                                                        <CustomHorizontalInput
                                                            labelText="Enter Last Completion Date:"
                                                            placeholder="YYYY-MM-DD"
                                                            value={lastCompletedAt ? lastCompletedAt.split('T')[0] : "YYYY-MM-DD"}
                                                            handlePress={() => setLastCompletedCalendarVisible(true)}
                                                        />

                                                        <CalendarInput
                                                            labelText={"Choose the Date the Task was Last Completed:"}
                                                            value={lastCompletedAt}
                                                            handleSelect={handleSelectLastCompleted}
                                                            isVisible={lastCompletedCalendarVisible}
                                                            close={() => setLastCompletedCalendarVisible(false)}
                                                        />
                                                    </View>
                                                )}

                                                {timingOption === "next" && (
                                                    <View className="pt-5 flex-1">
                                                        <CustomHorizontalInput
                                                            labelText="Due Date:"
                                                            placeholder="YYYY-MM-DD"
                                                            value={dueDate ? dueDate.split('T')[0] : "YYYY-MM-DD"}
                                                            handlePress={() => setDueDateCalendarVisible(true)}
                                                        />

                                                        <CalendarInput
                                                            labelText={"Choose the Task's Due Date:"}
                                                            value={dueDate}
                                                            handleSelect={handleSelectDueDate}
                                                            isVisible={dueDateCalendarVisible}
                                                            close={() => setDueDateCalendarVisible(false)}
                                                        />
                                                    </View>
                                                )}

                                                {timingOption === "auto" && (
                                                    <View className="pt-5">
                                                        <Text className="text-sm text-gray-600">
                                                            Next due date will be calculated automatically from the
                                                            current
                                                            moment.
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>
                                        )}


                                    </>

                                ) : (
                                    // Non-recurring task fields (Due Date + Completion Window)
                                    <View>

                                        <CustomHorizontalInput
                                            labelText="Due Date (Optional):"
                                            placeholder="YYYY-MM-DD"
                                            value={dueDate ? dueDate.split('T')[0] : "YYYY-MM-DD"}
                                            handlePress={() => setDueDateCalendarVisible(true)}
                                        />

                                        <CalendarInput
                                            labelText={"Choose the Task's Due Date:"}
                                            value={dueDate}
                                            handleSelect={handleSelectDueDate}
                                            isVisible={dueDateCalendarVisible}
                                            close={() => setDueDateCalendarVisible(false)}
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
    );
};

export default NewTaskView;