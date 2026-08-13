import { useTheme } from '@/hooks/useTheme';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { ThemedText } from './themed-text';

export type FormFieldProps = {
  title: string;
  placeholder?: string;
  showBorder?: boolean;
};

export function FormField({ 
  title, 
  placeholder = "Enter value",
  showBorder = true 
}: FormFieldProps) {
  const [value, setValue] = useState(''); 
  const { colors } = useTheme();

  return (
    <View
      style={{
        borderBottomWidth: showBorder ? 1 : 0,
        borderBottomColor: "#D3D3D3",
        flexDirection: "row",
        padding: 10,
        marginHorizontal: 20,
        marginVertical: 8,  // ← Add spacing between rows
        justifyContent: "space-evenly",
      }}>
      <ThemedText 
        type="defaultBold" 
        style={{ 
          flex: 1, 
          paddingTop: 10, 
        }}>
        {title}
      </ThemedText>
      
      <View style={{ flexDirection: "row", gap: 10 }}>
        <View style={styles.textField}>
          <TextInput
            style={{ 
              padding: 10, 
              opacity: 0.5,
              height: 45,  // ← Fixed height
              width: 150   // ← Fixed width
            }}
            onChangeText={setValue} 
            value={value} 
            placeholderTextColor={colors.placeholder}
            placeholder={placeholder}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textField: {
    borderWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 8,
  }
});