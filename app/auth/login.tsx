import Button from "@/components/Button";
import { CustomInputField } from "@/components/customInput";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { router } from "expo-router";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")

	return (
		<ThemedView style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10 }}>
			<ThemedText type="title" >LOGIN</ThemedText>
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
			</View>

			<TouchableOpacity style={{justifyContent: 'flex-start', width: '100%'}}>
				<ThemedText type="link">forgot your password?</ThemedText>
			</TouchableOpacity>
			<Button title="Login" onPress={() => router.push("/(tabs)")} />

			<View style={{ 
				flexDirection: 'row', 
				alignItems: 'center', 
				justifyContent: 'center', 
				width: '100%', 
				gap: 4, 
				marginTop: 10
			}}>
				<ThemedText>
					dont have an accounts?
				</ThemedText>
				<TouchableOpacity onPress={() => router.push("/auth/signup")}>
					<ThemedText type="link">sign up</ThemedText>
				</TouchableOpacity>
			</View>

		</ThemedView>
	)
}
