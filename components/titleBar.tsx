import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { type ComponentProps } from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "./themed-text";

interface SectionHeaderProps {
  icon: ComponentProps<typeof Ionicons>["name"];
  title: string;
  description?: string;  // ← Make optional
  iconColor?: string;
  iconSize?: number;
}

export const SectionHeader = ({
  icon,
  title,
  description,
  iconColor,
  iconSize = 20
}: SectionHeaderProps) => {
  const { colors } = useTheme();
  return (
    <>
      <View style={[sytles.header]}>
        <Ionicons name={icon} size={iconSize} color={colors.accent} />
        <ThemedText type="defaultBold">{title}</ThemedText>
      </View>
      {description && (
        <View style={{ marginLeft: 10 }}>
          <ThemedText type="smallFaded">{description}</ThemedText>
        </View>
      )}
    </>
  );
};

const sytles = StyleSheet.create({
    header: {
    flexDirection: "row", 
    gap: 7, 
    margin: 10
  }
})