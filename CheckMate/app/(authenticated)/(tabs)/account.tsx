import React, {useCallback, useState} from 'react';
import {Alert, Text, View} from 'react-native';
import {useAuth} from "@clerk/clerk-expo";
import {useFocusEffect} from "expo-router";
import {useSupabase} from "@/context/SupabaseContext";
import {Colors} from "@/constants/Colors";
import ActionButton from "@/components/uiComponents/ActionButton";
import VerticalInput from "@/components/uiComponents/VerticalInput";
import SeparatorLine from "@/components/uiComponents/SeparatorLine";
import UserListItem from "@/components/UserListItem.tsx";

const Account = () => {
    const {signOut} = useAuth();

    const [user, setUser] = useState();
    const [firstName, setFirstName] = useState();
    const [nickName, setNickName] = useState();

    const {getUserName, setUserName, getUser} = useSupabase();

    // -----------------------------------------------------------------------------------------------------------------
    // -------------------------------------------- DATABASE OPERATIONS ------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------

    const onUpdateUserName = async () => {
        if (!nickName.trim()) {
            Alert.alert("Missing Username", "Please enter a username for updating.")
            return;
        }
        await setUserName(nickName.trim());
        await loadUserName();
        await loadUser();
    }

    // -----------------------------------------------------------------------------------------------------------------
    // -------------------------------------------- LOAD INFORMATION ---------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------

    const loadUserName = async () => {
        const data = await getUserName();
        setFirstName(data.first_name);
        setNickName(data.first_name);
    };

    const loadUser = async () => {
        const data = await getUser();
        setUser(data);
    };


    useFocusEffect(
        useCallback(() => {
            loadUserName();
            loadUser();
        }, [])
    );

    return (
        <View className=" w-full h-full" style={{backgroundColor: Colors.Complementary["300"]}}>

            <View className="px-4 py-4 gap-y-5">

                <Text className="text-sm italic"  style={{color: Colors.Primary["600"]}}>
                    This is how you appear to other users.
                </Text>

                {user && (
                    <UserListItem element={{item: user}} onPress={() => {}}/>
                )}

                <SeparatorLine height={0.5} margin={2} color={Colors.Complementary["600"]}/>

                <View className="gap-y-5">
                    <View>
                        <VerticalInput
                            labelText="User Name: "
                            placeholder=""
                            value={nickName}
                            onChangeText={setNickName}
                        />

                    </View>
                    {firstName !== nickName && (
                        <View className="items-center">
                            <ActionButton onPress={onUpdateUserName} iconName={"checkmark-circle-outline"}
                                          text={"Update User Name"} textColor={Colors.Complementary["100"]}
                                          buttonColor={Colors.Yellow["600"]}/>
                        </View>
                    )}

                </View>

                <SeparatorLine height={0.5} margin={2} color={Colors.Complementary["600"]}/>

                <View className="items-center pt-8">
                    <ActionButton
                        onPress={signOut}
                        iconName={"log-out-outline"}
                        text={"Sign Out"}
                        textColor={Colors.Complementary["100"]}
                        buttonColor={Colors.Blue["600"]}
                    />
                </View>

            </View>
        </View>
    );
};

export default Account;