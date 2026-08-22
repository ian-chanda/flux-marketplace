import Button from "@/components/Button";
import { CustomInputField } from "@/components/customInput";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { router } from "expo-router";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

export default function SignUpScreen() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [confPassword, setConfirmPassword] = useState("")

	return (
		<ThemedView style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10 }}>
			<ThemedText type="title" >SIGNUP</ThemedText>
			<View style={{width: '100%'}}>
				<CustomInputField
					onChangeText={setEmail}
					value={email}
					label="email"
				/>
				<CustomInputField
					onChangeText={setPassword}
					value={password}
					label="password"
				/>
				<CustomInputField
					onChangeText={setConfirmPassword}
					value={confPassword}
					label="confirm password"
				/>
			</View>

			<Button title="Signup" onPress={() => router.push("/(tabs)")} />

			<View style={{ 
				flexDirection: 'row', 
				alignItems: 'center', 
				justifyContent: 'center', 
				width: '100%', 
				gap: 4, 
				marginTop: 10
			}}>
				<ThemedText>
					already have an accounts?
				</ThemedText>
				<TouchableOpacity onPress={() => router.push("/auth/login")}>
					<ThemedText type="link">login</ThemedText>
				</TouchableOpacity>
			</View>

		</ThemedView>
	)
}
