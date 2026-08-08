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
                name="(search)"
                options={{
                    headerShown: false,
                    title: "Search",
                    tabBarIcon: ({ color }) => <MaterialIcons name="search" size={24} color={color} />,
                }}
            />

            <Tabs.Screen
                name="messages"
                options={{
                    title: "Messages",
                    headerShown: false,
                    tabBarIcon: ({ color }) => <MaterialIcons name="mail" size={24} color={color} />
                }} />

            <Tabs.Screen
                name="me"
                options={{
                    title: "Me",
                    headerShown: false,
                    tabBarIcon: ({ color }) => <MaterialIcons name="person" size={24} color={color} />
                }} />
        </Tabs>
    );
}
