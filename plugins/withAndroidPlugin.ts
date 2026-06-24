import { AndroidConfig, ConfigPlugin, withAndroidManifest } from 'expo/config-plugins';

const withAndroidPlugin: ConfigPlugin = config => {
  // Add camera and audio permissions
  config = AndroidConfig.Permissions.withPermissions(config, [
    'android.permission.CAMERA',
    'android.permission.RECORD_AUDIO',
  ]);

  return withAndroidManifest(config, config => {
    // The withPermissions helper has already added the permissions to the manifest.
    // You could add other manifest modifications here if needed.
    return config;
  });
};

export default withAndroidPlugin;
