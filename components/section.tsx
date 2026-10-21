import { ReactNode } from "react";
import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "./themed-text";

export const Section = ({
	title,
	right,
	children,
}: {
	title: string;
	right?: { label: string; onPress?: () => void };
	children: ReactNode;
}) => (
	<View style={{ gap: 8 }}>
		<View style={{
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
		}}>
			<ThemedText type="defaultBold">{title}</ThemedText>
			{right && (
				<TouchableOpacity onPress={right.onPress}>
					<ThemedText type="smallFaded">{right?.label}</ThemedText>
				</TouchableOpacity>
			)}
		</View>
		{children}
	</View>
);
