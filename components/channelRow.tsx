import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/contexts/auth-context";
import { useChannels } from "@/hooks/use-channels";
import { useTheme } from "@/hooks/useTheme";
import { getTime, getTimePast } from "@/utils/time-past";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Avatar } from "@kolking/react-native-avatar";
import { router } from "expo-router";
import { memo } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

// derived from the hook so it always matches what the query returns
export type ChannelItem = NonNullable<ReturnType<typeof useChannels>["data"]>[number];


const lastMessageTime = (iso?: string) => {
	if (!iso) return "";
	const past = getTimePast(iso);
	return past === "today" ? getTime(iso) : past;
};

export const ChannelRow = memo(function ChannelRow({ item, message }: {
	item: ChannelItem; message?: NonNullable<ChannelItem["last_msg"]>;
}) {
	const { user } = useAuth();
	const { colors } = useTheme();

	const other = item.users?.find((u) => u.id !== user?.id);
	const lastMsg = message ?? item.last_msg;

	const open = () =>
		router.push({
			pathname: "/messages/[id]",
			params: {
				id: item.id,
				recipient_name: other?.username ?? "",
				recipient_avatar: other?.avatar_url ?? "",
				message_id: message?.id ?? ""
			},
		});

	return (
		<TouchableOpacity onPress={open}>
			<View style={[styles.container, { borderBottomColor: colors.surface }]}>
				<View>
					<Image source={{ uri: item.listings?.images?.[0] }} style={styles.image} />
					<View style={styles.avatar}>
						<Avatar
							source={{ uri: other?.avatar_url ?? undefined }}
							name={other?.username ?? ""}
							size={30}
							color={colors.secondary}
						/>
					</View>
				</View>

				<View style={styles.info}>
					<View style={styles.header}>
						<View style={{ flex: 1 }}>
							<ThemedText type="defaultSemiBold" numberOfLines={1}>
								{other?.username}
							</ThemedText>
							<ThemedText type="smallFaded" numberOfLines={1}>
								{item.subject}
							</ThemedText>
						</View>
						<ThemedText type="smallFaded">{lastMessageTime(lastMsg?.created_at)}</ThemedText>
					</View>

					<View style={styles.messageRow}>
						{lastMsg?.user_id === user?.id && (
							<MaterialIcons name="reply" size={14} color={colors.accent} />
						)}
						<ThemedText type="small" numberOfLines={1} ellipsizeMode="tail" style={{ flex: 1 }}>
							{lastMsg?.content}
						</ThemedText>
					</View>
				</View>
			</View>
		</TouchableOpacity>
	);
});

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		padding: 10,
		borderBottomWidth: 1,
	},
	image: {
		width: 60,
		height: 60,
		borderRadius: 25,
		marginRight: 20,
	},
	avatar: {
		width: 30,
		height: 30,
		borderRadius: 50,
		position: "absolute",
		bottom: 0,
		right: 10,
	},
	info: {
		flex: 1,
		gap: 4,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		gap: 10,
	},
	messageRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
	},
});
