import { useTheme } from '@/hooks/useTheme';
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';

export type ButtonProps = {
    title: string;
    onPress: () => void;
}

export default function Button({ title, onPress }: ButtonProps) {
    const { colors } = useTheme();

    return (
        <View>
            <View style={[styles.button, { backgroundColor: colors.accent }]}> 
                <Pressable onPress={onPress}>
                    <ThemedText type="ButtonText" darkColor="white">{title}</ThemedText>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 20,
        paddingHorizontal: 100,
        borderRadius: 60,
        alignItems: "center",
        marginTop: 10,
        alignSelf: "center",
    },
});