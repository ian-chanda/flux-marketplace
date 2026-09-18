import { KeyboardAvoidingView, Platform, ScrollView } from "react-native"
import { ThemedView } from "./themed-view"

export const LoginView = ({children} : {children: React.ReactNode}) => {
	return (
		<ThemedView style={{flex: 1}}>

			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
			>

				<ScrollView
					style={{flex: 1}}
					contentContainerStyle={{
						flexGrow: 1,
						justifyContent: 'center',
						alignItems: 'center',
						paddingHorizontal: 10
					}}
				>
					{children}

				</ScrollView>
			</KeyboardAvoidingView>
		</ThemedView>

	)
}
