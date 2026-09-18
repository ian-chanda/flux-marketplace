import { AdditionalDetails, AdditionalDetailsModal } from "@/components/additionalDetailsModal";
import Button from "@/components/Button";
import { CustomHeader } from "@/components/customHeader";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { SectionHeader } from "@/components/titleBar";
import { useAuth } from "@/contexts/auth-context";
import { useTheme } from "@/hooks/useTheme";
import { getCategory } from "@/lib/listingDraft";
import { createListing, uploadListingImages } from "@/services/listings";
import { toJpegMany } from "@/utils/image";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

export default function AddListings() {
  const { colors } = useTheme();
  const { user } = useAuth();

  const [itemDetails, setItemDetails] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [category, setCategory] = useState<string>(getCategory() ?? "");
  const [additional, setAdditional] = useState<AdditionalDetails>({});
  const [showAdditional, setShowAdditional] = useState(false);
  const [selectedOption, setSelectedOption] = useState('delivery');
  const [submitting, setSubmitting] = useState(false);

  const conditions = ['New', 'Like New', 'Used', 'Fair'];

  const options = [
    { id: 'delivery', title: 'Delivery Available', description: "You'll deliver the item to the buyer", icon: 'checkmark-circle' },
    { id: 'pickup', title: 'Buyer Pickup', description: 'Buyer will pick up the item', icon: 'ellipse-outline' }
  ];

  useFocusEffect(
    useCallback(() => {
      setCategory(getCategory() ?? "");
    }, [])
  );

  const pickImages = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Allow photo library access to add photos to your listing.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: 6 - images.length,
      quality: 0.7,
    });

    if (!result.canceled && result.assets) {
      const uris = await toJpegMany(result.assets.map((asset) => asset.uri));
      setImages((prev) => [...prev, ...uris].slice(0, 6));
    }
  };

  const filledAdditionalCount = Object.values(additional).filter((v) => v && v.trim()).length;

  const publish = async () => {
    if (!itemName.trim() || !itemDetails.trim() || !itemPrice.trim()) {
      Alert.alert("Missing details", "Please add a title, description and price.");
      return;
    }

    if (!category) {
      Alert.alert("Missing category", "Pick a category for your item.");
      return;
    }

    const price = parseFloat(itemPrice);
    if (isNaN(price) || price <= 0) {
      Alert.alert("Invalid price", "Enter a price greater than 0.");
      return;
    }

    if (!user) return;

    setSubmitting(true);
    try {
      const imageUrls = images.length ? await uploadListingImages(images, user.id) : [];

      const listing = await createListing({
        userId: user.id,
        title: itemName.trim(),
        description: itemDetails.trim(),
        price,
        category,
        condition: selectedCondition,
        images: imageUrls,
        attributes: additional,
        location: "Kabulonga, Lusaka",
        delivery: selectedOption === "delivery",
        pickup: selectedOption === "pickup",
      });

      router.replace(`/product/${listing.id}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong. Try again.";
      Alert.alert("Couldn't publish", message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ThemedView isTabVisible={false} style={{ flex: 1, paddingBottom: 10 }}>
      <CustomHeader title="Add listing" showBack={true} />
      <KeyboardAvoidingView
        style={{ paddingBottom: 50 }}
        behavior={Platform.OS === "ios" ? "padding" : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 0 }}>
          {/*photos*/}
          <View style={[styles.container]}>
            <SectionHeader
              icon="image"
              title="Details"
              iconColor={colors.accent} />
            <View style={{ marginLeft: 10 }}>
              <ThemedText type="smallFaded">
                Add up to 6 photos. The first will be your cover image.
              </ThemedText>
            </View>
            <View style={styles.imageHoler}>
              <Pressable onPress={pickImages}>
                <View style={styles.photoButton}>
                  <View
                    style={{
                      justifyContent: "center",
                      padding: 10,
                    }}>
                      <View
                      style = {{padding: 10, justifyContent: "center", alignItems: "center"}}>
                      <MaterialIcon name="add" color={colors.accent} size={75} />
                      </View>
                    <View style={{ paddingRight: 10 }}>
                      <View
                      style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                          <ThemedText type="defaultFaded">
                        {images.length ? "Add more" : "Add photos"}
                      </ThemedText>
                      </View>
                    </View>
                  </View>
                </View>
              </Pressable>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 10,
                  padding: 10,
                  maxWidth: 170,
                }}>
                {images.map((uri, index) => (
                  <TouchableOpacity
                    key={`${uri}-${index}`}
                    onPress={() => setImages((prev) => prev.filter((_, i) => i !== index))}>
                    <Image source={{ uri }} style={styles.thumb} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
          {/*item details*/}
          <View style={styles.container}>
            <View style={[styles.header, { flexDirection: "column" }]}>
              <SectionHeader
                icon="information-circle"
                title="Details"
                iconColor={colors.accent} />
              <ThemedText type="defaultBold">
                Title
                <ThemedText type="defaultBold" style={{ color: colors.accent }}> *</ThemedText>
              </ThemedText>
              <View
                style={{
                  padding: 5,
                  borderWidth: 1,
                  borderColor: "#D3D3D3",
                  borderRadius: 8
                }}>
                <TextInput
                  style={[{ padding: 10, opacity: 0.5 }]}
                  onChangeText={setItemName}
                  value={itemName}
                  placeholderTextColor={colors.placeholder}
                  keyboardType="default"
                  placeholder="e.g Iphone 13 Pro Max 256GB"
                />
              </View>
              <ThemedText type="defaultBold">
                Description
                <ThemedText type="defaultBold" style={{ color: colors.accent }}> *</ThemedText>
              </ThemedText>
              <View
                style={styles.textField}>
                <TextInput
                  style={[{ padding: 10, opacity: 0.5 }]}
                  multiline={true}
                  onChangeText={setItemDetails}
                  value={itemDetails}
                  placeholderTextColor={colors.placeholder}
                  keyboardType="default"
                  placeholder="Describe your item. its condition, features and anything important"
                />
              </View>
              <TouchableOpacity
                onPress={() => router.push("/modals/category")}>
                <View style={[styles.header, styles.categoryRow, { paddingTop: 20, borderTopWidth: 0.5, borderTopColor: "#D3D3D3" }]}>
                  <View style={{ flexDirection: "row", gap: 7, alignItems: "center" }}>
                    <MaterialIcon name="label" size={24} color={colors.accent} />
                    <ThemedText type="defaultBold">
                      Category
                      <ThemedText type="defaultBold" style={{ color: colors.accent }}> *</ThemedText>
                    </ThemedText>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <View
                    style={{
                      padding: 1,
                      justifyContent: "flex-start",
                      maxWidth: 120,
                    }}>
                      <ThemedText type="default" style={{ color: category ? colors.accent : colors.placeholder }}>
                      {category || "Select"}
                    </ThemedText>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color={"#D4D4D4"} />
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowAdditional(true)}>
                <View style={[styles.header, { paddingTop: 20, borderTopWidth: 0.5, borderTopColor: "#D3D3D3" }]}>
                  <Ionicons name="options" size={24} color={colors.accent} />
                  <ThemedText type="defaultBold">
                    Additional details
                  </ThemedText>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      gap: 6
                    }}>
                    {filledAdditionalCount > 0 && (
                      <ThemedText type="smallFaded">{filledAdditionalCount} filled</ThemedText>
                    )}
                    <Ionicons name="chevron-forward" size={24} color={"#D4D4D4"} />
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
              iconColor={colors.accent} />
            <View>
              <View
                style={{ flexDirection: "column", padding: 10 }}>
                <View
                  style={{ flexDirection: "column" }}>
                  <ThemedText type="defaultBold">
                    Price
                    <ThemedText type="defaultBold" style={{ color: colors.accent }}> *</ThemedText>
                  </ThemedText>
                </View>
                <View
                  style={[styles.textField1]}>
                  <TextInput
                    style={{ padding: 10, opacity: 0.5 }}
                    onChangeText={setItemPrice}
                    value={itemPrice}
                    placeholderTextColor={colors.placeholder}
                    placeholder="K0.0" />
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
                iconColor={colors.accent} />
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
              <View>
                <TouchableOpacity
                  onPress={() => router.push("/modals/location")}
                  style={{
                    paddingTop: 15,
                    marginLeft: 80,
                    flexDirection: "row"
                  }}
                >
                  <ThemedText type="default" style={{ color: colors.accent, justifyContent: "flex-start" }}>change</ThemedText>
                  <Ionicons style={{ marginLeft: 10 }} name="chevron-forward" size={24} color="#D4D4D4" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/*delivery*/}
          <View
            style={[
              styles.container, { paddingBottom: 30 }
            ]}>
            <SectionHeader
              icon="car-outline"
              title="Delivery & Pickup" />
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
          <View style={{ paddingBottom: 70 }}>
          <Button
            title={submitting ? "Publishing..." : "Publish"}
            loading={submitting}
            disabled={submitting}
            onPress={publish}
          />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <AdditionalDetailsModal
        visible={showAdditional}
        values={additional}
        onClose={() => setShowAdditional(false)}
        onSave={(values) => setAdditional(values)}
      />

    </ThemedView>
  );
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
    alignItems: "center",
  },
  photoButton: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    borderStyle: "dashed",
    padding: 0,
    borderRadius: 15,
  },
  thumb: {
    width: 55,
    height: 55,
    borderRadius: 10,
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
  categoryRow: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  input: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
    alignItems: 'center',
    width: "100%",
    borderRadius: 20,
  },
  textField: {
    padding: 5,
    borderWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 8,
  },
  textField1: {
    padding: 5,
    borderWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 8,
    marginRight: 200,
    marginBottom: 10
  }
})