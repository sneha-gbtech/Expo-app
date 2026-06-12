import { Link } from "expo-router";
import React from 'react';
import { Text, View } from 'react-native';

const Signin = () => {
  return (
    <View>
      <Text>Sign In</Text>
      <Link href="/(auth)/signup" className="mt-4 text-blue-500">
        Create Account
      </Link>
    </View>
  )
}

export default Signin