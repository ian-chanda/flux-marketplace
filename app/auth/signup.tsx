import Button from "@/components/Button";
import { CustomInputField } from "@/components/customInput";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/contexts/auth-context";
import { getFriendlyError } from "@/utils/get-friendly-msg";
import { router } from "expo-router";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

export default function SignUpScreen() {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState("")
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [passwordConfirm, setPasswordConfirm] = useState("")
	const { signUp } = useAuth()

	const handleSignUp = async () => {
		setIsLoading(true)
		setError("")

		try {
			if (!email.trim() || !password.trim() || !passwordConfirm.trim()) {
				setError("please fill in all fields")
				return;
			}
			if (password.trim() !== passwordConfirm.trim()) {
				setError("passwords dont match")
				return;
			}
			if (password.trim().length < 6) {
				setError("password must be at least 6 characters")
				return;
			}
			
			await signUp(email.trim(), password.trim())
			router.push('/(tabs)')
		} catch (error: any) {
			console.log("error occured::" + error.message)
			setError(getFriendlyError(error.message))
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<ThemedView style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10 }}>
			<ThemedText type="title" >SIGNUP</ThemedText>
			<View style={{ width: '100%' }}>
				<CustomInputField
					onChangeText={setEmail}
					value={email}
					label="email"
				/>
				<CustomInputField
					onChangeText={setPassword}
					value={password}
					label="password"
					secure
				/>
				<CustomInputField
					onChangeText={setPasswordConfirm}
					value={passwordConfirm}
					label="confirm password"
					error={error}
					secure
				/>
			</View>

			<Button
				title="Signup"
				loading={isLoading}
				onPress={() => handleSignUp()}
			/>

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
