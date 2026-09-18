import Button from "@/components/Button";
import { CustomInputField } from "@/components/customInput";
import { LoginView } from "@/components/loginView";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/contexts/auth-context";
import { isUsernameConflict } from "@/utils/check-error-violation";
import { genRandUsername } from "@/utils/gen-rand-username";
import { getFriendlyError } from "@/utils/get-friendly-msg";
import { router } from "expo-router";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

export default function SignUpScreen() {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState("")
	const [firstName, setFirstName] = useState("")
	const [lastName, setLastName] = useState("")
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [passwordConfirm, setPasswordConfirm] = useState("")
	const { signUp } = useAuth()

	const handleSignUp = async () => {
		setIsLoading(true)
		setError("")
		for (let attempt = 0; attempt < 5; attempt++) {
			const username = genRandUsername(firstName.trim());

			try {
				if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim() || !passwordConfirm.trim()) {
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

				await signUp(
					email.trim(),
					password.trim(),
					firstName.trim(),
					lastName.trim(),
					username
				)

				router.push('/(tabs)')
				return true
			} catch (error: any) {
				if (isUsernameConflict(error)) {
					console.log("user name conflict ::" + error.message)
				}else{
					console.log("error occured::" + error.message)
					setError(getFriendlyError(error.message))
					throw error
				}
			}
		}

		setIsLoading(false)
	}

	return (
		<LoginView>
			<ThemedText type="title" >SIGNUP</ThemedText>
			<View style={{ width: '100%' }}>
				<CustomInputField
					onChangeText={setFirstName}
					value={firstName}
					label="first name"
				/>
				<CustomInputField
					onChangeText={setLastName}
					value={lastName}
					label="last name"
				/>
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

		</LoginView>
	)
}
