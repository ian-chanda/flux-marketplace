import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { View } from "react-native";

export default function Location() {
    return(
        <ThemedView
        isTabVisible={false}>
            <View>
                <ThemedText>Location data</ThemedText>
            </View>
        </ThemedView>
    )
}