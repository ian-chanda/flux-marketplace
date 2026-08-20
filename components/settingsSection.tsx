import { View } from "react-native"
import { ThemedText } from "./themed-text"

export const SettingsSection = ({
	title,
	children,
}: {
	title: string
	children: React.ReactNode
}) => (
	<View style={{ gap: 10, marginBottom: 10 }}>
		<ThemedText type="defaultBold">{title}</ThemedText>
		{children}
	</View>
)
