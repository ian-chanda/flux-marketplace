import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export const NavRow = ({
  icon,
  label,
  value,
  placeholder = "Select",
  required,
  onPress,
}: {
  icon?: keyof typeof MaterialIcon.glyphMap;
  label: string;
  value?: string;
  placeholder?: string;
  required?: boolean;
  onPress: () => void;
}) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.navRow, { backgroundColor: colors.surface }]}
    >
      {icon && <MaterialIcon name={icon} size={22} color={colors.accent} />}

      <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'column' }}>
          <ThemedText type="defaultBold" style={{ flex: 1 }}>
            {label}
            {required && <ThemedText style={{ color: colors.accent }}> *</ThemedText>}
          </ThemedText>
          <ThemedText
            type="default"
            numberOfLines={1}
            style={{ maxWidth: 150, color: value ? colors.accent : colors.placeholder }}
          >
            {value || placeholder}
          </ThemedText>
        </View>

        <Ionicons name="chevron-forward" size={20} color={colors.placeholder} />
      </View>
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  page: {
    padding: 15,
    gap: 28,
    paddingBottom: 30,
  },
  input: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
  },
  multiline: {
    minHeight: 110,
  },
  priceField: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignSelf: "flex-start",
    minWidth: 160,
  },
  priceInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  navRow: {
    width: '100%',
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 12,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  addTile: {
    width: 88,
    height: 88,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  thumb: {
    width: 88,
    height: 88,
    borderRadius: 12,
  },
  coverTag: {
    position: "absolute",
    left: 4,
    bottom: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  removeButton: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  footer: {
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
