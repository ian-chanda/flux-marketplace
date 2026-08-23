import Button from "@/components/Button"
import { CustomHeader } from "@/components/customHeader"
import { CustomInputField } from "@/components/customInput"
import { ThemedView } from "@/components/themed-view"
import { useTheme } from "@/hooks/useTheme"
import { router } from "expo-router"
import { useState } from "react"
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native"

export default function AddressScreen() {
    const { colors } = useTheme()
    const [name, setName] = useState("");
    const [done, setDone] = useState<number | null>(null);

    const handleSetDone = ( done: number ) => {
        setDone(done);
        router.back();
    }

    return (
        <ThemedView>
            <CustomHeader title="Address">
            </CustomHeader>

            <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={10}>
                <ScrollView 
                    style={{ paddingHorizontal: 10,}}
                    contentContainerStyle={{gap: 10}}
                >
                    <CustomInputField
                        onChangeText={setName}
                        value={name}
                        placeholder="address nickname"
                    />
                    <CustomInputField
                        onChangeText={setName}
                        value={name}
                        placeholder="name"
                    />
                    <CustomInputField
                        onChangeText={setName}
                        value={name}
                        placeholder="country or region"
                    />
                    <CustomInputField
                        onChangeText={setName}
                        value={name}
                        placeholder="street address"
                    />
                    <CustomInputField
                        onChangeText={setName}
                        value={name}
                        placeholder="street address 2"
                    />
                    <CustomInputField
                        onChangeText={setName}
                        value={name}
                        placeholder="city"
                    />
                    <CustomInputField
                        onChangeText={setName}
                        value={name}
                        placeholder="state/province/region"
                    />
                    <CustomInputField
                        onChangeText={setName}
                        value={name}
                        placeholder="phone number"
                    />
                    <Button title="Done" onPress={() => handleSetDone(1)}/>


                </ScrollView>
            </KeyboardAvoidingView>
        </ThemedView>

    )
}
