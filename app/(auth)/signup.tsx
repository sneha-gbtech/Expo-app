import { Button } from '@/components/Button';
import { InputField } from '@/components/InputField';
import { colors } from '@/constants/theme';
import { validateSignUp } from '@/lib/validation';
import { useSignUp } from '@clerk/clerk-expo';
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

interface SignUpFormState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  errors: Record<string, string | undefined>;
  isLoading: boolean;
  serverError?: string;
  pendingVerification: boolean;
  verificationCode: string;
}

export default function SignUp() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();

  const [formState, setFormState] = useState<SignUpFormState>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    errors: {},
    isLoading: false,
    pendingVerification: false,
    verificationCode: '',
  });

  const updateField = (field: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
      errors: { ...prev.errors, [field]: '' },
      serverError: '',
    }));
  };

  const handleSignUp = async () => {
    if (!isLoaded) return;

    // Validate form
    const errors = validateSignUp(
      formState.email,
      formState.password,
      formState.confirmPassword,
      formState.firstName,
      formState.lastName
    );

    if (Object.keys(errors).length > 0) {
      setFormState((prev) => ({
        ...prev,
        errors,
      }));
      return;
    }

    setFormState((prev) => ({ ...prev, isLoading: true, serverError: '' }));

    try {
      const signUpAttempt = await signUp.create({
        emailAddress: formState.email,
        password: formState.password,
        firstName: formState.firstName,
        lastName: formState.lastName,
      });

      // Start email verification
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      setFormState((prev) => ({
        ...prev,
        pendingVerification: true,
        isLoading: false,
      }));
    } catch (err: any) {
      const errorMessage = err?.errors?.[0]?.message || 'Sign up failed. Please try again.';
      setFormState((prev) => ({
        ...prev,
        serverError: errorMessage,
        isLoading: false,
      }));
    }
  };

  const handleVerifyEmail = async () => {
    if (!isLoaded || !formState.verificationCode) {
      setFormState((prev) => ({
        ...prev,
        serverError: 'Please enter the verification code',
      }));
      return;
    }

    setFormState((prev) => ({ ...prev, isLoading: true, serverError: '' }));

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: formState.verificationCode,
      });

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace('/(tabs)');
      } else {
        setFormState((prev) => ({
          ...prev,
          serverError: 'Verification failed. Please try again.',
        }));
      }
    } catch (err: any) {
      const errorMessage = err?.errors?.[0]?.message || 'Verification failed. Please try again.';
      setFormState((prev) => ({
        ...prev,
        serverError: errorMessage,
      }));
    } finally {
      setFormState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  // Verification Screen
  if (formState.pendingVerification) {
    return (
      <SafeAreaViewStyled className="flex-1 bg-background">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
            <View className="flex-1 justify-between px-5 py-8">
              {/* Header */}
              <View className="mb-8">
                <Text className="mb-2 text-3xl font-bold text-primary">
                  Verify Your Email
                </Text>
                <Text className="text-base text-muted-foreground">
                  We sent a verification code to{'\n'}
                  <Text className="font-semibold text-foreground">{formState.email}</Text>
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

                {/* Verification Code Field */}
                <InputField
                  label="Verification Code"
                  value={formState.verificationCode}
                  onChangeText={(text) => updateField('verificationCode', text)}
                  placeholder="000000"
                />

                {/* Verify Button */}
                <Button
                  title={formState.isLoading ? 'Verifying...' : 'Verify Email'}
                  onPress={handleVerifyEmail}
                  loading={formState.isLoading}
                  disabled={formState.isLoading}
                />

                {/* Back to Sign Up */}
                <View className="mt-8 flex-row items-center justify-center">
                  <Text className="text-sm text-foreground">
                    Didn't receive the code?{' '}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setFormState((prev) => ({
                        ...prev,
                        pendingVerification: false,
                        verificationCode: '',
                      }));
                    }}
                    activeOpacity={0.7}
                  >
                    <Text className="text-sm font-semibold text-accent">
                      Start over
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaViewStyled>
    );
  }

  // Sign Up Form
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
                Create Account
              </Text>
              <Text className="text-base text-muted-foreground">
                Sign up to start managing your subscriptions
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

              {/* Name Fields */}
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <InputField
                    label="First Name"
                    value={formState.firstName}
                    onChangeText={(text) => updateField('firstName', text)}
                    placeholder="Jane"
                    error={formState.errors.firstName}
                  />
                </View>
                <View className="flex-1">
                  <InputField
                    label="Last Name"
                    value={formState.lastName}
                    onChangeText={(text) => updateField('lastName', text)}
                    placeholder="Doe"
                    error={formState.errors.lastName}
                  />
                </View>
              </View>

              {/* Email Field */}
              <InputField
                label="Email Address"
                value={formState.email}
                onChangeText={(text) => updateField('email', text)}
                placeholder="you@example.com"
                error={formState.errors.email}
              />

              {/* Password Field */}
              <InputField
                label="Password"
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

              {/* Password Requirements */}
              <View className="mb-8 rounded-lg bg-muted p-4">
                <Text className="mb-2 text-xs font-semibold text-foreground">
                  Password requirements:
                </Text>
                <Text className="text-xs text-muted-foreground">
                  • At least 8 characters
                </Text>
              </View>

              {/* Sign Up Button */}
              <Button
                title={formState.isLoading ? 'Creating account...' : 'Create Account'}
                onPress={handleSignUp}
                loading={formState.isLoading}
                disabled={formState.isLoading}
              />

              {/* Divider */}
              <View className="my-8 flex-row items-center">
                <View className="flex-1" style={{ height: 1, backgroundColor: colors.border }} />
                <Text className="px-4 text-sm text-muted-foreground">or</Text>
                <View className="flex-1" style={{ height: 1, backgroundColor: colors.border }} />
              </View>

              {/* Sign In Link */}
              <View className="flex-row items-center justify-center">
                <Text className="text-sm text-foreground">
                  Already have an account?{' '}
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