import { HOME_BALANCE, HOME_USER } from "@/constants/data";
import images from "@/constants/images";
import { formatCurrency } from "@/lib/utils";
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { styled } from "nativewind";
import { useEffect } from "react";
import { Image, Platform, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView)
export default function Index() {
  const requestPermissions = async () => {
    if (Platform.OS === 'android' && Constants.isDevice && !Constants.appOwnership?.includes('expo')) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === 'granted') {
        console.log('Notification permission granted');
      } else {
        console.log('Notification permission denied');
      }
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <View className="home-header">
        <View className="home-user">
          <Image source={images.avatar} className="home-avatar" />
          <Text className="home-user-name">{HOME_USER.name}</Text>
        </View>
      </View>

      <View className="home-balance-card">
        <Text className="home-balance-label">Balance</Text>
        <View className="home-balance-row">
          <Text className="home-balance-amount">{formatCurrency(HOME_BALANCE.amount)}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
