import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { View } from "react-native";

export default function Category() {
    return(
        <ThemedView
        isTabVisible={false}>
            <View>
                <ThemedText>Category data</ThemedText>
            </View>
        </ThemedView>
    )
}