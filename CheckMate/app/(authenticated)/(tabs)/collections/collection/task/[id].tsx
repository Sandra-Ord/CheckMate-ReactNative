import React, {useCallback, useRef, useState} from 'react';
import {
    FlatList,
    RefreshControl,
    SafeAreaView,
    TouchableOpacity,
    View,
    Text,
    Modal,
    ScrollView,
    StyleSheet,
    Image,
    Alert, useWindowDimensions
} from 'react-native';
import {Href, Link, Stack, useFocusEffect, useLocalSearchParams} from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import Carousel, {ICarouselInstance} from "react-native-reanimated-carousel";
import {useSharedValue} from "react-native-reanimated";
import {useSupabase} from "@/context/SupabaseContext";
import {Task, TaskPhoto} from "@/types/enums";
import {Colors} from "@/constants/Colors"
import {formatDate, formatShortDate} from "@/utils/textUtils";
import ActionButton from "@/components/uiComponents/ActionButton";
import CompleteTaskModal from "@/components/CompleteTaskModal";
import HorizontalInput from "@/components/uiComponents/HorizontalInput.tsx";
import {days, months} from "@/utils/intervalUtils.ts";

const TaskView = () => {

    const {id} = useLocalSearchParams<{ id: string }>();

    const {width, height} = useWindowDimensions();
    const [refreshing, setRefreshing] = useState(false);
    const ref = useRef<ICarouselInstance>(null);
    const scrollOffsetValue = useSharedValue(0);

    const [task, setTask] = useState<Task>();
    const [photos, setPhotos] = useState([
        { photo_url: "https://example.com/photo1.jpg" },
        { photo_url: "https://example.com/photo2.jpg" },
        { photo_url: "https://example.com/photo3.jpg" }
    ]);

    const [imagePath, setImagePath] = useState("https://example.com/photo1.jpg");

    const {getTaskInformation, completeTask, uploadTaskPhoto, getTaskPhotos, getFileFromPath, userId} = useSupabase();

    const [photoModalVisible, setPhotoModalVisible] = useState(false);

    const openPhotoModal = () => {
        setPhotoModalVisible(true);
    }

    const [assignTaskToUserId, setAssignTaskToUserId] = useState();
    const [completeTaskModalVisible, setCompleteTaskModalVisible] = useState(false);
    const [completionComment, setCompletionComment] = useState();
    const [completeTaskDate, setCompleteTaskDate] = useState(new Date());

    const handleTaskCompletion = () => {
        setCompleteTaskModalVisible(true);
    };

    const onCompleteTask = async () => {
        if (task == null) return;
        const data = await completeTask(task, completeTaskDate, completionComment, assignTaskToUserId);
        setCompleteTaskModalVisible(false);
        setAssignTaskToUserId(null);
        setCompletionComment("");
        await loadTasks();
    }

    // -----------------------------------------------------------------------------------------------------------------
    // -------------------------------------------- LOAD INFORMATION ---------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------

    const onSelectImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const img = result.assets[0];

            const base64 = await FileSystem.readAsStringAsync(img.uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            const fileName = `${new Date().getTime()}-${userId}.png`;
            const filePath = `${task?.id}/${fileName}`;
            const contentType = 'image/png';
            const storagePath = await uploadTaskPhoto(task?.id, filePath, base64, contentType);
        }
    };

    const loadTask = async () => {
        const data = await getTaskInformation(id);
        console.log(data);
        setTask(data);
    };

    const loadPhotos = async () => {
        //if (!task?.id) return;
        //const data = await getTaskPhotos(task.id);
        //setPhotos(data);
        //setImagePath(photos[0]);

        //console.log(data);
        // if (data) {
        //     const signedPath = await getFileFromPath!(data[0].photo_url);
        //     setImagePath(signedPath);
        //
        // }

        setPhotos([
            { photo_url: "https://example.com/photo1.jpg" },
            { photo_url: "https://example.com/photo2.jpg" },
            { photo_url: "https://example.com/photo3.jpg" },
        ]);
        setImagePath("https://example.com/photo1.jpg");
    }

    useFocusEffect(
        useCallback(() => {
            loadTask();
            loadPhotos();
        }, [])
    );

    return (
        <SafeAreaView className="flex-1">

            <Stack.Screen options={{
                headerTitle: task?.name ? `${task.name}` : "Task",
                headerRight: () => (
                    <View className="flex-row items-center gap-x-2">
                        <Link
                            href={`/(authenticated)/(tabs)/collections/collection/new_task?id=${task?.id}&collectionId=${task?.collection_id}` as Href}
                            key={`new-task-${task?.id}`}
                            asChild
                        >
                            <TouchableOpacity className="px-1">
                                <Ionicons name="pencil" size={20} style={{color: Colors.Primary["800"]}}/>
                            </TouchableOpacity>
                        </Link>

                    </View>
                )
            }}
            />
            <ScrollView
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 20,
                    gap: 20,
                }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={loadTask}/>
                }
                style={{backgroundColor: Colors.Complementary["300"]}}>

                <View className="flex-row justify-between items-center gap-x-3">
                    <Text className="flex-1 text-xl font-bold">
                        {task?.name}
                    </Text>
                    <Link
                        href={`/(authenticated)/(tabs)/collections/collection/task/log?id=${task?.id}` as Href}
                        key={`task-log-${task?.id}`}
                        asChild
                    >
                        <TouchableOpacity className="flex-row gap-x-2">
                            <Ionicons name="time-outline" size={24} style={{color: Colors.Primary["800"]}}/>
                        </TouchableOpacity>
                    </Link>
                </View>
                <View
                    style={{
                        height: 0.5,
                        backgroundColor: Colors.Complementary["800"],
                    }}
                />
                {task && (
                    <>
                        {task.recurring && (
                            <View className="gap-y-3">
                                <View className="flex-row gap-x-2">
                                    <Text className="font-bold">
                                        Task Type:
                                    </Text>
                                    <Text>
                                        Interval
                                    </Text>
                                </View>
                                {task.description && (
                                    <View className="">
                                        <Text className="font-bold">
                                            Description:
                                        </Text>
                                        <Text>
                                            {task.description}
                                        </Text>
                                    </View>
                                )}

                                <View className="flex-row gap-x-2 pt-4">
                                    <Text className="font-bold">
                                        Interval Value:
                                    </Text>
                                    <Text>
                                        {task.interval_value}
                                    </Text>
                                </View>

                                <View className="flex-row gap-x-2">
                                    <Text className="font-bold">
                                        Interval Unit:
                                    </Text>
                                    <Text>
                                        {task.interval_unit}
                                    </Text>
                                </View>


                                <View>
                                    <Text className="font-bold pb-2">Interval Specifier:</Text>
                                    {task.interval_unit === "day" ? (
                                        <Text>None</Text>
                                    ) : task.interval_unit === "week" ? (
                                        <View className="flex-row gap-x-2">
                                            <Text className="font-bold">Day of Week:</Text>
                                            <Text>{task.day_of_week ? days[task.day_of_week] : "None"}</Text>
                                        </View>
                                    ) : task.interval_unit === "month" ? (
                                        <View className="flex-row gap-x-2">
                                            <Text className="font-bold">Date of Month:</Text>
                                            <Text>{task.date_of_month ? task.date_of_month : "None"}</Text>
                                        </View>
                                    ) : task.interval_unit === "year" ? (
                                        <View className="flex-row gap-x-2">
                                            <Text className="font-bold">Month of Year:</Text>
                                            <Text>{task.month_of_year ? months[task.month_of_year] : "None"}</Text>
                                            {task.month_of_year && (
                                                <View className="flex-row gap-x-2">
                                                    <Text className="font-bold">Date of Month:</Text>
                                                    <Text>{task.date_of_month ? task.date_of_month : "None"}</Text>
                                                </View>
                                            )}
                                        </View>
                                    ) : null}
                                </View>

                                <View className="flex-row gap-x-2 pb-4">
                                    <Text className="font-bold">
                                        Seasonal:
                                    </Text>

                                    {(task.season_start === null && task.season_end === null) ? (
                                        <Text className="">No:</Text>
                                    ) : (
                                        <Text
                                            className="">{formatDate(task.season_start)} - {formatDate(task.season_end)}</Text>
                                    )}

                                </View>

                                <View className="flex-row gap-x-2">
                                    <Text className="font-bold">
                                        Last Completed At:
                                    </Text>
                                    <Text className="">
                                        {task.last_completed_at ? formatShortDate(task.last_completed_at) : ""}
                                    </Text>
                                </View>


                                <View className="flex-row gap-x-2">
                                    <Text className="font-bold">
                                        Due Date:
                                    </Text>
                                    <Text className="">
                                        {task.next_due_at ? formatShortDate(task.next_due_at) : "None set"}
                                    </Text>
                                </View>

                                <View className="flex-row gap-x-2">
                                    <Text className="font-bold">Missed Due Dates:</Text>

                                    <Text> {task?.skip_missed_due_dates ? "Skip" : "Don't Skip"}</Text>
                                </View>

                                <View className="flex-row gap-x-2">
                                    <Text className="font-bold">
                                        Open for Completion:
                                    </Text>
                                    <Text className="">
                                        {task.completion_window_days ? `${task.completion_window_days} days from ${formatShortDate(task.completion_start)}` : "Always"}
                                    </Text>
                                </View>

                                <View className="flex-row gap-x-2">
                                    <Text className="font-bold">
                                        State:
                                    </Text>
                                    <Text>
                                        {task.last_completed_at ? `Completed on ${formatShortDate(task.last_completed_at)}` : "Waiting for Completion"}
                                    </Text>
                                </View>

                                <View className="flex-row gap-x-2">
                                    <Text className="font-bold">
                                        Archived:
                                    </Text>
                                    <Text>
                                        {task.archived_at ? `${formatShortDate(task.archived_at)}` : "No"}
                                    </Text>
                                </View>

                                <View className="flex-row gap-x-2">
                                    <Text className="font-bold">Assigned to:</Text>

                                    <Text> {task?.users?.first_name ? task?.users.first_name : "None"}</Text>
                                </View>

                            </View>
                        )}
                        {!task.recurring && (
                            <View className="gap-y-3">
                                <View className="flex-row gap-x-2">
                                    <Text className="font-bold">
                                        Task Type:
                                    </Text>
                                    <Text>
                                        One-Time Task
                                    </Text>
                                </View>
                                {task.description && (
                                    <View className="">
                                        <Text className="font-bold">
                                            Description:
                                        </Text>
                                        <Text>
                                            {task.description}
                                        </Text>
                                    </View>
                                )}

                                <View className="flex-row gap-x-2">
                                    <Text className="font-bold">
                                        Due Date:
                                    </Text>
                                    <Text className="">
                                        {task.next_due_at ? formatShortDate(task.next_due_at) : "None set"}
                                    </Text>
                                </View>

                                <View className="flex-row gap-x-2">
                                    <Text className="font-bold">Missed Due Dates:</Text>

                                    <Text> {task?.skip_missed_due_dates ? "Skip" : "Don't Skip"}</Text>
                                </View>

                                <View className="flex-row gap-x-2">
                                    <Text className="font-bold">
                                        Open for Completion:
                                    </Text>
                                    <Text className="">
                                        {task.completion_window_days ? `${task.completion_window_days} days from ${formatShortDate(task.completion_start)}` : "Always"}
                                    </Text>
                                </View>

                                <View className="flex-row gap-x-2">
                                    <Text className="font-bold">
                                        State:
                                    </Text>
                                    <Text>
                                        {task.last_completed_at ? `Completed on ${formatShortDate(task.last_completed_at)}` : "Waiting for Completion"}
                                    </Text>
                                </View>

                                <View className="flex-row gap-x-2">
                                    <Text className="font-bold">
                                        Archived:
                                    </Text>
                                    <Text>
                                        {task.archived_at ? `${formatShortDate(task.archived_at)}` : "No"}
                                    </Text>
                                </View>

                                <View className="flex-row gap-x-2">
                                    <Text className="font-bold">Assigned to:</Text>

                                    <Text> {task?.users?.first_name ? task?.users.first_name : "None"}</Text>
                                </View>
                            </View>
                        )}
                    </>
                )}

                <View>
                    <TouchableOpacity className="flex-row items-center gap-x-2" onPress={async () => {
                        const choice = await new Promise((resolve) => {
                            Alert.alert(
                                "Select Photo Source",
                                "Choose an option to proceed",
                                [
                                    {
                                        text: "Take Photo",
                                        onPress: async () => {
                                            const cameraResult = await ImagePicker.launchCameraAsync({
                                                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                                                allowsEditing: true,
                                                aspect: [4, 3],
                                                quality: 1,
                                            });
                                            resolve(cameraResult);
                                        },
                                    },
                                    {
                                        text: "Choose from Library",
                                        onPress: async () => {
                                            const libraryResult = await ImagePicker.launchImageLibraryAsync({
                                                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                                                allowsEditing: true,
                                                aspect: [4, 3],
                                                quality: 1,
                                            });
                                            resolve(libraryResult);
                                        },
                                    },
                                    {
                                        text: "Cancel",
                                        style: "cancel",
                                    },
                                ],
                                {cancelable: true}
                            );
                        });

                        if (choice && !choice.canceled) {
                            const img = choice.assets[0];
                            const base64 = await FileSystem.readAsStringAsync(img.uri, {
                                encoding: FileSystem.EncodingType.Base64,
                            });
                            const fileName = `${new Date().getTime()}-${userId}.png`;
                            const filePath = `${task?.id}/${fileName}`;
                            const contentType = 'image/png';
                            const storagePath = await uploadTaskPhoto(task?.id, filePath, base64, contentType);
                            console.log("Image uploaded successfully");
                        }
                    }}>
                        <Ionicons name="image-outline" size={18}/>
                        <Text>Upload a Photo</Text>
                    </TouchableOpacity>
                </View>


                {photos && (
                    <>
                        {/* Button to Open the Carousel Modal */}
                        <TouchableOpacity onPress={openPhotoModal} style={styles.openButton}>
                            <Ionicons name="image-outline" size={18} />
                            <Text style={styles.openButtonText}> View Photos</Text>
                        </TouchableOpacity>

                        {/* Modal */}
                        <Modal
                            visible={photoModalVisible}
                            animationType="fade"
                            transparent={true}
                            onRequestClose={() => setPhotoModalVisible(false)}
                        >
                            <TouchableOpacity
                                className="justify-center flex-1"
                                style={{backgroundColor: "rgba(0, 0, 0, 0.3)"}}
                                onPress={() => setPhotoModalVisible(false)}
                            >

                                <TouchableOpacity>
                                    <View className="rounded-lg p-4 mx-4"
                                          style={{backgroundColor: Colors.Complementary["100"]}}>

                                        <View className="flex-row justify-between items-center">
                                            <Text className="text-2xl font-bold">
                                                Photos:
                                            </Text>

                                            <TouchableOpacity onPress={() => setPhotoModalVisible(false)}>
                                                <Ionicons name="close" size={28} style={{color: Colors.Primary["800"]}}/>
                                            </TouchableOpacity>
                                        </View>

                                        {/* separator line */}
                                        <View
                                            style={{
                                                height: 1,
                                                backgroundColor: Colors.Complementary["800"],
                                            }}
                                            className="my-2 items-center justify-between"
                                        />

                                            <Image
                                                source={{ uri: `${imagePath}` }}
                                                style={styles.carouselImage}
                                            />

                                    </View>
                                </TouchableOpacity>
                                {/*<TouchableOpacity style={styles.closeButton} onPress={() => setPhotoModalVisible(false)}>*/}
                                {/*    <Ionicons name="close" size={24} color="#fff" />*/}
                                {/*</TouchableOpacity>*/}


                                {/*<Image*/}
                                {/*    source={{ uri: photos[0].photo_url }}*/}
                                {/*    style={styles.carouselImage}*/}
                                {/*/>*/}
                                {/*<Carousel*/}
                                {/*    data={photos}*/}
                                {/*    loop={false}*/}
                                {/*    renderItem={({ item }) => (*/}
                                {/*        <Image*/}
                                {/*            source={{ uri: item.photo_url }}*/}
                                {/*            style={styles.carouselImage}*/}
                                {/*        />*/}
                                {/*    )}*/}
                                {/*    width={400}*/}
                                {/*    height={300}*/}
                                {/*/>*/}
                            </TouchableOpacity>
                        </Modal>
                    </>
                )}



                {((!task?.recurring && !task?.last_completed_at) || (task?.recurring)) ? (
                    <View className="w-full items-center pt-10">
                        <ActionButton onPress={handleTaskCompletion} iconName={"checkbox-outline"}
                                      text={"Complete Task"} textColor={Colors.Complementary["100"]}
                                      buttonColor={Colors.Complementary["600"]}/>
                    </View>
                ) : null}





                <CompleteTaskModal
                    task={task}
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




            </ScrollView>
        </SafeAreaView>
    );
};



const styles = StyleSheet.create({
    openButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        backgroundColor: '#007BFF',
        borderRadius: 8,
        justifyContent: 'center',
        marginVertical: 10,
    },
    openButtonText: {
        color: '#fff',
        marginLeft: 8,
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
    },
    carouselImage: {
        width: '100%',
        height: 300,
        resizeMode: 'contain',
        borderRadius: 8,
    }
});

export default TaskView;