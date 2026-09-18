import { CustomHeader } from "@/components/customHeader"
import { ThemedText } from "@/components/themed-text"
import { ThemedView } from "@/components/themed-view"
import { ScrollView, View } from "react-native"

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
	<View style={{ gap: 6 }}>
		<ThemedText type="mediumBold">{title}</ThemedText>
		<ThemedText type="defaultFaded">{children}</ThemedText>
	</View>
)

export default function PrivacyPolicyScreen() {
	return (
		<ThemedView>
			<CustomHeader showBack title="Privacy Policy" />
			<ScrollView
				contentContainerStyle={{ gap: 20, paddingHorizontal: 10, paddingVertical: 15, paddingBottom: 60 }}
				showsVerticalScrollIndicator={false}
			>
				<ThemedText type="smallFaded">Last updated: 18 September 2026</ThemedText>

				<Section title="1. Information We Collect">
					We collect information you provide directly, such as your name, username, phone number, profile photo, bio, and delivery addresses. We may also collect location data (city, country) and device information to improve your experience.
				</Section>

				<Section title="2. How We Use Your Information">
					We use your information to operate and improve the app, process deliveries, verify your identity when requested, personalize your experience, and communicate with you about your account.
				</Section>

				<Section title="3. Delivery Address Data">
					Addresses you save are used solely to facilitate deliveries and are only shared with parties directly involved in fulfilling your orders.
				</Section>

				<Section title="4. Verification Data">
					If you choose to verify your account, any documents or information submitted are used only for verification purposes and are handled with additional security safeguards.
				</Section>

				<Section title="5. Sharing of Information">
					We do not sell your personal information. We may share limited information with trusted service providers (such as payment processors or delivery partners) strictly to provide our services.
				</Section>

				<Section title="6. Data Storage & Security">
					Your data is stored securely using industry-standard practices. While we take reasonable steps to protect your information, no method of storage or transmission is completely secure.
				</Section>

				<Section title="7. Your Choices">
					You can update or delete your profile information, including your bio, photos, and saved addresses, at any time through your account settings.
				</Section>

				<Section title="8. Data Retention">
					We retain your information for as long as your account is active or as needed to provide services, comply with legal obligations, and resolve disputes.
				</Section>

				<Section title="9. Children's Privacy">
					Our app is not intended for individuals under 18. We do not knowingly collect information from minors.
				</Section>

				<Section title="10. Changes to This Policy">
					We may update this Privacy Policy periodically. We will notify you of significant changes through the app.
				</Section>

				<Section title="11. Contact Us">
					If you have questions about this Privacy Policy or how your data is handled, please reach out through the support section of the app.
				</Section>
			</ScrollView>
		</ThemedView>
	)
}
