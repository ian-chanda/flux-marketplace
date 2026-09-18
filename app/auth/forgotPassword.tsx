import Button from "@/components/Button";
import { CustomHeader } from "@/components/customHeader";
import { CustomInputField } from "@/components/customInput";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/hooks/useTheme";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { View } from "react-native";
import * as Linking from "expo-linking"

export default function ForgotPasswordScreen() {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false);


  const forgotPass = async () => {
    if (!email.trim()) {
      setError("email requires password")
      return
    }

    setIsLoading(true)
    try {

      
      const redirectTo = Linking.createURL("settings/(account)/changePassword")
      console.log(redirectTo)
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectTo
      })

      if (error) throw error
      console.log("recovery link sent")
    }
    catch (error: any) {
      console.log("error::" + error.message)
    } finally {
      setIsLoading(false)

    }
  }

  return (
    <ThemedView style={{ flex: 1 }}>
      <CustomHeader title="Forgot Password" showBack />
      <View style={{ flex: 1, paddingHorizontal: 10 }}>
        <ThemedText type="defaultFaded">enter the email linked to your account to receive a recovery link.</ThemedText>
        <View style={{ marginBottom: 10 }} />
        <CustomInputField placeholder="email" value={email} onChangeText={setEmail} />
        <View style={{ marginBottom: 10 }} />
        <Button title="Change" loading={isLoading} onPress={() => forgotPass()} />
      </View>
    </ThemedView>
  )
}
