import { useTheme } from '@/hooks/useTheme';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ComponentProps } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "./themed-text";
export type ActionButtonProps  = {
    title: string;
    Icon: ComponentProps<typeof MaterialIcons>["name"];
}

export default function ActionButton ({title, Icon}: ActionButtonProps) {
    const { colors } = useTheme();
    return (
        <View 
        style={[styles.ButtonContainer, styles.shadow, {backgroundColor: colors.accent}]}>
            <Pressable
            onPress={()=> alert("Notifications")}
            style={{flexDirection: "row", alignItems: "center"}}
            >
              <MaterialIcons name={Icon} size={30} color={colors.background} style={{marginRight: 5}} />
              <ThemedText type="defaultBold" darkColor={"white"}>{title}</ThemedText>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    ButtonContainer: {
        justifyContent: "center",
        padding: 20,
        borderRadius: 8,
        margin: 5,
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