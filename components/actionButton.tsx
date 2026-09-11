import { useTheme } from '@/hooks/useTheme';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ComponentProps } from "react";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "./themed-text";
export type ActionButtonProps = {
    title: string;
    Icon: ComponentProps<typeof MaterialIcons>["name"];
    onPress: () => void;
}

export default function ActionButton({ title, Icon, onPress }: ActionButtonProps) {
    const { colors } = useTheme();
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{ 
                backgroundColor: colors.accent, 
                borderRadius: 12, 
                paddingVertical: 20, 
                paddingHorizontal: 5, 
                flexDirection: "row", 
                alignItems: "center", 
                justifyContent: 'center' 
            }}
        >
            <MaterialIcons name={Icon} size={30} color={colors.text} style={{ marginRight: 5 }} />
            <ThemedText type="defaultBold" darkColor={"white"}>{title}</ThemedText>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    ButtonContainer: {
        justifyContent: "center",
        padding: 2,
        borderRadius: 8,
        flexDirection: "row",
        flex: 1,
        height: 65,
        alignItems: "center",
    },
    shadow: {

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3
    }
})
