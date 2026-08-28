import Button from "@/components/Button";
import { CustomHeader } from "@/components/customHeader";
import { IconButton } from "@/components/iconButton";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { FlatList, Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

const images = [
    {id: 1, image: require("@/assets/images/ph.jpg")},
    {id: 2, image: require("@/assets/images/ph.jpg")},
    {id: 3, image: require("@/assets/images/ph.jpg")},
    {id: 4, image: require("@/assets/images/ph.jpg")},
    {id: 5, image: require("@/assets/images/ph.jpg")},
    {id: 6, image: require("@/assets/images/ph.jpg")}
]

export default function Product() {
    const { colors } = useTheme()
    return (
        <ThemedView
        style={{
            paddingHorizontal: 10,
            paddingBottom: 60
        }}>
            <CustomHeader
                showBack
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                    <IconButton icon={"share"} onPress={() => router.push('/notifications')} badgeValue=""/>
                    <IconButton icon={"shopping-cart"} onPress={() => router.push('/cart')} badgeValue='2' />
                </View>
            </CustomHeader>
            <View
            style={
                styles.all_images
            }>
                <ScrollView
                showsHorizontalScrollIndicator={false}>
                    <FlatList 
                    horizontal
                    data={images}
                    pagingEnabled
                    showsHorizontalScrollIndicator={true}
                    renderItem={({item}) => (
                        <View
                            style={styles.image_container}>
                            <Image style = {styles.mainImage} source={require("@/assets/images/ph.jpg")} />
                        </View>
                    )}/>
                
                <FlatList
                horizontal
                data={images}
                showsHorizontalScrollIndicator={true}
                renderItem={({item}) => (
                    <View
                    style={styles.image_container}>
                    <Image style = {styles.secondaryImages} source={require("@/assets/images/ph.jpg")} />
                    </View>
                )}>
                </FlatList>
                <View>
                <ThemedText type="subtitle">Apple Iphone SE 2022 3rd Gen</ThemedText>
                <ThemedText type="subtitle">RAM 16GB</ThemedText>
                <ThemedText>Condition: New</ThemedText>
                <ThemedText style ={{paddingVertical: 10}} type="title">ZMW 500</ThemedText>
                <ThemedText style ={{paddingVertical: 10}} type="default">Approx ZMW 520</ThemedText>
                </View>

                <TouchableOpacity
                onPress={() => router.push("/modals/profile")}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 10,
                paddingVertical: -15, 
                borderRadius: 15,
                backgroundColor: colors.surface,
                justifyContent: 'space-between',
                marginBottom: 15
            }}
                >
                <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center', paddingVertical: 20 }}>
                <Image source={require('@/assets/images/dino.jpg')} style={{
                width: 50,
                height: 50,
                borderRadius: 100
                }} />
                <View style={{

                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <ThemedText type='largeBold'>@onezambiaman</ThemedText>
                    <MaterialIcons name='verified' color={colors.text} size={15} />
                </View>
                <ThemedText type='small'>91 successful sales</ThemedText>
                </View>
                <View
                style={{
                    backgroundColor: colors.surface,
                    borderRadius: 50
                }}>
                    <TouchableOpacity
                    onPress={()=> router.push("/messages/${item.id}")}>
                        <Ionicons style= {{paddingHorizontal: 30}} color={colors.accent} name="mail-outline" size={35}/>
                    </TouchableOpacity>
                </View>
                </View>
            </TouchableOpacity>
            <Button 
            title="Buy Now"
            onPress={() => router.push("/payment")}/>

            <Button 
            title="Add to Cart"
            onPress={() => router.push("/payment")}/>
            <TouchableOpacity
            onPress={()=> router.push("/modals/itemInformation")}>
                <View
                style={{
                    paddingTop: 30,
                    justifyContent: "center",
                    flexDirection: "column"
                }}>
                    <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        gap: 40,
                        paddingHorizontal: 20
                        
                    }}>
                        <ThemedText type="subtitle">Item Information</ThemedText>
                        <Ionicons name="chevron-forward" size={24}/>
                    </View>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
            onPress={()=> router.push("/modals/userDescription")}>
                <View
                style={{
                    paddingTop: 30,
                    justifyContent: "center",
                    flexDirection: "column"
                }}>
                    <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        gap: 40,
                        paddingHorizontal: 20
                        
                    }}>
                        <ThemedText type="subtitle">User Description</ThemedText>
                        <Ionicons name="chevron-forward" size={24}/>
                    </View>
                </View>
            </TouchableOpacity>
            <View
            style={{
                paddingBottom: 30
            }}>
                
            </View>
            
            </ScrollView>
            </View>
        
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    all_images: {
        flexDirection: "column"
    },
    image_container: {
        flexDirection: "row",
        justifyContent: "center",
        borderColor: "black",
        padding: 5,
    },
    mainImage: {
        width: 360,
        height: 350,
        borderRadius: 20
    },
    secondaryImages: {
        width: 70,
        height: 70,
        borderRadius: 20
    }
})