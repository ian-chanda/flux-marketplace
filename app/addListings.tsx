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
import { useFetchListingDetails } from "@/hooks/use-fetch-listing-details";
import { useTheme } from "@/hooks/useTheme";
import { getAddressId, getCategory, setCategory } from "@/lib/listingDraft";
import { Tables } from "@/types/database.types";
import { emptyListingForm, ListingForm } from "@/types/listing";
import { toJpegMany } from "@/utils/image";
import * as ImagePicker from "expo-image-picker";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { LoadingScreen } from "./(tabs)/(search)/results";

export const listingToForm = (l: Tables<"listings">): ListingForm => {
  return {
    user_id: "",
    title: l.title,
    description: l.description,
    price: l.price,
    category: l.category,
    condition: l.condition,
    images: l.images ?? [],
    attributes: (l.attributes ?? {}) as AdditionalDetails,
    delivery_available: l.delivery_available,
    pickup_available: l.pickup_available,
  };
};

const PHOTO_LIMIT = 6;
const CONDITIONS = ["New", "Like New", "Used", "Fair"];

// ---------- small building blocks ----------

// same SectionHeader as everywhere else, just without an icon
const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <View style={{ gap: 12 }}>
    <SectionHeader title={title} />
    {children}
  </View>
);

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
      <ThemedText type="defaultFaded">
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
  const { addressId, listingId } = useLocalSearchParams<{ addressId?: string; listingId?: string }>();
  const { data: addresses } = useFetchAddresses();

  const [showAdditional, setShowAdditional] = useState(false);
  const { doCreateListing, isPending: submitting, isError, error } = useCreateListing();
  const { listingData: listing, loading } = useFetchListingDetails(listingId?.trim() ?? "");

  const [priceText, setPrice] = useState<string>("");
  const [localId, setLocalId] = useState<string>("");
  const [pickedAddressId, setPickedAddressId] = useState<string>("");
  const [originalImages, setOriginalImages] = useState<string[]>([]);
  const [form, setForm] = useState<ListingForm>(emptyListingForm);
  const set = <K extends keyof ListingForm>(key: K, value: ListingForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  // when editing you fetch the listing

  if (isError) {
    const message =
      error instanceof Error ? error.message : "Something went wrong. Try again.";
    Alert.alert("Couldn’t publish", message);
  }

  useFocusEffect(
    useCallback(() => {
      setForm((f) => ({ ...f, category: getCategory() ?? f.category }));
      setCategory(form.category);
      setPickedAddressId(getAddressId() as string);
    }, [form.category])
  );

  const initialized = useRef(false);
  useEffect(() => {
    if (!listing || !listingId?.trim() || initialized.current) return;

    initialized.current = true;
    setForm(listingToForm(listing));
    setPrice(String(listing.price));
    setLocalId(listingId as string);
    setOriginalImages(listing.images as string[]);
  }, [listing, listingId]);

  // the address chosen in the picker, otherwise the user's primary one
  const address = useMemo(
    () =>
      addresses?.find((a) => a.id === pickedAddressId) ??
      addresses?.find((a) => a.is_primary),
    [addresses, pickedAddressId]
  );

  // listings are public, so only expose the area, never the street
  const areaOf = (a?: { city?: string | null; province?: string | null } | null) =>
    a ? [...new Set([a.city, a.province].filter(Boolean))].join(", ") : "";

  const locationLabel =
    pickedAddressId || !listing ? areaOf(address) : listing.location ?? areaOf(address);

  const filledAdditionalCount = Object.values(form.attributes ?? {}).filter(
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
      selectionLimit: PHOTO_LIMIT - (form.images as string[]).length,
      quality: 0.7,
    });

    if (!result.canceled && result.assets) {
      const uris = await toJpegMany(result.assets.map((asset) => asset.uri));
      setForm((f) => ({ ...f, images: [...(f.images ?? []), ...uris] }));
    }
  };

  const publish = async () => {
    if (form.title.trim().length <= 0 || form.description.trim().length <= 0 || !priceText.trim()) {
      Alert.alert("Missing details", "Please add a title, description and price.");
      return;
    }

    if (form.category.length <= 0) {
      Alert.alert("Missing category", "Pick a category for your item.");
      return;
    }

    const price = parseFloat(priceText);
    if (isNaN(price) || price <= 0) {
      Alert.alert("Invalid price", "Enter a price greater than 0.");
      return;
    }

    if (locationLabel.length <= 0) {
      Alert.alert("Missing location", "Choose where the item is located.");
      return;
    }

    if (!form.delivery_available && !form.pickup_available) {
      Alert.alert("Delivery or pickup", "Turn on at least one way for buyers to get the item.");
      return;
    }

    if (!user) return;

    doCreateListing.mutate({
      id: localId,
      originalImages: originalImages,
      images: form.images as string[],
      payload: {
        user_id: user.id,
        title: form.title.trim(),
        description: form.description.trim(),
        price: price,
        category: form.category,
        condition: form.condition,
        attributes: form.attributes,
        location: locationLabel,
        delivery_available: form.delivery_available,
        pickup_available: form.pickup_available,
      },
    });
  };

  const inputStyle = [styles.input, { backgroundColor: colors.surface, color: colors.text }];

  if (loading) {
    return (
      <ThemedView isTabVisible={false} style={{ flex: 1 }}>
        <CustomHeader title="Add listing" showBack />
        <LoadingScreen />
      </ThemedView>
    );
  }

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
          {/* photos: equal tiles, wrapping down the page */}
          <Section title="Photos">
            <ThemedText type="smallFaded">
              Add up to {PHOTO_LIMIT} photos. The first one is your cover image.
            </ThemedText>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 10 }}
            >

              {(form.images as string[]).length < PHOTO_LIMIT && (
                <Pressable
                  onPress={pickImages}
                  style={[styles.addTile, { borderColor: colors.placeholder }]}
                >
                  <ThemedText type="defaultBold" style={{ color: colors.accent }}>
                    + Add
                  </ThemedText>
                  <ThemedText type="smallFaded">
                    {(form.images as string[]).length}/{PHOTO_LIMIT}
                  </ThemedText>
                </Pressable>
              )}

              {form.images &&
                form.images.map((uri, index) => (
                  <View key={`${uri}-${index}`}>
                    <Image source={{ uri }} style={styles.photo} />
                    {index === 0 && (
                      <View style={styles.coverTag}>
                        <ThemedText type="smallBold" style={{ color: "white" }}>
                          Cover
                        </ThemedText>
                      </View>
                    )}
                    <Pressable
                      hitSlop={8}
                      onPress={() =>
                        set("images", (form.images as string[]).filter((_, i) => i !== index))
                      }
                      style={styles.removeButton}
                    >
                      <ThemedText style={styles.removeText}>×</ThemedText>
                    </Pressable>
                  </View>
                ))}
            </ScrollView>
          </Section>

          {/* details */}
          <Section title="Details">
            <Field label="Title" required>
              <TextInput
                style={inputStyle}
                value={form.title}
                onChangeText={(x) => set("title", x)}
                maxLength={80}
                placeholder="e.g. iPhone 13 Pro Max 256GB"
                placeholderTextColor={colors.placeholder}
              />
            </Field>

            <Field label="Description" required>
              <TextInput
                style={[inputStyle, styles.multiline]}
                value={form.description}
                onChangeText={(x) => set("description", x)}
                multiline
                textAlignVertical="top"
                placeholder="Describe the condition, features and anything important"
                placeholderTextColor={colors.placeholder}
              />
            </Field>

            <NavRow
              label="Category"
              required
              value={form.category}
              onPress={() => router.push("/modals/category")}
            />

            <NavRow
              label="Additional details"
              value={filledAdditionalCount > 0 ? `${filledAdditionalCount} filled` : undefined}
              placeholder="Optional"
              onPress={() => setShowAdditional(true)}
            />
          </Section>

          {/* price */}
          <Section title="Price">
            <Field label="Price" required hint="Be realistic with your price to sell faster">
              <View style={[styles.priceField, { backgroundColor: colors.surface }]}>
                <ThemedText type="defaultBold" style={{ color: colors.accent, fontSize: 22 }}>
                  K
                </ThemedText>
                <TextInput
                  style={[styles.priceInput, { color: colors.text }]}
                  value={priceText}
                  onChangeText={(x) => setPrice(x.replace(/[^0-9.]/g, ""))}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                  placeholderTextColor={colors.placeholder}
                />
              </View>
            </Field>
          </Section>

          {/* condition */}
          <Section title="Item condition">
            <View style={[styles.segment, { backgroundColor: colors.surface }]}>
              {CONDITIONS.map((condition) => {
                const selected = form.condition === condition;
                return (
                  <TouchableOpacity
                    key={condition}
                    onPress={() => set("condition", selected ? null : condition)}
                    style={[styles.segmentItem, selected && { backgroundColor: colors.accent }]}
                  >
                    <ThemedText
                      type="smallBold"
                      numberOfLines={1}
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
          <Section title="Location">
            <NavRow
              label={address?.label ?? "Item location"}
              required
              value={locationLabel ?? ""}
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
          <Section title="Delivery & pickup">
            <CardButtonRow
              label={"Delivery available"}
              desc="You’ll deliver the item to the buyer"
              right={
                <CustomToggle
                  value={form.delivery_available ?? false}
                  onValueChange={(x) => set("delivery_available", x)}
                  disabled={false}
                />
              }
            />
            <CardButtonRow
              label="Buyer pickup"
              desc="The buyer collects the item from you"
              right={
                <CustomToggle
                  value={form.pickup_available ?? false}
                  onValueChange={(x) => set("pickup_available", x)}
                  disabled={false}
                />
              }
            />
          </Section>
        </ScrollView>

        {/* always reachable, even with the keyboard open */}
        <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.surface }]}>
          <Button
            title={
              submitting
                ? listingId ? "Updating..." : "publishing..."
                : listingId ? "update" : "publish"
            }
            loading={submitting}
            disabled={submitting}
            onPress={publish}
          />
        </View>
      </KeyboardAvoidingView>

      <AdditionalDetailsModal
        visible={showAdditional}
        values={(form.attributes ?? {}) as AdditionalDetails}
        onClose={() => setShowAdditional(false)}
        onSave={(values) => set("attributes", values)}
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
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  // three per row, always square
  photo: {
    width: 88,
    height: 88,
    borderRadius: 12,
  },
  addTile: {
    borderWidth: 1,
    width: 88,
    height: 88,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    gap: 2,
  },
  coverTag: {
    position: "absolute",
    left: 6,
    bottom: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  removeButton: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  removeText: {
    color: "white",
    fontSize: 16,
    lineHeight: 19,
    textAlign: "center",
  },
  priceField: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  priceInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 28,
    fontWeight: "700",
  },
  segment: {
    flexDirection: "row",
    padding: 4,
    borderRadius: 12,
    gap: 4,
  },
  segmentItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 9,
  },
  footer: {
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
