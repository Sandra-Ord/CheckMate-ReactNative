import React from 'react';
import {Button, Text, View} from 'react-native';
import {useAuth} from "@clerk/clerk-expo";

const Account = () => {
    const {signOut} = useAuth();

    return (
        <View>
            <Button title="Sign out" onPress={() => signOut()}/>
        </View>
    );
};

export default Account;