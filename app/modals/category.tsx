import { CustomSearchBar } from "@/components/customSearchBar";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/hooks/useTheme";
import { getCategory, setCategory } from "@/lib/listingDraft";
import { Ionicons } from "@expo/vector-icons";
import { router } from 'expo-router';
import { useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

const categories = [
    {id: 1, name: "Phones & Tablets", icon: "phone-portrait"},
    {id: 2, name: "Laptops & Computers", icon: "laptop"},
    {id: 3, name: "Gaming", icon: "game-controller"},
    {id: 4, name: "Audio", icon: "headset"},
    {id: 5, name: "Wearables", icon: "watch"},
    {id: 6, name: "Cameras & Photography", icon: "camera"},
    {id: 7, name: "TVs & Home Entertainment", icon: "tv"},
    {id: 8, name: "Accessories", icon: "bag"},
    {id: 9, name: "Smart Home", icon: "home"},
    {id: 10, name: "Other", icon: "ellipsis-horizontal"}
]

export default function Category() {
    const [searchValue, setSearchValue] = useState("");
    const { colors } = useTheme();

    const savedCategory = getCategory();
    const [selectedId, setSelectedId] = useState<number | null>(
        categories.find((c) => c.name === savedCategory)?.id ?? null
    );

    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    const handleSelectCategory = (categoryId: number, categoryName: string) => {
        setSelectedId(categoryId);
        setCategory(categoryName);
        router.back();
    };

    return(
        <ThemedView
        isTabVisible={false}
        style={{paddingHorizontal: 10}}>
            <CustomSearchBar 
            width={"100%"}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            onSearch={()=> alert("No")}
            />
            <FlatList
            style={{paddingTop: 50}}
            data={filteredCategories} 
            renderItem={({ item }) => (
                <TouchableOpacity
                onPress={() => handleSelectCategory(item.id, item.name)}
                style={[
                    styles.field,
                    selectedId === item.id && { 
                        borderWidth: 1,
                        borderColor: colors.surface,
                        borderRadius: 23
                    }
                ]}>
                    <View
	                style={{
                    flexDirection: "row",
                    gap: 20
                }}>
	            <View
                style={[styles.icon, {backgroundColor: colors.surface}]}>
                <Ionicons name={item.icon as any} size={20} color={colors.accent}/> 
                </View>
                <View
                style={{
                    justifyContent: "center",
                    alignItems: "flex-start"
                }}>
                    <ThemedText>{item.name}</ThemedText>
                </View>
	            </View>
                </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
            />
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    field : {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 23
    },
    icon : {
        padding: 8,
        borderRadius: 50,
        opacity: 0.9
    }
})