import React from 'react';
import {Button, Text, TouchableOpacity, View} from 'react-native';
import {useRouter} from "expo-router";
import * as DropDownMenu from 'zeego/dropdown-menu';
import Ionicons from "@expo/vector-icons/Ionicons";
import {Colors} from "@/constants/Colors.ts";

const DropdownPlus = () => {

    const router = useRouter();

    return (
        <DropDownMenu.Root>

            <DropDownMenu.Trigger>
                <TouchableOpacity>
                    <Ionicons name='add' size={24} style={{color: Colors.primaryGray}}/>
                </TouchableOpacity>
            </DropDownMenu.Trigger>

            <DropDownMenu.Content>
                <DropDownMenu.Group>

                    <DropDownMenu.Item key='new-collection' onSelect={() => router.navigate('/(authenticated)/(tabs)/collections/new-collection')}>
                        <DropDownMenu.ItemTitle>
                            Create a Collection
                        </DropDownMenu.ItemTitle>
                    </DropDownMenu.Item>

                </DropDownMenu.Group>
            </DropDownMenu.Content>

        </DropDownMenu.Root>
    );
};

export default DropdownPlus;