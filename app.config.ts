import { ExpoConfig } from 'expo/config';
import 'tsx/cjs';

module.exports = ({ config }: { config: ExpoConfig }) => ({
  "name": "expo-app",
  "slug": "expo-app",
  "version": "1.0.0",
  "orientation": "portrait",
  "icon": "./assets/images/icon.png",
  "scheme": "expoapp",
  "userInterfaceStyle": "automatic",
  "newArchEnabled": true,
  "ios": {
    "supportsTablet": true,
    "buildNumber": "com.sneha.expoapp"
  },
  "android": {
    "adaptiveIcon": {
      "backgroundColor": "#E6F4FE",
      "foregroundImage": "./assets/images/android-icon-foreground.png",
      "backgroundImage": "./assets/images/android-icon-background.png",
      "monochromeImage": "./assets/images/android-icon-monochrome.png"
    },
    "edgeToEdgeEnabled": true,
    "predictiveBackGestureEnabled": false,
    "package": "com.sneha.expoapp"
  },
  "web": {
    "output": "static",
    "favicon": "./assets/images/favicon.png",
    "bundler": "metro"
  },
  "plugins": [
    "expo-camera",
    "./plugins/withPlugin",
    "expo-router",
    [
      "expo-splash-screen",
      {
        "image": "./assets/images/splash-icon.png",
        "imageWidth": 200,
        "resizeMode": "contain",
        "backgroundColor": "#ffffff",
        "dark": {
          "backgroundColor": "#000000"
        }
      }
    ]
  ],
  "experiments": {
    "typedRoutes": true,
    "reactCompiler": true
  },
  "extra": {
    "router": {},
    "eas": {
      "projectId": "e19eef30-30ce-4145-9f7d-970bb35f3bf8"
    }
  }
})