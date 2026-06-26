const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
    // [Web-only]: Enables CSS support in Metro.
    isCSSEnabled: true,
});

// Add .fx file extension to the list of source extensions.
// This is needed for expo-notifications to work correctly with the Metro bundler.
config.resolver.sourceExts.push('fx');

module.exports = withNativeWind(config);