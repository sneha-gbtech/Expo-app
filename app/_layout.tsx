import { colors } from '@/constants/theme';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { Stack } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../global.css';

const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (item) {
        console.log(`${key} was used 🚀`);
      } else {
        console.log('No values were found at key: ' + key);
      }
      return item;
    } catch (error) {
      console.error('SecureStore read error:', error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (err) {
      console.error('SecureStore write error:', err);
    }
  },
};

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (isLoaded) {
      SplashScreen.hideAsync();
    }
  }, [isLoaded]);

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      {/* <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected> */}

      {/* <Stack.Protected guard={false}> */}
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="subscriptions/[id]" />
        <Stack.Screen name="Onboarding" />
      {/* </Stack.Protected> */}
    </Stack>
  );
}

export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error('Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY');
  }

  return (
    <GestureHandlerRootView>
      <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
        <RootLayoutNav />
      </ClerkProvider>
    </GestureHandlerRootView>

  );
}
