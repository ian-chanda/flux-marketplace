import { useTheme } from "@/hooks/useTheme";
import { ReactNode } from "react";
import {
	KeyboardAvoidingView,
	Modal,
	Platform,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "./themed-text";

type CustomModalProps = {
	title: string;
	visible: boolean;
	children: ReactNode;
	right?: ReactNode;
	fullscreen?: boolean;
	onClose: () => void;
};

export function CustomModal({
	title,
	visible,
	children,
	right,
	fullscreen = false,
	onClose,
}: CustomModalProps) {
	const { colors } = useTheme();
	const insets = useSafeAreaInsets();

	return (
		<Modal
			visible={visible}
			transparent
			animationType="slide"
			statusBarTranslucent={fullscreen} // lets the sheet reach the top edge on Android
			onRequestClose={onClose}
		>
			<KeyboardAvoidingView
				style={styles.overlay}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
			>
				{/* nothing behind a fullscreen sheet to tap, so no backdrop */}
				{!fullscreen && (
					<TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
				)}

				<View
					style={[
						styles.sheet,
						{ backgroundColor: colors.background },
						fullscreen && {
							flex: 1,
							borderTopLeftRadius: 0,
							borderTopRightRadius: 0,
							paddingTop: insets.top + 10,
							paddingBottom: insets.bottom,
						},
					]}
				>
					{!fullscreen && <View style={styles.handle} />}

					<View style={styles.header}>
						<ThemedText type="defaultBold" style={{ flexShrink: 1 }}>
							{title}
						</ThemedText>

						<View style={styles.headerRight}>
							{right}
							{/* no backdrop or drag handle in fullscreen, so give it a visible way out */}
							{fullscreen && (
								<TouchableOpacity onPress={onClose} hitSlop={8}>
									<ThemedText type="defaultBold" style={{ color: colors.accent }}>
										Close
									</ThemedText>
								</TouchableOpacity>
							)}
						</View>
					</View>

					{/* flex: 1 here is what lets a child list fill the screen */}
					<View style={fullscreen ? { flex: 1 } : undefined}>{children}</View>
				</View>
			</KeyboardAvoidingView>
		</Modal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		justifyContent: "flex-end",
	},
	backdrop: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(0,0,0,0.4)",
	},
	sheet: {
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		paddingHorizontal: 20,
		paddingTop: 10,
	},
	handle: {
		alignSelf: "center",
		width: 40,
		height: 4,
		borderRadius: 2,
		backgroundColor: "#D3D3D3",
		marginBottom: 10,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		gap: 12,
		paddingVertical: 12,
	},
	headerRight: {
		flexDirection: "row",
		alignItems: "center",
		gap: 16,
	},
});
