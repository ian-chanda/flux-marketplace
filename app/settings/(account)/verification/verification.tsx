import Button from "@/components/Button";
import { CustomHeader } from "@/components/customHeader";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/contexts/auth-context";
import { useImagePicker } from "@/hooks/use-pick-image";
import { useTheme } from "@/hooks/useTheme";
import { supabase } from "@/lib/supabase";
import { submitVerification } from "@/services/verifications";
import { getFriendlyError } from "@/utils/get-friendly-msg";
import { MaterialIcons } from "@expo/vector-icons";
import { RelativePathString, router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

export default function VerificationPage() {
  const { colors } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [idImage, setIdImage] = useState<string | null>(null);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth()
  const { pickImage } = useImagePicker()
  const {goto} = useLocalSearchParams();

  const handleApply = async () => {
    setIsSubmitting(true)
    try {
      if (!idImage || !selfieImage) return console.error("please add images!")

      await submitVerification({ userId: user?.id as string, idUri: idImage, selfieUri: selfieImage })
      router.replace("/me")
      router.dismissAll()

    } catch (error: any) {
      console.error("shit got fucked: ", error.message)
    } finally {
      setIsSubmitting(false)
    }
  };

  return (
    <ThemedView style={{ paddingBottom: 20 }}>
      <CustomHeader showBack title="Apply for Verification" goto={goto as RelativePathString} />

      <ScrollView
        style={{ paddingBottom: 20 }}
        contentContainerStyle={{ gap: 20, paddingHorizontal: 10 }}
      >
        <ThemedText type="defaultFaded">
          BEING VERIFIED GIVES YOU ADVANTAGES.{'\n'}
          1. your account will have a verified badge, this makes users trust you more.{'\n'}
          2. your listings get higher priority{'\n'}
          3. unverified accounts may have limited visibility or won't be able to post listings{'\n\n'}
          Verification is a <ThemedText type="defaultSemiBold">FREE</ThemedText> one-time process and takes less than 48 hours.
          your ID is only used to confirm your identity and is never shown publicly.
        </ThemedText>

        {error && (
          <ThemedText style={{ color: colors.error }}>{error}</ThemedText>
        )}
        <View style={{ gap: 8 }}>
          <ThemedText type="smallFaded">ID DOCUMENT</ThemedText>
          <TouchableOpacity
            onPress={() => pickImage(setIdImage)}
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              height: 160,
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {idImage ? (
              <>
                <Image source={{ uri: idImage }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />

                <View style={styles.coverOverlay}>
                  <MaterialIcons name="camera" size={20} color="white" />
                  <ThemedText style={{ color: 'white', fontSize: 12, marginTop: 4 }}>Change</ThemedText>
                </View>
              </>
            ) : (
              <>
                <MaterialIcons name="add-card" size={28} color={colors.disabled} />
                <ThemedText type="defaultFaded">Tap to add your ID(e.g. NRC)</ThemedText>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={{ gap: 8 }}>
          <ThemedText type="smallFaded">SELFIE</ThemedText>
          <TouchableOpacity
            onPress={() => pickImage(setSelfieImage)}
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              height: 160,
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {selfieImage ? (
              <>
                <Image source={{ uri: selfieImage }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />

                <View style={styles.coverOverlay}>
                  <MaterialIcons name="camera" size={20} color="white" />
                  <ThemedText style={{ color: 'white', fontSize: 12, marginTop: 4 }}>Change</ThemedText>
                </View>
              </>
            ) : (
              <>
                <MaterialIcons name="person-outline" size={28} color={colors.disabled} />
                <ThemedText type="defaultFaded">Tap to add a clear selfie</ThemedText>
              </>
            )}
          </TouchableOpacity>
        </View>


        <Button
          title="Apply for Verification"
          loading={isSubmitting}
          onPress={handleApply}
        />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  coverOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
