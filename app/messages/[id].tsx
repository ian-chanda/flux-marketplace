import { CustomHeader } from "@/components/customHeader";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/contexts/auth-context";
import { useTheme } from "@/hooks/useTheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Avatar } from "@kolking/react-native-avatar";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { Tables } from "@/types/database.types";
import { useAddMessage } from "@/hooks/use-add-message";
import { useMessages } from "@/hooks/use-messages";
import { useChannels } from "@/hooks/use-channels";
import { TouchableOpacity } from "react-native";
import { getTime, } from "@/utils/time-past";
import { useMutationState } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { rgbaColor } from "react-native-reanimated/lib/typescript/Colors";

type Message = Tables<"messages">
type ListMessage = Message & { pending?: boolean, error?: boolean };

const ChatBubble = ({
    item,
    highlighted,
    showTimeStamp,
    shouldBreak,
    joinedAbove,
    joinedBelow
}: {
    item: ListMessage,
    highlighted: boolean,
    showTimeStamp: boolean,
    shouldBreak: boolean,
    joinedAbove: boolean,
    joinedBelow: boolean
}) => {
    const { user } = useAuth();
    const { colors } = useTheme()
    const [showTime, setShowTime] = useState(false)
    const isMe = item.user_id === user?.id;

    const INNER = 5
    const OUTER = 20

    const smallTop = joinedAbove;
    const smallBottom = !(joinedAbove && !joinedBelow);

    // rules
    // single message: rounded everywhere, bottomright = joined, JOIN BELOW, HAS NO MESSAGE BELOW OR ABOVE
    // message below: rounded everywhere, bottomright = joined, JOIN BELOW, HAS MESSAGE BELOW
    // message above: rounded everywhere, topright = joined > JOIN UP, HAS MESSAGE UP

    const shape = isMe
        ? {
            borderTopRightRadius: smallTop ? INNER : OUTER,
            borderBottomRightRadius: smallBottom ? INNER : OUTER,
            borderTopLeftRadius: OUTER,
            borderBottomLeftRadius: OUTER,
        }
        : {
            borderTopRightRadius: OUTER,
            borderBottomRightRadius: OUTER,
            borderTopLeftRadius: smallTop ? INNER : OUTER,
            borderBottomLeftRadius: smallBottom ? INNER : OUTER
        };

    return (
        <View style={{
            width: '100%',
            backgroundColor: highlighted ? colors.primary + '30' : 'transpanrent',
            gap: 5
        }}>
            {showTimeStamp &&
                <View style={{
                    alignItems: 'center'
                }}>
                    {/* TODO: if its been greater than 24hrs just show the day */}
                    <ThemedText type="smallFaded">{getTime(item.created_at)}</ThemedText>

                </View>
            }
            <View style={{
                maxWidth: "80%",
                marginTop: shouldBreak && !joinedAbove ? 5 : 0,
                alignSelf: isMe ? "flex-end" : "flex-start",
                marginLeft: isMe ? "auto" : 10,
                marginRight: isMe ? 10 : "auto",
            }}>

                <View style={{
                    flexDirection: 'row',
                    gap: 5,
                    alignItems: 'center'
                }}>
                    {(item.error && !isMe) && <Ionicons name="alert-circle-outline" size={16} color={colors.error} />}
                    <TouchableOpacity
                        onPress={() => setShowTime(prev => !prev)}
                        style={[
                            styles.messageBox,
                            shape,
                            {
                                backgroundColor: item?.pending ? colors.disabled : isMe ? colors.accent : colors.placeholder,
                            },
                        ]}
                    >
                        <ThemedText style={{ color: colors.background }} darkColor="white">{item.content}</ThemedText>
                    </TouchableOpacity>
                    {(item.error && isMe) && <Ionicons name="alert-circle-outline" size={16} color={colors.error} />}
                </View>
                <View style={{ alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                    {(showTime || item.error) &&
                        <ThemedText type="smallFaded" style={{ color: item.error ? colors.error : colors.text }}>
                            {item.error ? 'error sending' : item.pending ? 'sending...' : getTime(item.created_at)}
                        </ThemedText>
                    }
                </View>
            </View>
        </View>
    );
};



const shouldShowTimeStamp = (iso_a: string, iso_b: string) => {
    const GAP_MS = 6 * 60 * 60 * 1000;
    if (!iso_b) {
        return false
    }

    if ((new Date(iso_a).getTime() - new Date(iso_b).getTime()) > GAP_MS) {
        return true;
    }
}

const shouldBreak = (iso_a: string, iso_b: string) => {
    const GAP_MS = 2 * 60 * 1000;
    if (!iso_b) {
        return false
    }

    if ((new Date(iso_a).getTime() - new Date(iso_b).getTime()) > GAP_MS) {
        return true;
    }
}

export default function ChatScreen() {
    const { id, recipient_name, recipient_avatar, message_id } = useLocalSearchParams()
    const { user } = useAuth();
    const { colors } = useTheme();

    // const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [text, setText] = useState("");
    const jumped = useRef(false)
    const [highlightId, setHighlightId] = useState<string | null>(null)
    const listRef = useRef<FlatList<ListMessage>>(null);
    const { data, loading } = useChannels()

    const { data: messages, loading: loading_msgs } = useMessages(id as string)
    const { addMessage } = useAddMessage(id as string)

    const thisChannel = data?.filter(c => c.id === id)[0]
    const other = thisChannel?.users?.filter(u => u.id !== user?.id)[0]
    const avatar = loading ? recipient_avatar : other?.avatar_url
    const username = loading ? recipient_name : other?.username


    const outgoing = useMutationState({
        filters: { mutationKey: ['messages', id as string] },
        select: (m) => ({
            mutationId: m.mutationId,
            status: m.state.status,
            msg: (m.state.variables as { msg: string } | undefined)?.msg ?? "",
            submittedAt: m.state.submittedAt
        })
    })

    const outgoingMsgs: ListMessage[] = outgoing
        .filter((o) => o.status === 'pending' || o.status === "error")
        .sort((a, b) => b.submittedAt - a.submittedAt)
        .map((o) => ({
            id: `local-${o.mutationId}`,
            user_id: user?.id as string,
            content: o.msg,
            created_at: new Date(o.submittedAt).toISOString(),
            channel_id: id as string,
            error: o.status === "error",
            pending: o.status === "pending"
        }))


    const listData: ListMessage[] = [...outgoingMsgs, ...(messages ?? [])]
    // .sort((a, b) => b.created_at - a.created_at)

    const sendMessage = () => {
        const trimmed = text.trim();
        if (!trimmed) return;

        addMessage.mutate({ channelId: id as string, msg: trimmed })
        setText("");
    };


    useEffect(() => {
        if (!message_id || jumped.current || loading_msgs) return

        const index = listData.findIndex(m => m.id === message_id)
        if (index === -1) return

        jumped.current = true
        setHighlightId(message_id as string)
        requestAnimationFrame(() =>
            listRef.current?.scrollToIndex({ index, viewPosition: 0.5, animated: true })
        )
    }, [listData, message_id, loading_msgs])

    useEffect(() => {
        if (!highlightId) return;
        const t = setTimeout(() => setHighlightId(null), 2000);
        return () => clearTimeout(t)
    }, [highlightId])

    return (
        <ThemedView>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : 'height'}
                keyboardVerticalOffset={0}
                style={{ flex: 1, }}
            >
                <CustomHeader showBack>
                    <View style={{
                        width: '90%',
                        justifyContent: 'flex-start',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5
                    }}
                    >
                        <View>
                            <Avatar
                                source={{ uri: avatar as string }}
                                size={40}
                                color={colors.secondary}
                                radius={100}
                                name={recipient_name as string}
                            />
                        </View>
                        <ThemedText type="subtitle">{username}</ThemedText>
                    </View>

                </CustomHeader>

                {loading || loading_msgs ?
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator size={15} color={colors.accent} />
                    </View>
                    :
                    messages && listData.length > 0 ?
                        <FlatList
                            ref={listRef}
                            data={listData}
                            style={{ flex: 1, }}
                            onScrollToIndexFailed={(info) => {
                                listRef.current?.scrollToOffset({
                                    offset: info.averageItemLength * info.index,
                                    animated: true,
                                })
                                setTimeout(() => {
                                    listRef.current?.scrollToIndex({ index: info.index, viewPosition: 0.5, animated: true }, 100)
                                })

                            }}
                            contentContainerStyle={{ gap: 3, flexGrow: 1, paddingVertical: 5, justifyContent: 'flex-end' }}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item, index }) => {
                                const highlighted = highlightId === item.id
                                const older = listData[index + 1]
                                const newer = listData[index - 1]

                                const showTimeStamp = shouldShowTimeStamp(item?.created_at, older?.created_at) ?? false
                                const joinedAbove = !showTimeStamp && older?.user_id === item?.user_id && !shouldBreak(item?.created_at, older?.created_at) // if theres a message above it
                                const joinedBelow = !!newer && newer.user_id === item.user_id && !shouldBreak(newer?.created_at, item?.created_at) && !shouldShowTimeStamp(newer?.created_at, item?.created_at)

                                return (
                                    <ChatBubble
                                        item={item}
                                        highlighted={highlighted}
                                        joinedAbove={joinedAbove}
                                        joinedBelow={joinedBelow}
                                        shouldBreak={shouldBreak(item?.created_at, older?.created_at) ?? false}
                                        showTimeStamp={showTimeStamp} />
                                )
                            }}
                            inverted
                        />
                        :
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <ThemedText>begin le chat</ThemedText>
                        </View>

                }

                <View style={[styles.inputRow, { borderTopColor: colors.surface }]}>
                    <View style={[styles.search_container, { backgroundColor: colors.surface }]}>
                        <TextInput
                            style={[styles.input, { color: colors.text }]}
                            multiline={true}
                            onChangeText={setText}
                            value={text}
                            placeholderTextColor={colors.placeholder}
                            placeholder="Message.."
                        />
                        <Pressable onPress={() => alert("add media")}>
                            <MaterialIcons name="add" size={24} color={colors.accent} />
                        </Pressable>
                    </View>
                    <Pressable onPress={sendMessage} disabled={!text.trim()}>
                        <MaterialIcons
                            name="send"
                            size={33}
                            color={text.trim() ? colors.accent : colors.disabled}
                        />
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </ThemedView >
    );
}

const styles = StyleSheet.create({
    topBar: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    backButton: {
        flex: 1,
        position: "absolute",
        left: 10,
    },
    profile: {
        width: 40,
        height: 40,
        borderRadius: 50,
    },
    messageBox: {
        paddingLeft: 10,
        paddingRight: 10,
        padding: 8,
    },
    search_container: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 6,
    },
    input: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 12,
        width: "100%",
        borderRadius: 20,
    },
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderTopWidth: 1,
    },
});
