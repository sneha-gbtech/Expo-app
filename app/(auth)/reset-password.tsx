import { Button } from '@/components/Button';
import { InputField } from '@/components/InputField';
import { validatePassword } from '@/lib/validation';
import { useSignIn } from '@clerk/clerk-expo';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { styled } from 'nativewind';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SafeAreaViewStyled = styled(SafeAreaView);

interface ResetPasswordFormState {
    code: string;
    password: string;
    confirmPassword: string;
    errors: Record<string, string | undefined>;
    isLoading: boolean;
    serverError?: string;
    successMessage?: string;
}

export default function ResetPassword() {
    const { signIn, setActive, isLoaded } = useSignIn();
    const router = useRouter();
    const { email } = useLocalSearchParams<{ email: string }>();

    const [formState, setFormState] = useState<ResetPasswordFormState>({
        code: '',
        password: '',
        confirmPassword: '',
        errors: {},
        isLoading: false,
    });

    const updateField = (field: string, value: string) => {
        setFormState((prev) => ({
            ...prev,
            [field]: value,
            errors: { ...prev.errors, [field]: '' },
            serverError: '',
        }));
    };

    const handleResetPassword = async () => {
        if (!isLoaded) return;

        const errors: Record<string, string> = {};

        if (!formState.code.trim()) {
            errors.code = 'Verification code is required';
        }

        const passwordError = validatePassword(formState.password);

        if (passwordError) {
            errors.password = passwordError;
        }

        if (formState.password !== formState.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        if (Object.keys(errors).length > 0) {
            setFormState((prev) => ({
                ...prev,
                errors,
            }));
            return;
        }

        setFormState((prev) => ({
            ...prev,
            isLoading: true,
            serverError: '',
        }));

        try {
            const result = await signIn.attemptFirstFactor({
                strategy: 'reset_password_email_code',
                code: formState.code,
                password: formState.password,
            });

            if (result.status === 'complete') {
                await setActive({
                    session: result.createdSessionId,
                });

                router.replace('/(tabs)');
            } else {
                setFormState((prev) => ({
                    ...prev,
                    serverError:
                        'Password reset could not be completed. Please try again.',
                }));
            }
        } catch (err: any) {
            const errorMessage =
                err?.errors?.[0]?.message ||
                'Invalid verification code or password reset failed.';

            setFormState((prev) => ({
                ...prev,
                serverError: errorMessage,
            }));
        } finally {
            setFormState((prev) => ({
                ...prev,
                isLoading: false,
            }));
        }
    };

    return (
        <SafeAreaViewStyled className="flex-1 bg-background">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View className="flex-1 justify-between px-5 py-8">
                        {/* Header */}
                        <View className="mb-8">
                            <Text className="mb-2 text-3xl font-bold text-primary">
                                Create New Password
                            </Text>
                            <Text className="text-base text-muted-foreground">
                                {email && `We sent a code to ${email}`}
                            </Text>
                        </View>

                        {/* Form */}
                        <View className="flex-1">
                            {/* Server Error */}
                            {formState.serverError && (
                                <View className="mb-6 rounded-lg border border-destructive bg-red-50 p-4">
                                    <Text className="text-sm font-medium text-destructive">
                                        {formState.serverError}
                                    </Text>
                                </View>
                            )}

                            {/* Success Message */}
                            {formState.successMessage && (
                                <View className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
                                    <Text className="text-sm font-medium text-green-700">
                                        {formState.successMessage}
                                    </Text>
                                </View>
                            )}

                            {/* Code Field */}
                            <InputField
                                label="Reset Code"
                                value={formState.code}
                                onChangeText={(text) => updateField('code', text)}
                                placeholder="Enter 6-digit code"
                                error={formState.errors.code}
                            />

                            {/* Password Field */}
                            <InputField
                                label="New Password"
                                value={formState.password}
                                onChangeText={(text) => updateField('password', text)}
                                placeholder="••••••••"
                                secureTextEntry
                                error={formState.errors.password}
                            />

                            {/* Confirm Password Field */}
                            <InputField
                                label="Confirm Password"
                                value={formState.confirmPassword}
                                onChangeText={(text) => updateField('confirmPassword', text)}
                                placeholder="••••••••"
                                secureTextEntry
                                error={formState.errors.confirmPassword}
                            />

                            {/* Password Requirements Info */}
                            <View className="mb-8 rounded-lg bg-accent/10 p-4">
                                <Text className="text-xs font-semibold text-accent mb-2">
                                    Password Requirements
                                </Text>
                                <Text className="text-xs text-muted-foreground leading-5">
                                    • At least 8 characters long{'\n'}
                                    • Contains uppercase and lowercase letters{'\n'}
                                    • Contains at least one number
                                </Text>
                            </View>

                            {/* Reset Password Button */}
                            <Button
                                title={formState.isLoading ? 'Resetting password...' : 'Reset Password'}
                                onPress={handleResetPassword}
                                loading={formState.isLoading}
                                disabled={formState.isLoading}
                            />
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaViewStyled>
    );
}
