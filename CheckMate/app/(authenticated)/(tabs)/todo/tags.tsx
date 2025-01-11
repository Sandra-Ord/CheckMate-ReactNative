import React, {useCallback, useMemo, useRef, useState} from 'react';
import {FlatList, RefreshControl, SafeAreaView, TouchableOpacity, View} from 'react-native';
import {useFocusEffect, Stack} from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import {BottomSheetModal, BottomSheetModalProvider} from "@gorhom/bottom-sheet";
import {useSupabase} from "@/context/SupabaseContext";
import NewTagModal from "@/components/NewTagModal";
import TagListItem from "@/components/TagListItem";
import {Colors} from "@/constants/Colors";
import {Tag} from "@/types/enums";

const ToDoView = () => {

    const [refreshing, setRefreshing] = useState(false);

    const [selectedTag, setSelectedTag] = useState();
    const [tags, setTags] = useState<[]>([]);
    const {getTags} = useSupabase();

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ["80%"], []);

    const showNewTagModal = () => {
        setSelectedTag(null);
        bottomSheetModalRef.current?.present();
    };

    const showEditTagModal = (tag: Tag) => {
        setSelectedTag(tag);
        bottomSheetModalRef.current?.present();
    };

    const loadTags = async () => {
        const data = await getTags();
        setTags(data);
    };

    useFocusEffect(
        useCallback(() => {
            loadTags();
        }, [])
    );

    return (
        <SafeAreaView className="flex-1" style={{backgroundColor: Colors.Complementary["300"]}}>

            <Stack.Screen options={{
                headerRight: () => (
                    <Ionicons
                        name="add"
                        size={24}
                        color={Colors.Complementary["900"]}
                        onPress={() => showNewTagModal()}
                        className="pr-2"
                    />
                ),
            }}
            />

            <View>
                <BottomSheetModalProvider>

                    <View className="w-full h-full">

                        <View className="flex-1 pb-3 px-4 pt-2">
                            <FlatList
                                data={tags}
                                renderItem={({item}) => (
                                    <TouchableOpacity onPress={() => showEditTagModal(item)}>
                                        <TagListItem {...item} />
                                    </TouchableOpacity>
                                )}
                                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadTags}/>}
                                keyExtractor={(item) => `${item.id.toString()}`}
                                ItemSeparatorComponent={() => (
                                    <View
                                        style={{
                                            height: 0.5,
                                            backgroundColor: Colors.Complementary["800"],
                                        }}
                                    />
                                )}
                            />
                        </View>

                    </View>

                    <BottomSheetModal
                        ref={bottomSheetModalRef}
                        onDismiss={() => setSelectedTag(null)}
                        index={0}
                        snapPoints={snapPoints}
                    >
                        <NewTagModal

                            tag={selectedTag}
                            closeModal={() => bottomSheetModalRef.current?.dismiss()}
                            reload={() => loadTags()}
                        />
                    </BottomSheetModal>

                </BottomSheetModalProvider>
            </View>

        </SafeAreaView>
    );
};


export default ToDoView;