import { Button } from '@/components/Button';
import { InputField } from '@/components/InputField';
import { colors } from '@/constants/theme';
import { validateSignIn } from '@/lib/validation';
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

interface SignInFormState {
  email: string;
  password: string;
  errors: Record<string, string | undefined>;
  isLoading: boolean;
  serverError?: string;
}

export default function SignIn() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [formState, setFormState] = useState<SignInFormState>({
    email: '',
    password: '',
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

  const handleSignIn = async () => {
    if (!isLoaded) return;

    // Validate form
    const errors = validateSignIn(formState.email, formState.password);
    if (Object.keys(errors).length > 0) {
      setFormState((prev) => ({
        ...prev,
        errors,
      }));
      return;
    }

    setFormState((prev) => ({ ...prev, isLoading: true, serverError: '' }));

    try {
      const signInAttempt = await signIn.create({
        identifier: formState.email,
        password: formState.password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('/(tabs)');
      } else {
        setFormState((prev) => ({
          ...prev,
          serverError: 'Sign in failed. Please check your credentials.',
        }));
      }
    } catch (err: any) {
      const errorMessage = err?.errors?.[0]?.message || 'Sign in failed. Please try again.';
      setFormState((prev) => ({
        ...prev,
        serverError: errorMessage,
      }));
    } finally {
      setFormState((prev) => ({ ...prev, isLoading: false }));
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
                Welcome Back
              </Text>
              <Text className="text-base text-muted-foreground">
                Sign in to manage your subscriptions
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

              {/* Forgot Password Link */}
              <View className="mb-8">
                <TouchableOpacity activeOpacity={0.7}>
                  <Text className="text-sm font-semibold text-accent">
                    Forgot password?
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Sign In Button */}
              <Button
                title={formState.isLoading ? 'Signing in...' : 'Sign In'}
                onPress={handleSignIn}
                loading={formState.isLoading}
                disabled={formState.isLoading}
              />

              {/* Divider */}
              <View className="my-8 flex-row items-center">
                <View className="flex-1" style={{ height: 1, backgroundColor: colors.border }} />
                <Text className="px-4 text-sm text-muted-foreground">or</Text>
                <View className="flex-1" style={{ height: 1, backgroundColor: colors.border }} />
              </View>

              {/* Sign Up Link */}
              <View className="flex-row items-center justify-center">
                <Text className="text-sm text-foreground">
                  Don't have an account?{' '}
                </Text>
                <Link href="/(auth)/signup" asChild>
                  <TouchableOpacity activeOpacity={0.7}>
                    <Text className="text-sm font-semibold text-accent">
                      Sign Up
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