import { useTheme } from "@/hooks/useTheme";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "./themed-text";

export type AdditionalDetails = {
  brand?: string;
  model?: string;
  ram?: string;
  storage?: string;
  color?: string;
};

type AdditionalDetailsModalProps = {
  visible: boolean;
  values: AdditionalDetails;
  onClose: () => void;
  onSave: (values: AdditionalDetails) => void;
};

const fields: { key: keyof AdditionalDetails; label: string; placeholder: string }[] = [
  { key: "brand", label: "Brand", placeholder: "e.g Apple, Samsung" },
  { key: "model", label: "Model", placeholder: "e.g iPhone 13 Pro" },
  { key: "ram", label: "RAM", placeholder: "e.g 8 GB" },
  { key: "storage", label: "Storage", placeholder: "e.g 128 GB" },
  { key: "color", label: "Color", placeholder: "e.g Midnight Black" },
];

export function AdditionalDetailsModal({
  visible,
  values,
  onClose,
  onSave,
}: AdditionalDetailsModalProps) {
  const { colors } = useTheme();
  const [draft, setDraft] = useState<AdditionalDetails>(values);

  const open = (value: boolean) => {
    if (value) {
      setDraft(values);
    }
  };

  const save = () => {
    const cleaned: AdditionalDetails = {};
    (Object.keys(draft) as (keyof AdditionalDetails)[]).forEach((key) => {
      const text = draft[key]?.trim();
      if (text) cleaned[key] = text;
    });
    onSave(cleaned);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      onShow={() => open(true)}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={[styles.sheet, { backgroundColor: colors.background }]}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <ThemedText type="defaultBold">Additional details (Optional)</ThemedText>
            <TouchableOpacity onPress={() => { save(); onClose(); }}>
              <ThemedText type="defaultBold" style={{ color: colors.accent }}>
                Done
              </ThemedText>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
            {fields.map((field) => (
              <View key={field.key} style={styles.field}>
                <ThemedText type="defaultBold" style={{ flex: 1 }}>
                  {field.label}
                </ThemedText>
                <View style={styles.inputBox}>
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    value={draft[field.key]}
                    onChangeText={(text) => setDraft((prev) => ({ ...prev, [field.key]: text }))}
                    placeholder={field.placeholder}
                    placeholderTextColor={colors.placeholder}
                  />
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D3D3D3",
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  inputBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 8,
  },
  input: {
    padding: 10,
    fontSize: 14,
  },
});