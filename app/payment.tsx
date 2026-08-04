import Button from "@/components/Button";
import { ThemedText } from "@/components/themed-text";
import { TopBar } from '@/components/topBar';
import { useTheme } from "@/hooks/useTheme";
import { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PaymentScreen () {
const { colors } =  useTheme()
const [ SelectPayment, setSelectedPayment] = useState<string | null>(null);
    return (
        <SafeAreaView
        style={{backgroundColor: colors.background, flex: 1}}>
          <ScrollView
          contentContainerStyle={{flexGrow: 2}}
          keyboardShouldPersistTaps="handled">
              <TopBar title="Payment Method" />
              <View style={styles.shipping}>
                  <ThemedText type="defaultBold">Delivery Address</ThemedText>
                  <View style={styles.location_container}>
                    <Image source={require("../assets/images/Location2.jpg")} style={[styles.image, styles.card]}/>
                    <View style={{flex: 1, paddingHorizontal: 10, flexDirection: "column", marginRight: 50}}>
                      <ThemedText type="defaultBold" style={{paddingLeft: 15, paddingTop: 10}}>John Malaiti</ThemedText>
                      <ThemedText type="defaultBold" style={{paddingLeft: 15, paddingTop: 10, fontSize: 14, color: "gray"}}>Dedan Kimithi RD, ZCAS University</ThemedText>
                    </View>
                  </View>
                  <View style={{paddingTop: 40}}>
                    <ThemedText type="defaultBold">Select Payment Method</ThemedText>
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
              { SelectPayment === 'airtel' || SelectPayment === 'mtn' || SelectPayment === 'zamtel' ? (
                <View style={[styles.phoneField, {backgroundColor: colors.surface}]}>
                  <TextInput placeholder="Enter phone number" keyboardType="phone-pad" maxLength={10} placeholderTextColor={colors.placeholder} style={{textAlign: "center"}}/>
                </View>
              ): null
              }
              <View style={{ flexDirection: "row", justifyContent: "space-between", paddingBottom: 25, paddingHorizontal: 125, paddingVertical: 25, borderBottomWidth: 1, borderTopWidth: 1, borderTopColor: colors.surface, borderBottomColor: colors.surface }}>
                <ThemedText type="subtitle">Total:</ThemedText>
                <ThemedText type="subtitle">K569.87</ThemedText>
              </View>
              <Button title="Pay Now" onPress={() => alert("Processing payment...")} />
          </ScrollView>
        </SafeAreaView>
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
    flex: 1,
    flexDirection: "row",
    gap: 50,
    paddingTop: 20,
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
  marginBottom: 145,
  paddingHorizontal: 10,
  paddingVertical: 15,
  width: '65%',   
  alignSelf: 'center',
  borderRadius: 20,
  }

});
