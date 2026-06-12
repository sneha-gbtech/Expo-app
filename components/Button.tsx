import { colors } from '@/constants/theme';
import clsx from 'clsx';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

interface ButtonProps {
    title: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    variant?: 'primary' | 'secondary';
    size?: 'lg' | 'md' | 'sm';
}

export const Button = ({
    title,
    onPress,
    loading = false,
    disabled = false,
    variant = 'primary',
    size = 'lg',
}: ButtonProps) => {
    const isDisabled = disabled || loading;

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.8}
        >
            <View
                className={clsx(
                    'flex-row items-center justify-center rounded-lg font-semibold',
                    size === 'lg' && 'px-6 py-4',
                    size === 'md' && 'px-5 py-3',
                    size === 'sm' && 'px-4 py-2',
                    variant === 'primary' && !isDisabled
                        ? 'bg-primary'
                        : variant === 'primary' && isDisabled
                            ? 'bg-muted'
                            : variant === 'secondary' && !isDisabled
                                ? 'border border-primary bg-background'
                                : 'border border-muted bg-background'
                )}
            >
                {loading ? (
                    <ActivityIndicator
                        color={variant === 'primary' ? colors.card : colors.primary}
                        size="small"
                    />
                ) : (
                    <Text
                        className={clsx(
                            'font-semibold',
                            variant === 'primary' && !isDisabled
                                ? 'text-card'
                                : 'text-primary',
                            size === 'lg' && 'text-base',
                            size === 'md' && 'text-sm',
                            size === 'sm' && 'text-xs'
                        )}
                    >
                        {title}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );
};
