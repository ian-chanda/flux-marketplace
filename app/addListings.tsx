import { AdditionalDetails, AdditionalDetailsModal } from "@/components/additionalDetailsModal";
import Button from "@/components/Button";
import { CardButtonRow } from "@/components/cardButtonRow";
import { CustomHeader } from "@/components/customHeader";
import { CustomToggle } from "@/components/customToggleButton";
import { NavRow } from "@/components/navrow";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { SectionHeader } from "@/components/titleBar";
import { useAuth } from "@/contexts/auth-context";
import { useCreateListing } from "@/hooks/use-create-listing";
import { useFetchAddresses } from "@/hooks/use-fetch-addresses";
import { useTheme } from "@/hooks/useTheme";
import { getCategory } from "@/lib/listingDraft";
import { createListing, uploadListingImages } from "@/services/listings";
import { toJpegMany } from "@/utils/image";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { ReactNode, useCallback, useMemo, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const PHOTO_LIMIT = 6;
const CONDITIONS = ["New", "Like New", "Used", "Fair"];

// ---------- small building blocks ----------

const Section = ({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: ReactNode;
}) => {
  const { colors } = useTheme();
  return (
    <View style={{ gap: 12 }}>
      <SectionHeader icon={icon} title={title} iconColor={colors.accent} />
      {children}
    </View>
  );
};

const Field = ({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}) => {
  const { colors } = useTheme();
  return (
    <View style={{ gap: 6 }}>
      <ThemedText type="defaultBold">
        {label}
        {required && (
          <ThemedText type="defaultBold" style={{ color: colors.accent }}>
            {" "}
            *
          </ThemedText>
        )}
      </ThemedText>
      {children}
      {hint && <ThemedText type="smallFaded">{hint}</ThemedText>}
    </View>
  );
};

// ---------- screen ----------

export default function AddListings() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { addressId } = useLocalSearchParams<{ addressId?: string }>();
  const { data: addresses } = useFetchAddresses();

  const [itemName, setItemName] = useState("");
  const [itemDetails, setItemDetails] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [category, setCategory] = useState<string>(getCategory() ?? "");
  const [additional, setAdditional] = useState<AdditionalDetails>({});
  const [showAdditional, setShowAdditional] = useState(false);
  const [delivery, setDelivery] = useState(true);
  const [pickup, setPickup] = useState(false);
  const { doCreateListing, isPending: submitting, isError, error } = useCreateListing()

  if (isError) {
    const message =
      error instanceof Error ? error.message : "Something went wrong. Try again.";
    Alert.alert("Couldn’t publish", message);
  }

  useFocusEffect(
    useCallback(() => {
      setCategory(getCategory() ?? "");
    }, [])
  );

  // the address chosen in the picker, otherwise the user's primary one
  const address = useMemo(
    () =>
      addresses?.find((a) => a.id === addressId) ??
      addresses?.find((a) => a.is_primary),
    [addresses, addressId]
  );

  // listings are public, so only expose the area, never the street
  const locationLabel = address
    ? [...new Set([address.city, address.province].filter(Boolean))].join(", ")
    : "";

  const filledAdditionalCount = Object.values(additional).filter(
    (v) => v && v.trim()
  ).length;

  const pickImages = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission needed",
        "Allow photo library access to add photos to your listing."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: PHOTO_LIMIT - images.length,
      quality: 0.7,
    });

    if (!result.canceled && result.assets) {
      const uris = await toJpegMany(result.assets.map((asset) => asset.uri));
      setImages((prev) => [...prev, ...uris].slice(0, PHOTO_LIMIT));
    }
  };


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

    if (!locationLabel) {
      Alert.alert("Missing location", "Choose where the item is located.");
      return;
    }

    if (!delivery && !pickup) {
      Alert.alert("Delivery or pickup", "Turn on at least one way for buyers to get the item.");
      return;
    }

    if (!user) return;

    doCreateListing.mutate({
      images: images,
      payload: {
        user_id: user.id,
        title: itemName.trim(),
        description: itemDetails.trim(),
        price: price,
        category: category,
        condition: selectedCondition,
        attributes: additional,
        location: locationLabel,
        delivery_available: delivery,
        pickup_available: pickup,
      }
    })
  };

  const inputStyle = [styles.input, { backgroundColor: colors.surface, color: colors.text }];

  return (
    <ThemedView isTabVisible={false} style={{ flex: 1 }}>
      <CustomHeader title="Add listing" showBack />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.page}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* photos */}
          <Section icon="image" title="Photos">
            <ThemedText type="smallFaded">
              Add up to {PHOTO_LIMIT} photos. The first one is your cover image.
            </ThemedText>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 10 }}
            >
              {images.length < PHOTO_LIMIT && (
                <Pressable
                  onPress={pickImages}
                  style={[styles.addTile, { borderColor: colors.placeholder }]}
                >
                  <MaterialIcon name="add-a-photo" size={28} color={colors.accent} />
                  <ThemedText type="smallFaded">
                    {images.length}/{PHOTO_LIMIT}
                  </ThemedText>
                </Pressable>
              )}

              {images.map((uri, index) => (
                <View key={`${uri}-${index}`}>
                  <Image source={{ uri }} style={styles.thumb} />
                  {index === 0 && (
                    <View style={styles.coverTag}>
                      <ThemedText type="smallBold" style={{ color: "white" }}>
                        Cover
                      </ThemedText>
                    </View>
                  )}
                  <Pressable
                    hitSlop={8}
                    onPress={() => setImages((prev) => prev.filter((_, i) => i !== index))}
                    style={styles.removeButton}
                  >
                    <MaterialIcon name="close" size={14} color="white" />
                  </Pressable>
                </View>
              ))}
            </ScrollView>
          </Section>

          {/* details */}
          <Section icon="information-circle" title="Details">
            <Field label="Title" required>
              <TextInput
                style={inputStyle}
                value={itemName}
                onChangeText={setItemName}
                maxLength={80}
                placeholder="e.g. iPhone 13 Pro Max 256GB"
                placeholderTextColor={colors.placeholder}
              />
            </Field>

            <Field label="Description" required>
              <TextInput
                style={[inputStyle, styles.multiline]}
                value={itemDetails}
                onChangeText={setItemDetails}
                multiline
                textAlignVertical="top"
                placeholder="Describe the condition, features and anything important"
                placeholderTextColor={colors.placeholder}
              />
            </Field>

            <NavRow
              icon="label"
              label="Category"
              required
              value={category}
              onPress={() => router.push("/modals/category")}
            />

            <NavRow
              icon="tune"
              label="Additional details"
              value={filledAdditionalCount > 0 ? `${filledAdditionalCount} filled` : undefined}
              placeholder="Optional"
              onPress={() => setShowAdditional(true)}
            />
          </Section>

          {/* price */}
          <Section icon="wallet-outline" title="Price">
            <Field label="Price" required hint="Be realistic with your price to sell faster">
              <View style={[styles.priceField, { backgroundColor: colors.surface }]}>
                <ThemedText type="defaultBold" style={{ color: colors.accent }}>
                  K
                </ThemedText>
                <TextInput
                  style={[styles.priceInput, { color: colors.text }]}
                  value={itemPrice}
                  onChangeText={(t) => setItemPrice(t.replace(/[^0-9.]/g, ""))}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                  placeholderTextColor={colors.placeholder}
                />
              </View>
            </Field>
          </Section>

          {/* condition */}
          <Section icon="shield-outline" title="Item condition">
            <View style={styles.chips}>
              {CONDITIONS.map((condition) => {
                const selected = selectedCondition === condition;
                return (
                  <TouchableOpacity
                    key={condition}
                    onPress={() => setSelectedCondition(selected ? null : condition)}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: selected ? colors.accent : colors.surface,
                      },
                    ]}
                  >
                    <ThemedText
                      type="smallBold"
                      style={{ color: selected ? colors.background : colors.text }}
                    >
                      {condition}
                    </ThemedText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Section>

          {/* location */}
          <Section icon="location-outline" title="Location">
            <NavRow
              label={address?.label ?? "Item location"}
              required
              value={locationLabel}
              onPress={() =>
                router.navigate({
                  pathname: "/modals/location",
                  params: { selected: address?.id ?? "" },
                })
              }
            />
            <ThemedText type="smallFaded">
              Buyers only see the area, never your street address.
            </ThemedText>
          </Section>

          {/* delivery */}
          <Section icon="car-outline" title="Delivery & pickup">
            <CardButtonRow
              icon={"directions-car"}
              label={"Delivery available"}
              desc="You’ll deliver the item to the buyer"
              right={<CustomToggle value={delivery} onValueChange={setDelivery} disabled={false} />}
            />
            <CardButtonRow
              icon="directions-walk"
              label="Buyer pickup"
              desc="The buyer collects the item from you"
              right={<CustomToggle value={pickup} onValueChange={setPickup} disabled={false} />}
            />
          </Section>
        </ScrollView>

        {/* always reachable, even with the keyboard open */}
        <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.surface }]}>
          <Button
            title={submitting ? "Publishing..." : "Publish"}
            loading={submitting}
            disabled={submitting}
            onPress={publish}
          />
        </View>
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
  page: {
    padding: 15,
    gap: 28,
    paddingBottom: 30,
  },
  input: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
  },
  multiline: {
    minHeight: 110,
  },
  priceField: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignSelf: "flex-start",
    minWidth: 160,
  },
  priceInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  navRow: {
    width: '100%',
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 12,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  addTile: {
    width: 88,
    height: 88,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  thumb: {
    width: 88,
    height: 88,
    borderRadius: 12,
  },
  coverTag: {
    position: "absolute",
    left: 4,
    bottom: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  removeButton: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  footer: {
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
