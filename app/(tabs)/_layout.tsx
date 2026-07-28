import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";

export default function Layout() {
    return (
        <Tabs
        screenOptions={{
            tabBarActiveTintColor: "#e91e63",
            tabBarStyle: { backgroundColor: "white" },

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
            name = "selling"
            options={{
                title: "Selling",
                headerShown: false,
                tabBarIcon: ({ color }) => <MaterialIcons name="sell" size={24} color={color} /> }} />

            <Tabs.Screen 
            name = "profile" 
            options={{ 
                title: "Profile",
                headerShown: false, 
                tabBarIcon: ({ color }) => <MaterialIcons name="person" size={24} color={color} /> }} />

            <Tabs.Screen 
            name = "settings" 
            options={{  
                title: "Settings",
                headerShown: false, 
                tabBarIcon: ({ color }) => <MaterialIcons name="settings" size={24} color={color} /> }} />
        </Tabs>
    );
}