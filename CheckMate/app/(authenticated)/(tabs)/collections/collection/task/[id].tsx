import React, {useCallback, useRef, useState} from 'react';
import {
    RefreshControl,
    SafeAreaView,
    TouchableOpacity,
    View,
    ScrollView,
    Alert
} from 'react-native';
import {Href, Link, Stack, useFocusEffect, useLocalSearchParams} from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import {useSupabase} from "@/context/SupabaseContext";
import {Task} from "@/types/enums";
import {Colors} from "@/constants/Colors"
import ActionButton from "@/components/uiComponents/ActionButton";
import CompleteTaskModal from "@/components/taskComponents/CompleteTaskModal";
import TaskCard from "@/components/taskComponents/TaskCard";

const TaskView = () => {

    const {id} = useLocalSearchParams<{ id: string }>();
    const {collectionId} = useLocalSearchParams<{ collectionId?: string }>()

    const [refreshing, setRefreshing] = useState(false);

    const [users, setUsers] = useState<[]>([]);
    const [task, setTask] = useState<Task>();
    const [photoUrls, setPhotoUrls] = useState<string[]>([]);

    const {getTaskInformation, getCollectionUsers, completeTask, uploadTaskPhoto, getTaskPhotos, getFileFromPath, userId} = useSupabase();

    const [assignTaskToUser, setAssignTaskToUser] = useState();
    const [completeTaskModalVisible, setCompleteTaskModalVisible] = useState(false);
    const [completionComment, setCompletionComment] = useState();
    const [completeTaskDate, setCompleteTaskDate] = useState(new Date());

    const handleTaskCompletion = () => {
        setCompleteTaskModalVisible(true);
    };

    const onCompleteTask = async () => {
        if (task == null) return;
        const data = await completeTask(task, completeTaskDate, completionComment, assignTaskToUser?.id);
        setCompleteTaskModalVisible(false);
        setAssignTaskToUser(null);
        setCompletionComment("");
        await loadTasks();
    }

    // -----------------------------------------------------------------------------------------------------------------
    // -------------------------------------------- LOAD INFORMATION ---------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------

    const openImagePickerAlert = async () => {
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
        loadPhotos();
    };

    const loadCollectionUsers = async () => {
        if (collectionId == null) return;
        const data = await getCollectionUsers(collectionId);
        setUsers(data);
    };

    const loadTask = async () => {
        const data = await getTaskInformation(id);
        setTask(data);
    };

    const loadPhotos = async () => {
        const photos = await getTaskPhotos(id);
        const signedUrls = await Promise.all(photos.map(photo => getFileFromPath(photo.photo_url)));
        setPhotoUrls(signedUrls.filter(url => url));  // Ensure URLs are not null
    }

    useFocusEffect(
        useCallback(() => {
            loadTask();
            loadCollectionUsers();
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
                            href={`/(authenticated)/(tabs)/collections/collection/task/statistics?id=${id}&collectionId=${task?.collection_id}`}
                            key={`statistics-${task?.id}`}
                            asChild>
                            <TouchableOpacity>
                                <Ionicons name="stats-chart-outline" size={20} color={Colors.Complementary["800"]}/>
                            </TouchableOpacity>
                        </Link>

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
                className="px-4 py-5 gap-y-0"
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={loadTask}/>
                }
                style={{backgroundColor: Colors.Complementary["300"]}}
            >

                {task && (
                    <TaskCard
                        task={task}
                        onTaskComplete={handleTaskCompletion}
                        photoUrls={photoUrls}
                    />
                )}

                <View className="items-center my-10">
                    <ActionButton onPress={openImagePickerAlert} iconName={"image-outline"} text={"Upload a Photo"}
                                  textColor={Colors.Complementary["100"]} buttonColor={Colors.Complementary["600"]}/>
                </View>

                <CompleteTaskModal
                    task={task}
                    completeTaskModalVisible={completeTaskModalVisible}
                    setCompleteTaskModalVisible={setCompleteTaskModalVisible}
                    completeTaskDate={completeTaskDate}
                    setCompleteTaskDate={setCompleteTaskDate}
                    completionComment={completionComment}
                    setCompletionComment={setCompletionComment}
                    assignTaskToUserId={assignTaskToUser}
                    setAssignTaskToUserId={setAssignTaskToUser}
                    onCompleteTask={onCompleteTask}
                    users={users}
                />

            </ScrollView>
        </SafeAreaView>
    );
};

export default TaskView;