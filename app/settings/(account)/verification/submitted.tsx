import Button from "@/components/Button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function VerificationPage() {
  const { colors } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const insets = useSafeAreaInsets()

  const handleDone = async () => {
    setIsSubmitting(true);
    try {
      // TODO: upload ID document, insert into verification_requests
      router.dismissAll()
      router.replace('/me/profile');
    } catch (error: any) {
      console.log("verification apply error:", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemedView style={{ position: 'relative', paddingTop: insets.top }}>

      <Ionicons 
        name="checkmark-circle" 
        size={200} 
        color={colors.disabled}
        style={{ 
          opacity: 0.5, 
          position: 'absolute', 
          top: '50%', left: '50%',
          marginLeft: -100, marginTop: -100
        }}/>

      <View style={{ flex: 1, justifyContent: 'center', gap: 12 }}>
        <ThemedText type="title">
          THANK YOU FOR APPLYING!
        </ThemedText>
        <ThemedText type="mediumFaded">
          You will be notified when your verification has been processed.{`\n`}
          The process should take less than 42 hours.
        </ThemedText>
      </View>

      <Button
        title="Done"
        loading={isSubmitting}
        onPress={handleDone}
      />
    </ThemedView>
  );
}
