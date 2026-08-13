import { CustomHeader } from "@/components/customHeader";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/hooks/useTheme";
import { FlatList, Image, StyleSheet, TouchableOpacity, View } from "react-native";

const listings = [
    {id: 1, icon: require("../assets/images/ph.jpg"), name: "JBL Flip 6", status: "Sold", Price: "K2,000"},
    {id: 2, icon: require("../assets/images/ph.jpg"), name: "Samsung Galaxy S24", status: "Active", Price: "K8,500"},
    {id: 3, icon: require("../assets/images/ph.jpg"), name: "MacBook Pro 14", status: "Sold", Price: "K12,000"},
    {id: 4, icon: require("../assets/images/ph.jpg"), name: "Sony WH-1000XM5", status: "Active", Price: "K3,200"},
    {id: 5, icon: require("../assets/images/ph.jpg"), name: "iPad Air 6", status: "Pending", Price: "K5,500"},
    {id: 6, icon: require("../assets/images/ph.jpg"), name: "AirPods Pro Max", status: "Active", Price: "K6,800"},
    {id: 7, icon: require("../assets/images/ph.jpg"), name: "Dell XPS 15", status: "Sold", Price: "K4,800"},
    {id: 8, icon: require("../assets/images/ph.jpg"), name: "Nintendo Switch", status: "Active", Price: "K2,500"},
    {id: 9, icon: require("../assets/images/ph.jpg"), name: "Canon EOS R6", status: "Active", Price: "K7,200"},
    {id: 10, icon: require("../assets/images/ph.jpg"), name: "Dyson V15", status: "Sold", Price: "K3,800"},
]

export default function ViewListings () {
    const { colors } = useTheme();
    return (
        <ThemedView
        isTabVisible={false}
        style={{paddingBottom: 10}}>
            <CustomHeader
            title="Your listings"
            showBack={true}/>
            <FlatList
            data={listings}
            renderItem={({ item }) => (
                <TouchableOpacity
                activeOpacity={0.9}
                onPress={()=> alert("product")}>
                        <View
                        style={{flexDirection: "column"}}>
                            <View
                            style={[styles.itemContainer, {borderBottomColor: colors.surface}]}>
                                <View>
                                    <Image source={item.icon} style={styles.image}/>
                                </View>
                                <View
                                style={{flexDirection: "column"}}>
                                    <View
                                    style = {{flexDirection: "row"
                                    }}>
                                        <View 
                                        style={{flexDirection:"row"}}>
                                            <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
                                        </View>
                                    </View>
                                    <View style={{flexDirection: "row", width: "100%"}}>
                                        <ThemedText type="mediumFaded">{item.Price} | {item.status}</ThemedText>
                                    </View>
                                    <View
                                    style={{justifyContent: "center", margin: 10}}>
                                        <View
                                        style={{backgroundColor: colors.accent, justifyContent: "center", borderRadius: 8, padding: 9, margin: 10, marginBottom: -5}}>
                                            <TouchableOpacity
                                            activeOpacity={0.15}
                                            onPress={()=> alert("Marked as unavailable")}>
                                                <ThemedText type="mediumBold">Mark as available</ThemedText>
                                            </TouchableOpacity>
                                        </View>
                                        <View
                                        style={{backgroundColor: colors.accent, justifyContent: "center", borderRadius: 8, padding: 9, margin: 10, paddingLeft: 20}}>
                                            <TouchableOpacity
                                            activeOpacity={0.15}
                                            onPress={()=> alert("Deleting listing")}>
                                                <ThemedText type="mediumBold">Delete listing</ThemedText>
                                            </TouchableOpacity>
                                            
                                        </View>
                                    </View>
                                </View> 
                            </View>
                    </View>
                
                </TouchableOpacity>
            )}/>
        </ThemedView>
        
    )
}

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: 25,
    marginRight: 20
  },

  fabContainer: {
  position: 'absolute',
  bottom: 30,
  right: 30,
  marginBottom: 40,
  marginTop: 10,
  borderRadius: 30,
},
fab: {
  width: 60,
  height: 60,
  borderRadius: 30,
  justifyContent: 'center',
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
}
})
