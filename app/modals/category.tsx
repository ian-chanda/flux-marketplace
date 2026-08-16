import { CustomSearchBar } from "@/components/customSearchBar";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/hooks/useTheme";
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
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const { colors } = useTheme();

    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    const handleSelectCategory = (categoryId: number) => {
        setSelectedCategory(categoryId); 
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
            data={filteredCategories}  // ← Use filtered data
            renderItem={({ item }) => (
                <TouchableOpacity
                onPress={() => handleSelectCategory(item.id)}
                style={[
                    styles.field,
                    selectedCategory === item.id && { 
                        backgroundColor: colors.surface,
                        borderWidth: 1,
                        borderColor: colors.accent,
                        borderRadius: 0
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
                <ThemedText>{item.name}</ThemedText>
	            </View>
                <View>
                    {selectedCategory === item.id && (
                        <Ionicons name="checkmark" size={20} color={colors.accent} />
                    )}
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
        borderRadius: 8
    },
    icon : {
        padding: 8,
        borderRadius: 50,
        opacity: 0.9
    }
})