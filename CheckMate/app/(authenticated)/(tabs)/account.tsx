import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {useAuth} from "@clerk/clerk-expo";
import {Colors} from "@/constants/Colors";
import ActionButton from "@/components/uiComponents/ActionButton.tsx";

const Account = () => {
    const {signOut} = useAuth();

    return (
        <View className=" justify-center w-full h-full" style={{backgroundColor: Colors.Complementary["300"]}}>

            {/* Button to delete the collection */}

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
    );
};

export default Account;