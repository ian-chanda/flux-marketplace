import { CustomSearchBar } from "@/components/customSearchBar";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/hooks/useTheme";
import { categories } from "@/lib/categories";
import { getCategory, setCategory } from "@/lib/listingDraft";
import { Ionicons } from "@expo/vector-icons";
import { router } from 'expo-router';
import { useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

export default function Category() {
    const [searchValue, setSearchValue] = useState("");
    const { colors } = useTheme();

    const [selectedName, setSelectedName] = useState<string | null>(getCategory() ?? null);

    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    const handleSelectCategory = (categoryName: string) => {
        setSelectedName(categoryName);
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
                onPress={() => handleSelectCategory(item.name)}
                style={[
                    styles.field,
                    selectedName === item.name && { 
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
            keyExtractor={(item) => item.name}
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