import { ConfigPlugin, withInfoPlist } from 'expo/config-plugins';

const withIosPlugin: ConfigPlugin = config => {
    return withInfoPlist(config, config => {
        // Add NSCameraUsageDescription
        config.modResults.NSCameraUsageDescription = 'This app uses the camera to allow you to take photos of your documents.';

        // Add NSMicrophoneUsageDescription
        config.modResults.NSMicrophoneUsageDescription = 'This app uses the microphone to record audio for your videos.';

        return config;
    });
};

export default withIosPlugin;
