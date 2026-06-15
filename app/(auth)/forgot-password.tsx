import { Button } from '@/components/Button';
import { InputField } from '@/components/InputField';
import { validateEmail } from '@/lib/validation';
import { useSignIn } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { styled } from 'nativewind';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SafeAreaViewStyled = styled(SafeAreaView);

interface ForgotPasswordFormState {
    email: string;
    errors: Record<string, string | undefined>;
    isLoading: boolean;
    serverError?: string;
    successMessage?: string;
}

export default function ForgotPassword() {
    const { signIn, isLoaded } = useSignIn();
    const router = useRouter();

    const [formState, setFormState] = useState<ForgotPasswordFormState>({
        email: '',
        errors: {},
        isLoading: false,
    });

    const [codeSent, setCodeSent] = useState(false);

    const updateField = (field: string, value: string) => {
        setFormState((prev) => ({
            ...prev,
            [field]: value,
            errors: { ...prev.errors, [field]: '' },
            serverError: '',
            successMessage: '',
        }));
    };

    const handleSendCode = async () => {
        if (!isLoaded) return;

        const errors: Record<string, string> = {};

        if (!validateEmail(formState.email)) {
            errors.email = 'Please enter a valid email address';
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
            await signIn.create({
                strategy: 'reset_password_email_code',
                identifier: formState.email,
            });

            setCodeSent(true);

            setFormState((prev) => ({
                ...prev,
                successMessage: `Check your email at ${formState.email} for the verification code.`,
            }));

            router.push({
                pathname: '/(auth)/reset-password',
                params: {
                    email: formState.email,
                },
            });
        } catch (err: any) {
            const errorMessage =
                err?.errors?.[0]?.message ||
                'Failed to send reset code. Please try again.';

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
                                Reset Password
                            </Text>
                            <Text className="text-base text-muted-foreground">
                                Enter your email to receive a reset code
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

                            {/* Email Field */}
                            <InputField
                                label="Email Address"
                                value={formState.email}
                                onChangeText={(text) => updateField('email', text)}
                                placeholder="you@example.com"
                                error={formState.errors.email}
                                editable={!codeSent}
                            />

                            {/* Send Code Button */}
                            <Button
                                title={formState.isLoading ? 'Sending code...' : 'Send Reset Code'}
                                onPress={handleSendCode}
                                loading={formState.isLoading}
                                disabled={formState.isLoading || codeSent}
                            />

                            {/* Back to Sign In Link */}
                            <View className="mt-8 flex-row items-center justify-center">
                                <Text className="text-sm text-foreground">
                                    Remember your password?{' '}
                                </Text>
                                <Link href="/(auth)/signin" asChild>
                                    <TouchableOpacity activeOpacity={0.7}>
                                        <Text className="text-sm font-semibold text-accent">
                                            Sign In
                                        </Text>
                                    </TouchableOpacity>
                                </Link>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaViewStyled>
    );
}
