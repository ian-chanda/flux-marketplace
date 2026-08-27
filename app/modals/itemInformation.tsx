import { CustomHeader } from "@/components/customHeader";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/hooks/useTheme";
import { FlatList, StyleSheet, View } from "react-native";

const itemSpecs = [
    {id: 1, name: "Model", value: "Iphone 78 Pro max"},
    {id: 2, name: "Condition", value: "New"},
    {id: 3, name: "RAM", value: "8 GB"},
    {id: 4, name: "Network Generation", value: "5G"},
    {id: 5, name: "Storage Capacity", value: "128 GB"},
    {id: 6, name: "Operating system", value: "IOS"},
    {id: 7, name: "Brand", value: "Apple"}

]

export default function itemInfo() {
    const { colors } = useTheme();
    return (
        <ThemedView
        style={{
            paddingHorizontal: 5,
        }}>
            <CustomHeader 
            title="Item Information"
            showBack/>
            <FlatList
            style={{
                paddingTop: 30
            }}
            data={itemSpecs}
            renderItem={({item}) => (
                <View
                style={{
                    padding: 10,
                    paddingHorizontal: 10,
                    borderBottomColor: colors.surface,
                    borderBottomWidth: 1,
                    flexDirection: "row",
                    justifyContent: "space-between"
                }}>
                    <ThemedText>{item.name}</ThemedText>
                    <ThemedText>{item.value}</ThemedText>
                </View>
            )}
            />
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        borderWidth: 1,
        borderColor: "black",

    }
})