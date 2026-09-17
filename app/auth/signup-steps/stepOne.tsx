import Button from "@/components/Button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { router } from "expo-router";
import { SafeAreaView, StyleSheet } from "react-native";

export default function StepOneScreen() {
	return (
		<ThemedView isTabVisible={false} style={{ flex: 1 }}>
			<SafeAreaView style={styles.container}>
				<ThemedText type="subtitle">Let&apos;t get to know you</ThemedText>
				<ThemedText type="mediumFaded">Step 1 of your profile setup.</ThemedText>
				<Button title="Continue" onPress={() => router.replace("/(tabs)")} />
			</SafeAreaView>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		paddingHorizontal: 20,
		gap: 12,
	},
});