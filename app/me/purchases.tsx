import { CustomHeader } from "@/components/customHeader";
import { CustomSearchBar } from "@/components/customSearchBar";
import { SmallIconButton } from "@/components/small-iconButton";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useState } from "react";
import { FlatList, Image, ScrollView, StyleSheet, View } from "react-native";

const items = [
  {id: 1, name: "Iphone 23 pro max", Desc: "new", price: "K34000"},
  {id: 2, name: "Samsung Galaxy S24", Desc: "like new", price: "K28500"},
  {id: 3, name: "MacBook Pro 14", Desc: "used", price: "K45000"},
  {id: 4, name: "Sony WH-1000XM5", Desc: "new", price: "K8200"},
  {id: 5, name: "iPad Air 6", Desc: "fair condition", price: "K18000"},
  {id: 6, name: "AirPods Pro Max", Desc: "new", price: "K24500"},
  {id: 7, name: "Dell XPS 15", Desc: "used", price: "K22000"},
  {id: 8, name: "Nintendo Switch", Desc: "like new", price: "K7500"},
  {id: 9, name: "Canon EOS R6", Desc: "used", price: "K32000"}
]

export default function Purchases() {
  const [searchValue, setSearchValue] = useState("");

  const filterSearchItem = items.filter((items) => 
    items.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
  <ThemedView
    isTabVisible={false}
    style={{
      paddingHorizontal: 10,
      paddingBottom: 0
    }}>
      <CustomHeader 
      title="Purchases"
      showBack={true}/>
      <CustomSearchBar 
        width={"100%"}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        onSearch={()=>alert("no")}
        />
       <View
       style={{
         paddingVertical: 1
       }}>
             <ScrollView
                 showsHorizontalScrollIndicator={false}
                 horizontal
                 style={{
                     flexGrow: 0,
                     paddingVertical: 10,
                 }} contentContainerStyle={{
                     paddingHorizontal: 5,
                     gap: 10
                 }}
             >
          <SmallIconButton icon="phone-portrait" title="Phones" />
          <SmallIconButton icon="laptop" title="Laptops" />
          <SmallIconButton icon="game-controller" title="Gaming" />
          <SmallIconButton icon="headset" title="Audio" />
          <SmallIconButton icon="watch" title="Wearables" />
             </ScrollView>
       </View>
      <FlatList 
      data={filterSearchItem}
      numColumns={2}
      columnWrapperStyle ={{justifyContent: "space-between"}}
      contentContainerStyle = {{gap: 20 }}
      renderItem={({ item }) => (
        <View style={styles.product_card}>
          <View>
              <Image
                source={require('../../assets/images/dino.jpg')}
                style={styles.image}
                resizeMode="cover"
                />
          </View>
    
            <ThemedText type="smallFaded">{item.Desc}</ThemedText>
            <ThemedText type="defaultBold" numberOfLines={1}>{item.name}</ThemedText>
            <ThemedText type="mediumBold" >{item.price}</ThemedText>
        </View>
      )}
      keyExtractor={(item) => item.id.toString()}
      />

    </ThemedView>
  )
}

const styles = StyleSheet.create({
  product_card: {
    width: '45%',
    borderRadius: 8,

  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    },

})