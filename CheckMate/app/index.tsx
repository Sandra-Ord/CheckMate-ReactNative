import {ImageBackground, Text, TouchableOpacity, View} from "react-native";
import {Colors} from "@/constants/Colors";
import React, {useMemo, useRef, useState} from "react";
import {useActionSheet} from "@expo/react-native-action-sheet";
import * as WebBrowser from "expo-web-browser";
import {ModalType} from "@/types/enums";
import {BottomSheetModal, BottomSheetModalProvider, BottomSheetView} from "@gorhom/bottom-sheet";
import AuthModal from "@/components/AuthModal"
import authLogo from "@/assets/images/authentication_screen.png"

export default function Index() {

    const {showActionSheetWithOptions} = useActionSheet();
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const [authType, setAuthType] = useState<ModalType | null>(null);
    const snapPoints = useMemo(() => ["45%"], [])

    const openActionSheet = async () => {
        const options = ["View docs", "Contact support", "Cancel"]

        showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex: 2,
                title: "Can't log in or sign up?",
            },
            (selectedIndex: any) => {
                if (selectedIndex === 0) {
                    WebBrowser.openBrowserAsync("https://google.com)");
                } else if (selectedIndex === 1) {
                    WebBrowser.openBrowserAsync("https://github.com");
                }
            }
        );
    }

    const showAuthModal = (type: ModalType) => {
        setAuthType(type);
        bottomSheetModalRef.current?.present();
    }

    return (
        <BottomSheetModalProvider>

            <View style={{backgroundColor: Colors.primaryBeige}} className="flex-1">
                <ImageBackground
                    source={authLogo}
                    resizeMode="cover"
                    className="flex-1 justify-center items-center"
                >

                    <Text style={{color: Colors.primaryGray}} className="text-4xl text-center font-bold pt-52">
                        CheckMate
                    </Text>

                    <View className="mt-8 mb-16">
                        <Text style={{color: Colors.Primary["600"]}} className="text-gray-600 text-center">
                            Master task management.
                        </Text>
                        <Text style={{color: Colors.Primary["600"]}} className="text-gray-600 text-center">
                            One check at a time — with your mates on board.
                        </Text>
                    </View>

                    <View className="w-3/4 gap-4">

                        <TouchableOpacity
                            style={{backgroundColor: Colors.Primary["800"]}} className="p-2 rounded-full"
                            onPress={() => showAuthModal(ModalType.Login)}
                        >
                            <Text style={{color: Colors.Complementary["50"]}} className="text-lg text-center">
                                Log in
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{backgroundColor: Colors.Primary["800"]}} className="p-2 rounded-full"
                            onPress={() => showAuthModal(ModalType.SignUp)}
                        >
                            <Text style={{color: Colors.Complementary["50"]}} className="text-lg text-center">
                                Sign up
                            </Text>
                        </TouchableOpacity>

                        <Text className="px-4 text-xs text-center" style={{color: Colors.Primary["500"]}}>
                            By signing up, you confirm that you've read and accepted our &nbsp;
                            <Text className="underline">Terms of Service </Text>
                            and &nbsp;
                            <Text className="underline">Privacy Policy</Text>.
                        </Text>

                        <Text className="underline text-xs text-center" style={{color: Colors.Primary["700"]}}
                              onPress={openActionSheet}>
                            Can't log in or sign up?
                        </Text>

                    </View>

                </ImageBackground>
            </View>

            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={0}
                snapPoints={snapPoints}
            >
                <AuthModal authType={authType}/>

            </BottomSheetModal>

        </BottomSheetModalProvider>
    );
}