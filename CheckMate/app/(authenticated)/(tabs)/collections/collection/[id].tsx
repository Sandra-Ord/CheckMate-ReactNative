import React, {useCallback, useMemo, useState} from 'react';
import {FlatList, Modal, RefreshControl, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {Link, useFocusEffect, useLocalSearchParams, Stack} from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useSupabase} from "@/context/SupabaseContext";
import {Collection, Task} from "@/types/enums";
import {Colors} from "@/constants/Colors";
import TaskListItem from "@/components/taskComponents/TaskListItem";
import FilterMenu from "@/components/collectionComponents/CollectionFilterMenu";
import CompleteTaskModal from "@/components/taskComponents/CompleteTaskModal";
import NoTasksListItem from "@/components/taskComponents/NoTasksListItem";

const CollectionView = () => {

    const {id} = useLocalSearchParams<{ id: string }>();
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const [collection, setCollection] = useState<Collection>();
    const [tasks, setTasks] = useState<[]>([]);
    const [users, setUsers] = useState<[]>([]);

    const {getCollectionInfo, getCollectionTasks, getCollectionUsers, completeTask} = useSupabase();

    // -----------------------------------------------------------------------------------------------------------------
    // ------------------------------------------ COMPLETE A TASK ------------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------

    const [completeTaskModalVisible, setCompleteTaskModalVisible] = useState<boolean>(false);
    const [taskToComplete, setTaskToComplete] = useState<Task>(null);  // the task selected for completion
    const [completionComment, setCompletionComment] = useState<string>("");
    const [completeTaskDate, setCompleteTaskDate] = useState(new Date());
    const [assignTaskToUserId, setAssignTaskToUserId] = useState<string>(null);

    const handleTaskCompletion = (task: Task) => {
        setTaskToComplete(task);
        setCompleteTaskModalVisible(true);
    };

    const onCompleteTask = async () => {
        if (taskToComplete == null) return;
        const data = await completeTask(taskToComplete, completeTaskDate, completionComment, assignTaskToUserId);
        setCompleteTaskModalVisible(false);
        setTaskToComplete(null);
        setAssignTaskToUserId(null);
        setCompletionComment("");
        await loadTasks();
    }

    // -----------------------------------------------------------------------------------------------------------------
    // -------------------------------------------- LOAD INFORMATION ---------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------

    const loadCollectionUsers = async () => {
        const data = await getCollectionUsers(id);
        setUsers(data);
        setFilters((prev) => ({
            ...prev,
            selectedUsers: data.map((user) => user.id),
        }));
    };

    const loadTasks = async () => {
        const data = await getCollectionTasks(id);
        setTasks(data);
    };

    const loadCollectionInfo = async () => {
        if (!id) return;
        const data = await getCollectionInfo!(id);
        setCollection(data);
    };

    useFocusEffect(
        useCallback(() => {
            loadCollectionInfo();
            loadTasks();
            loadCollectionUsers();
        }, [])
    );

    // -----------------------------------------------------------------------------------------------------------------
    // -------------------------------------------- TOGGLE FILTER ------------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------

    const [filterMenuVisible, setFilterMenuVisible] = useState<boolean>(false);

    const toggleFilter = (filterKey: string) => {
        setFilters((prev) => ({...prev, [filterKey]: !prev[filterKey]}));
    };

    const toggleUserFilter = (userId: number) => {
        setFilters((prev) => ({
            ...prev,
            selectedUsers: prev.selectedUsers.includes(userId)
                ? prev.selectedUsers.filter((id) => id !== userId)
                : [...prev.selectedUsers, userId],
        }));
    };

    // -----------------------------------------------------------------------------------------------------------------
    // --------------------------------------------- FILTERING ---------------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------

    const [filters, setFilters] = useState({
        openForCompletion: false,
        inSeason: true,
        outOfSeason: false,
        notArchived: true,
        archived: false,
        notAssigned: true,
        selectedUsers: users.map((user) => user.id),
    });

    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            const now = new Date();

            // Check conditions
            const isOpenForCompletion = filters.openForCompletion &&
                ((new Date(task.completion_start) <= now && now <= new Date(task.next_due_at)) ||
                    (new Date(task.next_due_at) >= now && task.last_completed_at === null));

            const isInSeason = filters.inSeason &&
                (task.archived_at === null &&
                    (task.season_start === null || task.season_end === null ||
                        (new Date(task.season_start) <= now && now <= new Date(task.season_end))));

            const isOutOfSeason = filters.outOfSeason &&
                (task.archived_at === null &&
                    (task.season_start !== null && task.season_end !== null &&
                        (now < new Date(task.season_start) || now > new Date(task.season_end))));

            const isNotArchived = filters.notArchived && task.archived_at === null;
            const isArchived = filters.archived && task.archived_at !== null;

            const isUserSelected = filters.selectedUsers.length === 0 || filters.selectedUsers.includes(task.assigned_to_user_id);

            const isNotAssigned = filters.notAssigned && task.assigned_to_user_id === null;

            // "In Season" and "Out of Season" filters are combined with OR-operator
            const matchesSeasonFilter =
                (!filters.inSeason && !filters.outOfSeason) ||
                (isInSeason || isOutOfSeason);

            // "Not Archived" and "Archived" filters are combined with OR-operator
            const matchesArchivedFilter =
                (!filters.notArchived && !filters.archived) ||
                (isNotArchived || isArchived);

            // If "Not Assigned" is the only user filter chosen,
            // Combine it with the other filter selections
            if (filters.notAssigned && filters.selectedUsers.length === 0) {
                return isNotAssigned &&
                    matchesSeasonFilter &&
                    matchesArchivedFilter &&
                    (!filters.openForCompletion || isOpenForCompletion);
            }

            // Combine filters with AND-operator
            return (
                matchesSeasonFilter &&
                matchesArchivedFilter &&
                (!filters.openForCompletion || isOpenForCompletion) &&
                (isUserSelected || isNotAssigned)
            );
        });
    }, [tasks, filters]);

    return (
        <SafeAreaView className="flex-1">

            <Stack.Screen
                options={{
                    headerTitle: () => (
                        <View style={{flex: 1}}>
                            <Text style={{color: Colors.Complementary["900"], fontSize: 16}}>{collection?.name}</Text>
                            <Text style={{color: Colors.Complementary["900"], fontSize: 12}}>Collection
                                of {collection?.users.first_name}</Text>
                        </View>
                    ),
                    headerRight: () => (
                        <View className="flex-row gap-4">
                            <TouchableOpacity onPress={() => setFilterMenuVisible(true)}>
                                <Ionicons name="filter-circle-outline" size={26} color={Colors.Complementary["900"]}/>
                            </TouchableOpacity>
                            <Link href={`/(authenticated)/(tabs)/collections/collection/settings?id=${id}`} asChild>
                                <TouchableOpacity>
                                    <Ionicons name="ellipsis-horizontal" size={26} color={Colors.Complementary["900"]}/>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    ),
                    headerTransparent: false,
                }}
            />

            <View className="w-full h-full" style={{backgroundColor: Colors.Complementary["300"]}}>

                <View className="flex-row w-full items-center justify-between px-4 py-2">
                    <TouchableOpacity className="flex-row items-center" onPress={() => setFilterMenuVisible(true)}>
                        <Ionicons name='filter' size={20} style={{color: Colors.primaryGray}}/>
                        <Text className="pl-3">Filter/Sort</Text>
                    </TouchableOpacity>

                    <Link href={`/(authenticated)/(tabs)/collections/collection/new_task?collectionId=${id}`} asChild>
                        <TouchableOpacity className="flex-row items-center">
                            <Text className="pr-2">Add Task</Text>
                            <Ionicons name='add' size={20} style={{color: Colors.primaryGray}}/>
                        </TouchableOpacity>
                    </Link>
                </View>

                <View className="flex-1 pb-3 px-5">
                    {filteredTasks.length === 0 ? (
                        <View className="pt-2">
                            <NoTasksListItem
                                onOpenFilterMenu={() => setFilterMenuVisible(true)}
                                newTaskLink={`/(authenticated)/(tabs)/collections/collection/new_task?collectionId=${id}`}
                            />
                        </View>
                    ) : (
                        <FlatList
                            className="pt-2"
                            data={filteredTasks}
                            renderItem={({item}) => (
                                <TaskListItem
                                    task={item}
                                    onTaskComplete={handleTaskCompletion}
                                />
                            )}
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadTasks}/>}
                            keyExtractor={(item) => `${item.id.toString()}`}
                        />
                    )}
                </View>

                {/* Modal for Responding */}
                <CompleteTaskModal
                    task={taskToComplete}
                    completeTaskModalVisible={completeTaskModalVisible}
                    setCompleteTaskModalVisible={setCompleteTaskModalVisible}
                    completeTaskDate={completeTaskDate}
                    setCompleteTaskDate={setCompleteTaskDate}
                    completionComment={completionComment}
                    setCompletionComment={setCompletionComment}
                    assignTaskToUserId={assignTaskToUserId}
                    setAssignTaskToUserId={setAssignTaskToUserId}
                    onCompleteTask={onCompleteTask}
                />


                {/* Filter and sort side menu modal */}
                <Modal
                    animationType="none"
                    transparent={true}
                    visible={filterMenuVisible}
                    onRequestClose={() => setFilterMenuVisible(false)}
                >
                    <View style={{flex: 1, flexDirection: "row"}}>
                        {/* Transparent Overlay */}
                        <TouchableOpacity
                            style={{flex: 1, backgroundColor: "rgba(0,0,0,0.1)"}}
                            onPress={() => setFilterMenuVisible(false)}
                        />
                        {/* Filter Menu */}
                        <FilterMenu
                            onClose={() => setFilterMenuVisible(false)}
                            users={users}
                            filters={filters}
                            toggleFilter={toggleFilter}
                            toggleUserFilter={toggleUserFilter}
                        />
                    </View>
                </Modal>

            </View>

        </SafeAreaView>
    );
};

export default CollectionView;