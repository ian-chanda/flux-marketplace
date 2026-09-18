import Button from "@/components/Button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { TopBar } from '@/components/topBar';
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/auth-context";
import { clearCart, getCartItems } from "@/services/cart";
import { getListing } from "@/services/listings";
import { createOrder, OrderItemInput } from "@/services/orders";
import { Listing } from "@/types/listing";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

const formatK = (n: number) => `K${n.toLocaleString("en-ZM")}`;

export default function PaymentScreen () {
const { colors } =  useTheme()
const { listingId } = useLocalSearchParams<{ listingId?: string }>();
const [ SelectPayment, setSelectedPayment] = useState<string | null>(null);
const [phone, setPhone] = useState("");
const [total, setTotal] = useState(0);
const [loading, setLoading] = useState(true);
const [paying, setPaying] = useState(false);
const { user } = useAuth();

useEffect(() => {
    let cancelled = false;
    async function loadTotal() {
        try {
            if (listingId) {
                const listing = await getListing(listingId);
                if (!cancelled) setTotal(Number(listing.price));
            } else {
                if (!user) return;
                const rows = await getCartItems(user.id);
                if (!cancelled) setTotal(rows.reduce((sum, r) => sum + Number(r.listings.price), 0));
            }
        } catch {
            if (!cancelled) setTotal(0);
        } finally {
            if (!cancelled) setLoading(false);
        }
    }
    loadTotal();
    return () => { cancelled = true; };
}, [listingId, user]);

const handlePay = async () => {
    if (!SelectPayment) return alert("Select a payment method");
    if (phone.trim().length === 0) return alert("Enter your mobile money number");
    if (!user) return;
    setPaying(true);
    try {
        const items: OrderItemInput[] = [];
        if (listingId) {
            const listing: Listing = await getListing(listingId);
            items.push({ listing_id: listing.id, price: Number(listing.price), title: listing.title, image_url: listing.images?.[0] ?? null });
        } else {
            const rows = await getCartItems(user.id);
            rows.forEach(r => items.push({ listing_id: r.listing_id, price: Number(r.listings.price), title: r.listings.title, image_url: r.listings.images?.[0] ?? null }));
        }
        await createOrder({ userId: user.id, items, total, paymentMethod: SelectPayment, phoneNumber: phone.trim() });
        if (!listingId) {
            await clearCart(user.id);
        }
        alert(`Order placed! Total ${formatK(total)}`);
        router.replace("/");
    } catch (err) {
        alert("Payment failed: " + (err as Error).message);
        setPaying(false);
    }
};

    return (
        <ThemedView
        isTabVisible={false}
        style={{
      paddingBottom: 40
    }}>
          <ScrollView
          contentContainerStyle={{flexGrow: 2}}
          keyboardShouldPersistTaps="handled"
          style={{
            paddingBottom: 0
          }}>
              <TopBar title="Payment Method" />
              {loading ? (
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 60 }}>
                    <ActivityIndicator size="large" color={colors.accent} />
                </View>
              ) : (
                <>
                <View style={styles.shipping}>
                    <ThemedText type="defaultBold">Delivery Address</ThemedText>
                    <TouchableOpacity
                    onPress={()=> router.push("/modals/location")}>
                      <View style={styles.location_container}>
                        <Image source={require("../assets/images/Location2.jpg")} style={[styles.image, styles.card]}/>
                        <View style={{flex: 1, paddingHorizontal: 10, flexDirection: "column", marginRight: 50}}>
                          <ThemedText type="defaultBold" style={{paddingLeft: 15, paddingTop: 10}}>John Malaiti</ThemedText>
                          <ThemedText type="defaultBold" style={{paddingLeft: 15, paddingTop: 10, fontSize: 14, color: "gray"}}>Dedan Kimithi RD, ZCAS University</ThemedText>
                        </View>
                    </View>
                  </TouchableOpacity>
                    <View style={{paddingTop: 20}}>
                      <ThemedText type="defaultBold" >Select Payment Method</ThemedText>
                      <View style={styles.paymentBound}>
                        <Pressable onPress={() => setSelectedPayment('airtel')}>
                        <Image source={require("../assets/images/airtel.jpg")} style={[styles.paymentImages, styles.card]}/>
                        </Pressable>
                        <Pressable onPress={() => setSelectedPayment('mtn')}>
                          <Image source={require("../assets/images/mtn.jpg")} style={[styles.paymentImages, styles.card]}/>
                        </Pressable>
                        <Pressable onPress={() => setSelectedPayment('zamtel')}>
                          <Image source={require("../assets/images/zamtel.jpg")} style={[styles.paymentImages, styles.card]}/>
                        </Pressable>
                      </View>
                    </View>
                </View>
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={0}
                style={{ paddingTop: 20}}
              >
                { SelectPayment === 'airtel' || SelectPayment === 'mtn' || SelectPayment === 'zamtel' ? (
                  <View style={[styles.phoneField, {backgroundColor: colors.surface}]}>
                    <TextInput placeholder="Enter phone number"
                    keyboardType="phone-pad" 
                    maxLength={10} 
                    value={phone}
                    onChangeText={setPhone}
                    placeholderTextColor={colors.placeholder} 
                    style={{textAlign: "center"}}/>
                  </View>
                ): null
                }
              </KeyboardAvoidingView>
              <View style={{ flexDirection: "row", justifyContent: "space-between", paddingBottom: 25, paddingHorizontal: 125, paddingVertical: 25, borderBottomWidth: 1, borderTopWidth: 1, borderTopColor: colors.surface, borderBottomColor: colors.surface }}>
                <ThemedText type="subtitle">Total:</ThemedText>
                <ThemedText type="subtitle">{formatK(total)}</ThemedText>
              </View>
              <Button title={paying ? "Processing..." : "Pay Now"} onPress={handlePay} disabled={paying}/>
                </>
              )}
          </ScrollView>
        </ThemedView>
    )
};

const styles = StyleSheet.create({
  topBar: {
    //flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  backButton: {
    flex: 1,
    position: "absolute",
    left: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 15
  },

  location_container: {
    flexDirection: "row",
    paddingTop: 20,
    
  },

  shipping: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingTop: 50,
    paddingLeft: 30
  },
  paymentBound: {
    flexDirection: "row",
    justifyContent: "center",
    maxWidth: "90%",
    gap: 50,
    paddingTop: 10
  },
  paymentImages: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  card: {
    borderRadius: 10,
    padding: 2,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3
  },
  button: {
    paddingVertical: 20,
    paddingHorizontal: 100,
    borderRadius: 60,
    alignItems: "center",
    marginTop: 10,
    alignSelf: "center",
    },
    input: {
      paddingHorizontal: 15,
      alignItems: 'center',
      width: "85%",
      borderRadius: 20,
    },

    paymentContainer: {

    },

  phoneField: {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 120,
  paddingHorizontal: 10,
  paddingVertical: 15,
  width: '65%',   
  alignSelf: 'center',
  borderRadius: 20,
  
  }

});