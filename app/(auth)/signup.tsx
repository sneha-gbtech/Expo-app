import { Link } from "expo-router";
import React from 'react';
import { Text, View } from 'react-native';

const Signup = () => {
  return (
    <View>
      <Text>Signup</Text>
      <Link href="/(auth)/signin" className="mt-4 text-blue-500">
        Already have an account? Sign In
      </Link>
    </View>
  )
}

export default Signup