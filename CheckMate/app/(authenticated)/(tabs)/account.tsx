import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {useAuth} from "@clerk/clerk-expo";
import {Colors} from "@/constants/Colors";

const Account = () => {
    const {signOut} = useAuth();

    return (
        <View className=" justify-center w-full h-full" style={{backgroundColor: Colors.Complementary["300"]}}>

            {/* Button to delete the collection */}
            <View className="pt-8">
                <TouchableOpacity
                    className="py-2 mx-16 rounded-lg items-center"
                    style={{backgroundColor: Colors.Blue["600"]}}
                    onPress={() => signOut()}
                >
                    <Text className="font-bold">Sign Out</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Account;