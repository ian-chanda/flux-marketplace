import Button from "@/components/Button";
import { CustomInputField } from "@/components/customInput";
import { LoginView } from "@/components/loginView";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/contexts/auth-context";
import { getFriendlyError } from "@/utils/get-friendly-msg";
import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const { signIn } = useAuth()
	const [error, setError] = useState("")


	const handleSignIn = async () => {
		setError("")
		const trimmedEmail = email.trim();
		const trimmedPassword = password.trim();

		if (!trimmedEmail || !trimmedPassword) {
			setError("please enter your email and password")
			return;
		}

		setIsLoading(true)
		try {
			const success = await signIn({ email: trimmedEmail, password: trimmedPassword })
			if (success)
				router.replace('/(tabs)')
		} catch (error: any) {
			console.log("error occured during log in::" + error.message)
			setError(getFriendlyError(error.message))
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<LoginView>

			<ThemedText type="title" >LOGIN</ThemedText>
			<View style={{ width: '100%' }}>
				<CustomInputField
					onChangeText={setEmail}
					value={email}
					label="email"
				/>
				<CustomInputField
					onChangeText={setPassword}
					secure
					value={password}
					label="password"
					error={error}
				/>
			</View>

			<TouchableOpacity
				onPress={() => router.push("/auth/forgotPassword")}
				style={{ justifyContent: 'flex-start', width: '100%' }}>
				<ThemedText type="link">forgot your password?</ThemedText>
			</TouchableOpacity>
			<Button title="Login" loading={isLoading} onPress={() => handleSignIn()} />

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
		</LoginView>
	)
}
