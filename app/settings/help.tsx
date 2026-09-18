import { CardButtonRow } from "@/components/cardButtonRow"
import { CustomHeader } from "@/components/customHeader"
import { SettingsSection } from "@/components/settingsSection"
import { ThemedText } from "@/components/themed-text"
import { ThemedView } from "@/components/themed-view"
import { useTheme } from "@/hooks/useTheme"
import { MaterialIcons } from "@expo/vector-icons"
import { router } from "expo-router"
import { useState } from "react"
import { ScrollView, TouchableOpacity, View } from "react-native"

type FaqItem = {
	question: string
	answer: string
}

const faqData: { section: string, items: FaqItem[] }[] = [
	{
		section: "Orders & Delivery",
		items: [
			{
				question: "How do I track my order?",
				answer: "Go to My Profile > Purchases to see the status of your current and past orders.",
			},
			{
				question: "Can I change my delivery address after ordering?",
				answer: "You can update your delivery address before an order ships. Go to Settings > Addresses to manage saved addresses, or contact support if your order has already shipped.",
			},
			{
				question: "What happens if I'm not home for delivery?",
				answer: "Our delivery partner will attempt redelivery or leave instructions for pickup, depending on the courier's policy for your area.",
			},
		],
	},
	{
		section: "Account",
		items: [
			{
				question: "How do I get verified?",
				answer: "Go to My Profile and tap 'Get Verified' next to your name. Follow the steps to submit your verification details.",
			},
			{
				question: "How do I change my password?",
				answer: "Go to Settings > Account > Change Password to update your credentials.",
			},
			{
				question: "How do I delete my account?",
				answer: "Go to Settings > Account > Delete Account. This action is permanent and cannot be undone.",
			},
		],
	},
	{
		section: "Payments",
		items: [
			{
				question: "What payment methods are accepted?",
				answer: "We support mobile money and major debit/credit cards, depending on your region.",
			},
			{
				question: "My payment failed but I was charged. What do I do?",
				answer: "Failed payments are usually reversed automatically within a few business days. If it's been longer, please report the issue.",
			},
		],
	},
]

const FaqAccordionItem = ({ item }: { item: FaqItem }) => {
	const { colors } = useTheme()
	const [expanded, setExpanded] = useState(false)

	return (
		<TouchableOpacity
			onPress={() => setExpanded((v) => !v)}
			activeOpacity={0.7}
			style={{
				backgroundColor: colors.surface,
				borderRadius: 15,
				padding: 14,
				gap: expanded ? 8 : 0,
			}}
		>
			<View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
				<ThemedText type="default" style={{ flex: 1, paddingRight: 10 }}>
					{item.question}
				</ThemedText>
				<MaterialIcons
					name={expanded ? "expand-less" : "expand-more"}
					size={22}
					color={colors.accent}
				/>
			</View>
			{expanded && (
				<ThemedText type="defaultFaded">{item.answer}</ThemedText>
			)}
		</TouchableOpacity>
	)
}

export default function HelpCenterScreen() {
	const { colors } = useTheme()

	return (
		<ThemedView>
			<CustomHeader showBack title="Help Center" />

			<ScrollView
				contentContainerStyle={{ gap: 20, paddingHorizontal: 10, paddingVertical: 15, paddingBottom: 60 }}
				showsVerticalScrollIndicator={false}
			>
				<ThemedText type="defaultFaded">
					Find answers to common questions below, or reach out to us directly if you need more help.
				</ThemedText>

				{faqData.map((section, index) => (
					<SettingsSection key={index} title={section.section}>
						<View style={{ gap: 10 }}>
							{section.items.map((item, i) => (
								<FaqAccordionItem key={i} item={item} />
							))}
						</View>
					</SettingsSection>
				))}

				<SettingsSection title="Still need help?">
					<CardButtonRow
						icon="report-problem"
						label="Report a Problem"
						onPress={() => router.push("/settings/report-problem")}
					/>
					<CardButtonRow
						icon="mail-outline"
						label="Contact Support"
						onPress={() => router.push("mailto:support@yourapp.com" as any)}
					/>
				</SettingsSection>
			</ScrollView>
		</ThemedView>
	)
}
