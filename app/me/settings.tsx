import { CardButtonRow } from "@/components/cardButtonRow"
import { CustomHeader } from "@/components/customHeader"
import { SettingsSection } from "@/components/settingsSection"
import { ThemedText } from "@/components/themed-text"
import { ThemedView } from "@/components/themed-view"
import { DarkModeToggle } from "@/components/toggleButton"
import { useTheme } from "@/hooks/useTheme"
import { router } from "expo-router"
import { ScrollView, View } from "react-native"

export default function SettingsScreen() {
	const { colors, context } = useTheme()
	const isDark = context?.theme === "dark"

	return (
		<ThemedView isTabVisible={false} style={{ paddingHorizontal: 10, gap: 10 }}>
			<CustomHeader showBack title="Settings" />

			<ScrollView
				contentContainerStyle={{ gap: 10, paddingBottom: 100 }}
				showsVerticalScrollIndicator={false}
			>
				<SettingsSection title="Account">
					<CardButtonRow
						label="Delivery address"
						onPress={() => router.push('/settings/address/deliveryAddress')}
					/>
					<CardButtonRow
						label="Change password"
						onPress={() => router.push('/settings/changePassword')}
					/>
				</SettingsSection>

				<SettingsSection title="Notifications">
					<CardButtonRow
						label="Push notifications"
						onPress={() => { }}
					/>
				</SettingsSection>

				<SettingsSection title="General">
					<CardButtonRow
						icon={isDark ? "dark-mode" : "light-mode"}
						label={isDark ? "Dark mode" : "Light mode"}
						right={<DarkModeToggle />}
					/>
					<CardButtonRow
						label="Country or Region"
						desc="Zambia"
						onPress={() => { }}
					/>
				</SettingsSection>

				<SettingsSection title="Support">
					<CardButtonRow
						label="Help center"
						onPress={() => router.push("/settings/help")}
					/>
					<CardButtonRow
						label="Report a problem"
						onPress={() => router.push("/settings/report")}
					/>
				</SettingsSection>

				<SettingsSection title="About">
					<CardButtonRow
						label="Terms of service"
						onPress={() => router.push("/settings/terms")}
					/>
					<CardButtonRow
						label="Privacy policy"
						onPress={() => router.push("/settings/privacyPolicy")}
					/>
					<CardButtonRow
						label="App version"
						right={<ThemedText type="smallFaded">1.0.0</ThemedText>}
					/>
				</SettingsSection>

				<CardButtonRow
					icon="delete-outline"
					label="Delete account"
					destructive
					onPress={() => router.push("/settings/delete-account")}
				/>
			</ScrollView>
		</ThemedView>
	)
}


