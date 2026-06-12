import Ionicons from "@expo/vector-icons/Ionicons";

export const tabs: { name: string; title: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { name: "index", title: "Home", icon: "home-outline" },
    { name: "Subscriptions", title: "Subscriptions", icon: "list-outline" },
    { name: "Settings", title: "Settings", icon: "settings-outline" },
]