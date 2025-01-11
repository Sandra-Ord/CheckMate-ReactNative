import React, {useCallback, useState} from 'react';
import {Text, View} from 'react-native';
import {useAuth} from "@clerk/clerk-expo";
import {Colors} from "@/constants/Colors";
import ActionButton from "@/components/uiComponents/ActionButton";
import VerticalInput from "@/components/uiComponents/VerticalInput";
import {useFocusEffect} from "expo-router";
import {useSupabase} from "@/context/SupabaseContext";

const Account = () => {
    const {signOut} = useAuth();

    const [firstName, setFirstName] = useState();
    const [nickName, setNickName] = useState();

    const {getUserName, setUserName} = useSupabase();

    // -----------------------------------------------------------------------------------------------------------------
    // -------------------------------------------- DATABASE OPERATIONS ------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------

    const onUpdateUserName = async () => {
        if (!nickName.trim()) {
            alert("Please enter a username for updating.")
            return;
        }
        await setUserName(nickName.trim());
        await loadUserName();
    }
    
    // -----------------------------------------------------------------------------------------------------------------
    // -------------------------------------------- LOAD INFORMATION ---------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------

    const loadUserName = async () => {
        const data = await getUserName();
        setFirstName(data.first_name);
        setNickName(data.first_name);
    };

    useFocusEffect(
        useCallback(() => {
            loadUserName();
        }, [])
    );

    return (
        <View className=" w-full h-full" style={{backgroundColor: Colors.Complementary["300"]}}>

            <View className="px-4 py-4 gap-y-5">
                {/* Button to delete the collection */}
                <View className="gap-y-5">
                    <View>
                        <VerticalInput
                            labelText="User Name: "
                            placeholder=""
                            value={nickName}
                            onChangeText={setNickName}
                        />
                        <Text className="text-sm italic" style={{color: Colors.Primary["600"]}}>This name is visible to others.</Text>
                    </View>
                    {firstName !== nickName && (
                    <View className="items-center">
                        <ActionButton onPress={onUpdateUserName} iconName={"checkmark-circle-outline"} text={"Update User Name"} textColor={Colors.Complementary["100"]} buttonColor={Colors.Yellow["600"]}/>
                    </View>
                    )}

                </View>



                <View style={{height: 0.5, backgroundColor: Colors.Complementary["500"]}}></View>

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