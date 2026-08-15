import Button from "@/components/Button";
import { CustomHeader } from "@/components/customHeader";
import { FormField } from "@/components/formFiled";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { SectionHeader } from "@/components/titleBar";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

export default function AddListings() {
  const { colors } = useTheme();
  const [itemDetails, setItemDetails] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const conditions = ['New', 'Like New', 'Used', 'Fair'];
  const [selectedOption, setSelectedOption] = useState('delivery');

  const options = [
    { id: 'delivery', title: 'Delivery Available', description: "You'll deliver the item to the buyer", icon: 'checkmark-circle' },
    { id: 'pickup', title: 'Buyer Pickup', description: 'Buyer will pick up the item', icon: 'ellipse-outline' }
  ];

  function onChangeNumber(text: string): void {
    setItemDetails(text)
  }

  return (
    <ThemedView
    isTabVisible={false}
    style={{
      paddingBottom: 4
    }}>
      <CustomHeader
      title="Add listing"
      showBack={true}/>
      <ScrollView>
        <View style={[styles.container]}>
          <SectionHeader
            icon="image"
            title="Details"
            iconColor={colors.accent}/>
          <View style={{ marginLeft: 10 }}>
            <ThemedText type="smallFaded">
              Add up to 6 photos. The first will be your cover image.
            </ThemedText>
          </View>
          <View style={styles.imageHoler}>
            <Pressable onPress={() => alert("select photos")}> 
              <View style={styles.photoButton}>
                <View
                  style={{
                    justifyContent: "flex-start",
                    padding: 10,
                  }}>
                  <MaterialIcon name="add" color={colors.accent} size={75} />
                  <View style={{ paddingRight: 10 }}>
                    <ThemedText type="defaultFaded">Add photos</ThemedText>
                  </View>
                </View>
              </View>
            </Pressable>
            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                gap: 20,
                padding: 10,
              }}>
              <View style={styles.ImagePl}>
                <MaterialIcon name="add" color={"gray"} style={{ padding: 10 }} />
              </View>
              <View style={styles.ImagePl}>
                <MaterialIcon name="add" color={"gray"} style={{ padding: 10 }} />
              </View>
            </View>
          </View>
        </View>
        {/*item details*/}
        <KeyboardAvoidingView
            behavior={"padding"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 50}>
          <View style={styles.container}>
            <View style={[styles.header, {flexDirection:"column"}]}>
          <SectionHeader
            icon="information-circle"
            title="Details"
            iconColor={colors.accent}/>
              <ThemedText type="defaultBold">
                Title
                <ThemedText type="defaultBold" style={{color: colors.accent}}> *</ThemedText>
                </ThemedText>
              <View
              style={{
                padding: 5,
                borderWidth: 1,
                borderColor: "#D3D3D3",
                borderRadius: 8
              }}>
                <TextInput
                  style={[{ padding: 10, opacity: 0.5}]}
                  onChangeText={setItemName}
                  value={itemName}
                  placeholderTextColor={colors.placeholder}
                  keyboardType="default"
                  placeholder="e.g Iphone 13 Pro Max 256GB"
                />
              </View>
              <ThemedText type="defaultBold">
                Description
                <ThemedText type="defaultBold" style={{color: colors.accent}}> *</ThemedText>
                </ThemedText>
              <View
              style={styles.textField}>
                <TextInput
                  style={[{ padding: 10, opacity: 0.5}]}
                  multiline={true}
                  onChangeText={setItemDetails}
                  value={itemDetails}
                  placeholderTextColor={colors.placeholder}
                  keyboardType="default"
                  placeholder="Describe your item. its condition, features and anything important"
                />
              </View>
              <TouchableOpacity
              onPress={()=> router.push("/modals/category")}>
                  <View style={[styles.header, {paddingTop: 20, borderTopWidth: 0.5, borderTopColor: "#D3D3D3"}]}>
                  <MaterialIcon name="label" size={24} color={colors.accent} />
                  <ThemedText type="defaultBold">
                    Category
                    <ThemedText type="defaultBold" style={{color: colors.accent}}> *</ThemedText>
                    </ThemedText>
                  <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "flex-end"
                  }}>
                  <Ionicons name="chevron-forward" size={24} color={"#D4D4D4"}/>
                  </View>
                  
                </View>
              </TouchableOpacity>
            </View>
          </View>
          {/*pricing*/}
          <View style={styles.container}>
            <SectionHeader
            icon="wallet-outline"
            title="Price"
            description=""
            iconColor={colors.accent}/>
            <View>
            <View
            style={{flexDirection: "column", padding: 10}}>
              <View
              style ={{flexDirection: "column"}}>
                <ThemedText type="defaultBold">
                  Price
                  <ThemedText type="defaultBold" style={{color: colors.accent}}> *</ThemedText>
                  </ThemedText>
              </View>
                  <View
                  style={[styles.textField1]}>
                    <TextInput 
                    style={{padding: 10, opacity: 0.5}}
                    onChangeText={setItemPrice}
                    value={itemPrice}
                    placeholderTextColor={colors.placeholder}
                    placeholder="K0.0"/>
                  </View>
                  <ThemedText type="smallFaded">Be realistic with your price to sell faster</ThemedText>
            </View>
            </View>
          </View>
          {/*item condition*/}
            <View
            style={styles.container}>    
            <View
            style={styles.header}>
              <SectionHeader 
              icon="shield-outline"
              title="Item condition"
              iconColor={colors.accent}/>
              </View>
              <View
              style={{
                flex: 1,
                justifyContent: "center",
                gap: 10,
                flexDirection: "row",
                flexWrap: 'wrap',
                padding: 10,
                paddingBottom: 30
              }}>
              {conditions.map((condition) => (
                <TouchableOpacity
                  key={condition}
                  onPress={() => setSelectedCondition(condition)}
                  style={{
                    borderWidth: 1,
                    borderColor: selectedCondition === condition ? colors.accent : "#D4D4D4",
                    padding: 12,
                    paddingHorizontal: 15,
                    borderRadius: 8,
                    backgroundColor: selectedCondition === condition ? colors.accent : 'transparent'
                  }}>
                  <ThemedText
                  type="smallBold"
                    style={{
                      color: selectedCondition === condition ? colors.background : colors.text
                    }}>
                    {condition}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {/*location*/}
          <View
          style={styles.container}>
            <SectionHeader
            icon="location-outline"
            title="Location"
            iconColor={colors.accent}
            />
            <View
            style={{
              flex: 1,
              flexDirection: "row",
              paddingBottom: 20

            }}>
            <View
            style={{
              padding: 5,
              paddingLeft: 20
            }}>
            <ThemedText type="smallFaded">Your location</ThemedText>
            <ThemedText type="defaultBold">Kabulonga, Lusaka</ThemedText>
            </View>
            <View
            style={{
            }}>
              <TouchableOpacity
              onPress={()=> router.push("/modals/location")}
              style={{
              paddingTop: 15,
              marginLeft: 80,
              gap: 5,
              flexDirection: "row"
              }}
              >
              <ThemedText type="default" style={{color: colors.accent}}>change</ThemedText>
              <Ionicons name="chevron-forward" size={24} color="#D4D4D4" />
              </TouchableOpacity>
            </View>
            </View>
          </View>
          {/*delivery*/}
          <View
          style={[
            styles.container, {paddingBottom: 30}
          ]}>
            <SectionHeader
            icon="car-outline"
            title="Delivery & Pickup"/>
            <View style={{ borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 12, overflow: 'hidden' }}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={option.id}
            onPress={() => setSelectedOption(option.id)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 15,
              borderBottomWidth: index < options.length - 1 ? 1 : 0,
              borderBottomColor: '#e0e0e0',
              backgroundColor: selectedOption === option.id ? colors.surface : 'transparent'
            }}>
            <Ionicons 
              name={selectedOption === option.id ? "checkmark-circle" : "ellipse-outline"} 
              size={24} 
              color={selectedOption === option.id ? colors.accent : '#999'} 
            />
            <View style={{ marginLeft: 15, flex: 1 }}>
              <ThemedText type="defaultBold">{option.title}</ThemedText>
              <ThemedText type="defaultSmall" style={{ color: '#666', marginTop: 4 }}>
                {option.description}
              </ThemedText>
            </View>
          </TouchableOpacity>
        ))}
      </View>
          </View>
            <View
            style={[
              styles.container,
              {flexDirection: "column", paddingBottom: 12}
            ]}>
              <SectionHeader 
              icon="options"
              title="Additional details (Optional)"/>
            <FormField
            title="Brand"/>
            <FormField
            title="Model"/>
            <FormField 
            title="Color"
            showBorder={false}/>
            </View>
        </KeyboardAvoidingView>
        <Button 
        title="Publish"
        onPress={()=> alert("published")}/>
      </ScrollView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    paddingBottom: -10,
    borderRadius: 8,
    margin: 15,
    flexDirection: "column",
    borderColor: "#D3D3D3",
    borderWidth: 0.5,
  },
  imageHoler: {
    margin: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  photoButton: {
    borderWidth: 1,
    borderColor: "gray",
    borderStyle: "dashed",
    padding: 30,
    paddingRight: 10,
    borderRadius: 15,
  },
  ImagePl: {
    borderWidth: 1,
    borderColor: "gray",
    borderStyle: "dashed",
    borderRadius: 10,
    padding: 20,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    gap: 7,
    margin: 10,
  },
    input: {
      flex: 1,
      paddingHorizontal: 15,
      paddingVertical: 12,
      alignItems: 'center',
      width: "100%",
      borderRadius: 20,
    },
  textField : {
    padding: 5,
    borderWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 8,
  },
    textField1 : {
    padding: 5,
    borderWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 8,
    marginRight: 200,
    marginBottom: 10
  }
})