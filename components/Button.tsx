import { useTheme } from '@/hooks/useTheme';
import { ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from './themed-text';

export type ButtonProps = {
    title: string;
    loading?: boolean;
    disabled?: boolean;
    onPress: () => void;
}

export default function Button({ title, loading = false, disabled = false, onPress }: ButtonProps) {
    const { colors } = useTheme();

    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor: disabled ? colors.disabled : colors.accent }]}
            disabled={disabled}
            onPress={() => onPress()}
        >
            {loading ?
                <ActivityIndicator size={24} color={colors.background} />
                :
                <ThemedText type="ButtonText" numberOfLines={1} darkColor={colors.background}>
                    {title}
                </ThemedText>
            }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 20,
        paddingHorizontal: 2,
        borderRadius: 60,
        alignItems: "center",
        marginTop: 10,
        alignSelf: "center",
        minWidth: '80%',
        maxWidth: '80%'
    },
});
