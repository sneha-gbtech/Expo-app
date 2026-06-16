import { colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import clsx from 'clsx';
import React from 'react';
import {
    Text,
    TextInput,
    Pressable,
    View,
} from 'react-native';

interface PasswordFieldProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    error?: string;
    editable?: boolean;
}

export const PasswordField = ({
    label,
    value,
    onChangeText,
    placeholder,
    error,
    editable = true,
}: PasswordFieldProps) => {
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

    return (
        <View className="mb-6 w-full">
            <Text className="mb-2 text-sm font-semibold text-foreground">
                {label}
            </Text>

            <View className="relative">
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder || label}
                    placeholderTextColor={colors.mutedForeground}
                    secureTextEntry={!isPasswordVisible}
                    editable={editable}
                    className={clsx(
                        'rounded-lg border px-4 py-3 pr-12 font-medium text-foreground',
                        error
                            ? 'border-destructive bg-red-50'
                            : 'border-border bg-card'
                    )}
                    style={{
                        color: colors.foreground,
                        fontSize: 16,
                    }}
                />

                <Pressable
                    onPress={() => setIsPasswordVisible(prev => !prev)}
                    className="absolute right-4 top-0 bottom-0 justify-center"
                    hitSlop={10}
                >
                    <Ionicons
                        name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                        size={22}
                        color={colors.mutedForeground}
                    />
                </Pressable>
            </View>

            {error && (
                <Text className="mt-1 text-xs font-medium text-destructive">
                    {error}
                </Text>
            )}
        </View>
    );
};