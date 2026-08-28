import { CustomHeader } from "@/components/customHeader"
import { ProductCardV } from "@/components/productCardV"
import { ThemedText } from "@/components/themed-text"
import { ThemedView } from "@/components/themed-view"
import { useTheme } from "@/hooks/useTheme"
import { MaterialIcons } from "@expo/vector-icons"
import { FlatList, Image, ScrollView, StyleSheet, View, useWindowDimensions } from "react-native"

const sellerProducts = [
    { id: 1, name: "Wireless Earbuds Pro", Desc: 'new', price: "K450" },
    { id: 2, name: "Smart Watch Series 5", Desc: 'used-like new', price: "K1,200" },
    { id: 3, name: "Mechanical Keyboard", Desc: 'pre-owned', price: "K680" },
    { id: 4, name: "Gaming Mouse RGB", Desc: 'new', price: "K350" },
    { id: 5, name: "Laptop Stand Aluminum", Desc: 'used-like new', price: "K290" },
    { id: 6, name: "USB-C Hub 7-in-1", Desc: 'new', price: "K520" },
]

const reviews = [
{id: 1, image: require("../../assets/images/dino.jpg"), name: "DealsHunter", messg: "I really hate this product omg, it broke after just one week of use. The quality is terrible and I feel like I wasted my money. Definitely not worth the price they're asking for it.", feedbacktype: "sale"},
{id: 2, image: require("../../assets/images/dino.jpg"), name: "TechLover99", messg: "Great quality and fast delivery! The product arrived in perfect condition and works exactly as described. The seller was very responsive and helpful throughout the entire process. Would definitely purchase from them again!", feedbacktype: "purchase"},
{id: 3, image: require("../../assets/images/dino.jpg"), name: "ShopperQueen", messg: "Not as described, very disappointed with my purchase. The color is different from the pictures and the material feels cheap. I was expecting better quality for this price range. Considering returning it.", feedbacktype: "sale"},
{id: 4, image: require("../../assets/images/dino.jpg"), name: "SmartBuyer", messg: "Excellent seller, highly recommended for anyone looking for quality products. The item was packaged carefully and arrived on time. Customer service is top-notch and they responded to all my questions quickly.", feedbacktype: "sale"},
{id: 5, image: require("../../assets/images/dino.jpg"), name: "LocalBuyer", messg: "Item arrived damaged, requesting refund immediately. The packaging was poor and the product got damaged during shipping. The seller needs to improve their packaging methods to protect items better.", feedbacktype: "purchase"},
{id: 6, image: require("../../assets/images/dino.jpg"), name: "FastShopper", messg: "Perfect! Exactly what I needed and it works amazingly. The quality is outstanding and the price is very competitive. I've already recommended this to all my friends and family. Best purchase I've made!", feedbacktype: "sale"},
{id: 7, image: require("../../assets/images/dino.jpg"), name: "OnlinePro", messg: "Took too long to ship, I ordered this item expecting it within the promised timeframe but it took almost 3 weeks to arrive. This really inconvenienced me and I'm not happy with the shipping time.", feedbacktype: "negative"},
{id: 8, image: require("../../assets/images/dino.jpg"), name: "PriceChecker", messg: "Good value for money, will buy again without hesitation. The product exceeded my expectations in terms of quality and functionality. It's exactly what I was looking for and the price is very reasonable.", feedbacktype: "purchase"},
{id: 9, image: require("../../assets/images/dino.jpg"), name: "CasualShopper", messg: "Average product, nothing special about it really. It works fine but there are better options available on the market. It's decent for the price but I wouldn't go out of my way to recommend it to others.", feedbacktype: "sale"}
]

export default function Profile() {
    const { colors } = useTheme();
    const { width } = useWindowDimensions();
    const cardWidth = width - 20 - 30;
    const itemWidth = cardWidth + 10;

    return (
        <ThemedView
        style={{
            paddingHorizontal: 10
        }}>
            <CustomHeader 
            title="Seller profile"
            showBack/>
            <ScrollView
            showsVerticalScrollIndicator={false}>
            <View>
                    <View style={[styles.container, styles.shadow, {backgroundColor: colors.background}]}>
                        <Image source={require("../../assets/images/dino.jpg")} style={styles.profileImage} />
                        <View style={styles.profileInfo}>
                        <ThemedText type="defaultBold">John Doe</ThemedText>
                        <ThemedText type="defaultSmall">@johndoe12</ThemedText>
                        <View style={[styles.VerifyContainer, {backgroundColor: colors.shadowColor}]}>
                            <MaterialIcons name="verified" size={15} color={colors.accent} style={styles.verifyImage} />
                            <ThemedText type='small_price_font'>verified seller</ThemedText>
                        </View>

                            <View
                            style={[styles.VerifyContainer]}
                            >
                            <MaterialIcons name="star-outline" size={15} color={"gold"} style={styles.verifyImage} />
                            <ThemedText type="defaultSmall" >130</ThemedText>
                            <ThemedText type="defaultSmall" > Successful Sales</ThemedText>
                            </View>
                            <View style={[styles.VerifyContainer, {marginTop: 1, maxWidth: "70%"}]}>
                            <MaterialIcons name="circle" size={15} color={"black"} style={styles.verifyImage} />
                            <ThemedText type="defaultSmall" >Joined 22 jan 2026</ThemedText>
                            </View>
                        </View>
                    </View>

                    <ThemedText type="subtitle" style={{ paddingHorizontal: 15, paddingVertical: 15}}>Reviews</ThemedText>
                    <View
                    style={{
                      paddingHorizontal: 15
                    }}>
                        <FlatList 
                        data={reviews}
                        horizontal={true}
                        snapToInterval={itemWidth}
                        decelerationRate="fast"
                        pagingEnabled={false}
                        showsHorizontalScrollIndicator={false}
                        ItemSeparatorComponent={() => <View style = {{width: 10}}></View>}
                        renderItem={({item}) => (
                          <View
                          style={{
                            borderWidth: 1,
                            borderColor: colors.surface,
                            borderRadius: 20,
                            padding: 10,
                            width: cardWidth,

                          }}>
                            <View
                            style={{
                              flexDirection: "row",
                              padding: 5,
                            }}>
                              <Image source={require("../../assets/images/dino.jpg")} style={{ width: 20, height: 20, borderRadius: 50, marginRight: 10}}/>
                            <View
                            style={{
                              flex: 1,
                              flexDirection: "row",
                              alignItems: "center",
                            }}>
                            <ThemedText type="smallFaded">{item.name} ~ 3y</ThemedText>
                            <ThemedText type="small" style={{ marginLeft: "auto" }}>{item.feedbacktype}</ThemedText>
                            </View>
                            </View>
                            <View
                            style={{
                              width: cardWidth,
                              maxWidth: "100%"
                            }}>
                              <ThemedText>{item.messg}</ThemedText>
                            </View>
                          </View>
                        )}/>
                    </View>
                    <View>
                      <ThemedText type="subtitle" style={{ paddingHorizontal: 15, paddingVertical: 15}}>Other Products by seller</ThemedText>
                    </View>
                    <View style={{ paddingHorizontal: 10, flexGrow: 0 }}>
                        <View style={{ gap: 16, flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
                            {sellerProducts.map((item) => (
                                <ProductCardV
                                    key={item.id}
                                    id={item.id}
                                    bookmarked={false}
                                    desc={item.Desc}
                                    name={item.name}
                                    price={item.price}
                                />
                            ))}
                        </View>
                    </View>
            </View>
            </ScrollView>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
      VerifyContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    maxWidth: "55%",
    borderRadius: 4,
    padding: 2
  },
  shadow: {

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3
  },
    verifyImage: {
    width: 15,
    height: 15,
    marginRight: 5,
  },
  profileInfo: {
    flex: 1,
    justifyContent: "center",
  },
    container: {
    padding: 16,
    borderRadius: 8,
    margin: 15,
    flexDirection: "row",
  },
    profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
  },
})