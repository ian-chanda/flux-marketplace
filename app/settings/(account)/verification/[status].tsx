import Button from "@/components/Button";
import { CustomHeader } from "@/components/customHeader";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/hooks/useTheme";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { View } from "react-native";

const STATUS_CONFIG = {
	approved: {
		icon: "verified" as const,
		headerTitle: "Verified",
		title: "YOU ARE ALREADY VERIFIED!",
		subtitle: "your listings now get higher priority than unverified ones.",
		showApplyButton: false,
	},
	pending: {
		icon: "schedule" as const,
		headerTitle: "Pending",
		title: "VERIFICATION PENDING",
		subtitle: "we're reviewing your submission. this usually takes less than 48 hours. you'll be notified once it's processed.",
		showApplyButton: false,
	},
	rejected: {
		icon: "cancel" as const,
		headerTitle: "Rejected",
		title: "VERIFICATION REJECTED",
		subtitle: "your submission didn't meet our requirements. you're welcome to re-apply with clearer documents.",
		showApplyButton: true,
	},
};

export default function VerificationPage() {
	const { colors } = useTheme();
	const { status, from } = useLocalSearchParams<{ status: keyof typeof STATUS_CONFIG, from: string }>();

	const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
	const iconColor = status === 'rejected' ? colors.error : colors.link;

	return (
		<ThemedView style={{ position: 'relative', paddingHorizontal: 10 }}>
			<CustomHeader title="Verification Status" showBack/>
			<MaterialIcons
				name={config.icon}
				size={200}
				color={iconColor}
				style={{
					opacity: 0.1,
					position: 'absolute',
					top: '50%', left: '50%',
					marginLeft: -100, marginTop: -100
				}} />
			<View style={{ flex: 1, justifyContent: 'center', gap: 12 }}>
				<ThemedText type="title" style={{textAlign: 'center'}}>
					{config.title}
				</ThemedText>
				<ThemedText type="mediumFaded">
					{config.subtitle}
				</ThemedText>
				{config.showApplyButton && (
					<Button
						title="Re-Apply for Verification"
						onPress={() => router.push ({
							pathname: '/settings/verification/verification',
							params: {goto: from}
						})}
					/>
				)}
			</View>
		</ThemedView>
	);
}
