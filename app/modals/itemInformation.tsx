import { ThemedView } from "@/components/themed-view";
import { StyleSheet } from "react-native";

const itemSpecTags = [
    {id: 1, nameTag: "Name"}
]

export default function itemInfo() {
    return (
        <ThemedView
        style={{
            paddingHorizontal: 10,
        }}>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        borderWidth: 1,
        borderColor: "black",

    }
})