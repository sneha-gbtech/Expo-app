import Ionicons from '@expo/vector-icons/Ionicons';
import clsx from 'clsx';
import { Tabs } from "expo-router";
import { View } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { tabs } from "../constants/data";
import { colors, components } from '../constants/theme';

const tabBar = components.tabBar;

const TabLayout = () => {
    const insets = useSafeAreaInsets();
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: {
                position: 'absolute',
                bottom: Math.max(insets.bottom, tabBar.horizontalInset),
                borderRadius: tabBar.radius,
                backgroundColor: colors.primary,
                height: tabBar.height,
                marginHorizontal: tabBar.horizontalInset,
                borderTopWidth: 0,
                elevation: 0,
            },
            tabBarItemStyle: {
                paddingVertical: tabBar.height / 2 - tabBar.iconFrame / 1.6
            },
            tabBarIconStyle: {
                width: tabBar.iconFrame,
                height: tabBar.iconFrame,
                alignItems: 'center',
            }
        }}

        >
            {
                tabs.map((tab) => (
                    <Tabs.Screen
                        key={tab.name}
                        name={tab.name}
                        options={{
                            title: tab.title,
                            tabBarIcon: ({ size, focused }) => (
                                <View className="flex-1 items-center justify-center">
                                    <View className={clsx('rounded-full text-white p-3', focused && 'bg-blue-500 text-white')} >
                                        <Ionicons name={tab.icon} size={size} color={focused ? 'white' : 'lightgray'} />
                                    </View>
                                </View>
                            ),
                        }}
                    />
                ))
            }
        </Tabs>
    )
}

export default TabLayout 