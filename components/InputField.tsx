import { colors } from '@/constants/theme';
import clsx from 'clsx';
import { Text, TextInput, View } from 'react-native';

interface InputFieldProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    secureTextEntry?: boolean;
    error?: string;
    editable?: boolean;
}

export const InputField = ({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry = false,
    error,
    editable = true,
}: InputFieldProps) => {
    return (
        <View className="mb-6 w-full">
            <Text className="mb-2 text-sm font-semibold text-foreground">
                {label}
            </Text>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder || label}
                placeholderTextColor={colors.mutedForeground}
                secureTextEntry={secureTextEntry}
                editable={editable}
                className={clsx(
                    'rounded-lg border px-4 py-3 font-medium text-foreground',
                    error
                        ? 'border-destructive bg-red-50'
                        : 'border-border bg-card'
                )}
                style={{
                    color: colors.foreground,
                    fontSize: 16,
                }}
            />
            {error && (
                <Text className="mt-1 text-xs font-medium text-destructive">
                    {error}
                </Text>
            )}
        </View>
    );
};
