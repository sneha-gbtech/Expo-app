import { colors } from '@/constants/theme';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { styled } from 'nativewind';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SafeAreaViewStyled = styled(SafeAreaView);

const Settings = () => {
  const { signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      {
        text: 'Cancel',
        onPress: () => { },
        style: 'cancel',
      },
      {
        text: 'Sign Out',
        onPress: async () => {
          setIsSigningOut(true);
          try {
            await signOut();
            router.replace('/(auth)/signin');
          } catch (error) {
            console.error('Sign out error:', error);
            Alert.alert('Error', 'Failed to sign out. Please try again.');
          } finally {
            setIsSigningOut(false);
          }
        },
        style: 'destructive',
      },
    ]);
  };

  return (
    <SafeAreaViewStyled className="flex-1 bg-background">
      <View className="flex-1 px-5 py-8">
        {/* Header */}
        <Text className="mb-8 text-3xl font-bold text-primary">Settings</Text>

        {/* Account Section */}
        <View className="mb-8">
          <Text className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Account
          </Text>

          {/* User Info Card */}
          <View className="rounded-lg border border-border bg-card p-4">
            <Text className="text-xs font-semibold uppercase text-muted-foreground">
              Email
            </Text>
            <Text className="mt-1 text-base font-semibold text-foreground">
              {user?.emailAddresses?.[0]?.emailAddress || 'Not available'}
            </Text>

            <View className="mt-4 border-t border-border pt-4">
              <Text className="text-xs font-semibold uppercase text-muted-foreground">
                Name
              </Text>
              <Text className="mt-1 text-base font-semibold text-foreground">
                {user?.firstName} {user?.lastName}
              </Text>
            </View>
          </View>
        </View>

        {/* Sign Out Section */}
        <View className="mt-auto">
          <TouchableOpacity
            onPress={handleSignOut}
            disabled={isSigningOut}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center justify-center rounded-lg border border-destructive bg-red-50 px-6 py-4">
              {isSigningOut ? (
                <ActivityIndicator color={colors.destructive} size="small" />
              ) : (
                <Text className="text-base font-semibold text-destructive">
                  Sign Out
                </Text>
              )}
            </View>
          </TouchableOpacity>

          {/* App Version */}
          <Text className="mt-6 text-center text-xs text-muted-foreground">
            App Version 1.0.0
          </Text>
        </View>
      </View>
    </SafeAreaViewStyled>
  );
};

export default Settings;