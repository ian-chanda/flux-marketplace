import { useTheme } from "@/hooks/useTheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";

export default function Layout() {
    const { colors } = useTheme()


    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: colors.accent,
                tabBarStyle: { 
                    height: 80,
                    backgroundColor: colors.background, 
                    marginTop: -40
                },
                    

            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    headerShown: false,
                    title: "Home",
                    tabBarIcon: ({ color }) => <MaterialIcons name="home" size={24} color={color} />,
                }}
            />

            <Tabs.Screen
                name="selling"
                options={{
                    title: "Selling",
                    headerShown: false,
                    tabBarIcon: ({ color }) => <MaterialIcons name="sell" size={24} color={color} />
                }} />

            <Tabs.Screen
                name="search"
                options={{
                    title: "Search",
                    headerShown: false,
                    tabBarIcon: ({ color }) => <MaterialIcons name="search" size={24} color={color} />
                }} />

            <Tabs.Screen
                name="settings"
                options={{
                    title: "Settings",
                    headerShown: false,
                    tabBarIcon: ({ color }) => <MaterialIcons name="settings" size={24} color={color} />
                }} />

            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    headerShown: false,
                    tabBarIcon: ({ color }) => <MaterialIcons name="person" size={24} color={color} />
                }} />
        </Tabs>
    );
}
