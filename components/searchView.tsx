import { LoadingScreen } from "@/app/(tabs)/(search)/results";
import { ChannelItem, ChannelRow } from "@/components/channelRow";
import { CustomSearchBar } from "@/components/customSearchBar";
import { IconButton } from "@/components/iconButton";
import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/contexts/auth-context";
import { useChannels } from "@/hooks/use-channels";
import { useSearchMessages } from "@/hooks/use-search-messages";
import { useTheme } from "@/hooks/useTheme";
import { getTime, getTimePast } from "@/utils/time-past";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { memo, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

type SearchResult = NonNullable<ReturnType<typeof useSearchMessages>["data"]>[number];

type Row =
	| { key: string; type: "header"; title: string }
	| { key: string; type: "channel"; channel: ChannelItem }
	| { key: string; type: "message"; msg: SearchResult; channel?: ChannelItem };

const timeLabel = (iso: string) => {
	const past = getTimePast(iso);
	return past === "today" ? getTime(iso) : past;
};

const MessageResultRow = memo(function MessageResultRow({
	msg,
	channel,
}: {
	msg: SearchResult;
	channel?: ChannelItem;
}) {
	const { user } = useAuth();
	const other = channel?.users?.find((u) => u.id !== user?.id);

	const open = () =>
		router.push({
			pathname: "/messages/[id]",
			params: {
				id: msg.channel_id!,
				recipient_name: other?.username ?? "",
				recipient_avatar: other?.avatar_url ?? "",
				message_id: msg.id, // chat screen scrolls to this message
			},
		});

	return (
		<TouchableOpacity onPress={open} style={styles.messageRow}>
			<View style={styles.messageRowHeader}>
				<ThemedText type="defaultSemiBold" numberOfLines={1} style={{ flex: 1 }}>
					{other?.username}
				</ThemedText>
				<ThemedText type="smallFaded">{timeLabel(msg.created_at)}</ThemedText>
			</View>
			<ThemedText type="small" numberOfLines={2}>
				{msg.user_id === user?.id ? "you: " : ""}
				{msg.content}
			</ThemedText>
		</TouchableOpacity>
	);
});

export const EmptyState = ({ icon, text }: { icon?: "search"; text: string }) => {
	const { colors } = useTheme();
	return (
		<View style={styles.center}>
			{icon && <MaterialIcons name={icon} size={50} color={colors.placeholder} />}
			<ThemedText type="defaultFaded">{text}</ThemedText>
		</View>
	);
};

export const SearchView = ({ onClose }: { onClose: () => void }) => {
	const { colors } = useTheme();
	const { user } = useAuth();

	const [searchValue, setSearchValue] = useState("");
	const [submitted, setSubmitted] = useState("");

	const { data: channels } = useChannels();
	const { data: messages, refetching: isFetching, loading, refetch } = useSearchMessages(submitted);

	const q = searchValue.trim();
	const qLower = q.toLowerCase();

	// message results only count while they match what's in the box
	const messagesAreCurrent = !!submitted && submitted === q;


	const runSearch = () => {
		if (!q) {
			return;
		}
		setSubmitted(q)
		console.log("returning: ", { q, submitted })
		refetch()
	};

	// chats whose person or subject matches, live as the user types
	const chatMatches = useMemo(() => {
		if (!qLower) return [];
		return (channels ?? []).filter((c) => {
			const other = c.users?.find((u) => u.id !== user?.id);
			return (
				other?.username?.toLowerCase().includes(qLower) ||
				c.subject?.toLowerCase().includes(qLower)
			);
		});
	}, [qLower, channels, user?.id]);

	const rows = useMemo<Row[]>(() => {
		const out: Row[] = [];

		if (chatMatches.length) {
			out.push({ key: "h-chats", type: "header", title: "Chats" });
			chatMatches.forEach((channel) =>
				out.push({ key: `c-${channel.id}`, type: "channel", channel }),
			);
		}

		if (messagesAreCurrent && messages?.length) {
			const channelById = new Map((channels ?? []).map((c) => [c.id, c]));
			out.push({ key: "h-messages", type: "header", title: "Messages" });
			messages.forEach((msg) =>
				out.push({
					key: `m-${msg.id}`,
					type: "message",
					msg,
					channel: channelById.get(msg.channel_id ?? ""),
				}),
			);
		}

		return out;
	}, [chatMatches, messagesAreCurrent, messages, channels]);

	const renderRow = ({ item }: { item: Row }) => {
		switch (item.type) {
			case "header":
				return (
					<ThemedText type="smallFaded" style={styles.sectionHeader}>
						{item.title}
					</ThemedText>
				);
			case "channel":
				return <ChannelRow item={item.channel} />;
			case "message":
				return <MessageResultRow msg={item.msg} channel={item.channel} />;
		}
	};

	const searching = messagesAreCurrent && isFetching;

	return (
		<View style={{ flex: 1, backgroundColor: colors.background, paddingHorizontal: 10 }}>
			<View style={styles.topRow}>
				<IconButton icon="chevron-left" onPress={onClose} badgeValue="" />
				<View style={{ flex: 1 }}>
					<CustomSearchBar
						width="100%"
						searchValue={searchValue}
						setSearchValue={setSearchValue}
						onSearch={runSearch}
					/>
				</View>
			</View>

			{!q ? (
				<EmptyState icon="search" text="search chats and messages..." />
			) : isFetching || loading ? (
				<LoadingScreen />
			) : (
				<FlatList
					data={rows}
					keyExtractor={(r) => r.key}
					renderItem={renderRow}
					keyboardShouldPersistTaps="handled"
					contentContainerStyle={{ flexGrow: 1 }}
					ListFooterComponent={
						searching ? (
							<ActivityIndicator size="small" style={{ marginVertical: 16 }} />
						) : !messagesAreCurrent ? (
							<ThemedText type="smallFaded" style={styles.hint}>
								press search to look inside messages
							</ThemedText>
						) : null
					}
					ListEmptyComponent={
						!searching && messagesAreCurrent ? <EmptyState text="no matches" /> : null
					}
				/>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	topRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
	},
	center: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	sectionHeader: {
		paddingTop: 16,
		paddingBottom: 6,
		paddingHorizontal: 10,
	},
	messageRow: {
		paddingVertical: 10,
		paddingHorizontal: 10,
		gap: 2,
	},
	messageRowHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		gap: 10,
	},
	hint: {
		textAlign: "center",
		marginVertical: 16,
	},
});
