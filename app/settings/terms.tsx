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

export default function TermsOfServiceScreen() {
	return (
		<ThemedView>
			<CustomHeader showBack title="Terms of Service" />
			<ScrollView
				contentContainerStyle={{ gap: 20, paddingHorizontal: 10, paddingVertical: 15, paddingBottom: 60 }}
				showsVerticalScrollIndicator={false}
			>
				<ThemedText type="smallFaded">Last updated: 18 September 2026</ThemedText>

				<Section title="1. Acceptance of Terms">
					By creating an account or using this app, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the app.
				</Section>

				<Section title="2. Eligibility">
					You must be at least 18 years old, or the age of legal majority in your jurisdiction, to create an account and use our services.
				</Section>

				<Section title="3. Your Account">
					You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. Notify us immediately if you suspect unauthorized use of your account.
				</Section>

				<Section title="4. Verification">
					We may offer identity verification features. Providing false or misleading information during verification may result in suspension or termination of your account.
				</Section>

				<Section title="5. Delivery Addresses & Orders">
					You are responsible for the accuracy of delivery addresses and contact information you provide. We are not liable for delays, misdeliveries, or losses resulting from incorrect information supplied by you.
				</Section>

				<Section title="6. Acceptable Use">
					You agree not to misuse the app, including but not limited to: uploading unlawful, abusive, or infringing content, attempting to disrupt the service, or impersonating another person.
				</Section>

				<Section title="7. Content You Provide">
					You retain ownership of content you upload (such as profile photos and bios), but grant us a license to display and store this content as necessary to operate the app.
				</Section>

				<Section title="8. Termination">
					We reserve the right to suspend or terminate accounts that violate these terms, at our discretion, with or without notice.
				</Section>

				<Section title="9. Disclaimers">
					The app is provided "as is" without warranties of any kind. We do not guarantee uninterrupted or error-free service.
				</Section>

				<Section title="10. Limitation of Liability">
					To the fullest extent permitted by law, we are not liable for any indirect, incidental, or consequential damages arising from your use of the app.
				</Section>

				<Section title="11. Changes to These Terms">
					We may update these Terms of Service from time to time. Continued use of the app after changes take effect constitutes acceptance of the revised terms.
				</Section>

				<Section title="12. Contact Us">
					If you have questions about these terms, please contact us through the support section of the app.
				</Section>
			</ScrollView>
		</ThemedView>
	)
}
