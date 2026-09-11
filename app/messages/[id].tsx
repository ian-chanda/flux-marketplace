import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/useTheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { FlatList, Image, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Message = {
    id: number;
    sender: "me" | "them";
    text: string;
};

const initialMessages: Message[] = [
    { id: 1, sender: "them", text: "How much? for that shit" },
    { id: 2, sender: "me", text: "I already told you" },
    { id: 3, sender: "them", text: "Seriously though, what's the price?" },
    { id: 4, sender: "me", text: "It's K5,000 bro" },
    { id: 5, sender: "them", text: "That's expensive" },
    { id: 6, sender: "me", text: "It's brand new, barely used" },
    { id: 7, sender: "them", text: "Can you go lower?" },
    { id: 8, sender: "me", text: "Not really, it's a fair price" },
    { id: 9, sender: "them", text: "What about K4,500?" },
    { id: 10, sender: "me", text: "K4,800 final offer" },
];

export default function ChatScreen() {
    // `id` is the conversation id from the route; used later to fetch messages.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id } = useLocalSearchParams<{ id: string }>();
    const { colors } = useTheme();
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [text, setText] = useState("");
    const listRef = useRef<FlatList<Message>>(null);
    const nextId = useRef(messages.length + 1);

    const sendMessage = () => {
        const trimmed = text.trim();
        if (!trimmed) return;

        setMessages(prev => [...prev, { id: nextId.current++, sender: "me", text: trimmed }]);
        setText("");
    };

    const renderMessage = ({ item }: { item: Message }) => {
        const isMe = item.sender === "me";
        return (
            <View
                style={[
                    styles.messageBox,
                    {
                        backgroundColor: isMe ? colors.accent : colors.placeholder,
                        maxWidth: "80%",
                        alignSelf: isMe ? "flex-end" : "flex-start",
                        marginLeft: isMe ? "auto" : 10,
                        marginRight: isMe ? 10 : "auto",
                    },
                ]}
            >
                <ThemedText darkColor="white">{item.text}</ThemedText>
            </View>
        );
    };

    return (
        <SafeAreaView
            style={{ flex: 1, flexDirection: "column", backgroundColor: colors.background }}>
            <View style={[styles.topBar, { paddingBottom: 10 }]}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <MaterialIcons name="chevron-left" size={30} color={colors.accent} />
                </Pressable>
                <View style={{ justifyContent: "space-evenly" }}>
                    <Image
                        source={require("../../assets/images/pfp.jpg")}
                        style={[styles.profile, { marginRight: 10 }]}
                    />
                </View>
                <ThemedText type="subtitle">DealsHunter</ThemedText>
            </View>

            <FlatList
                ref={listRef}
                data={messages}
                inverted={true}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderMessage}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={10}>
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
        </SafeAreaView>
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
        margin: 12,
        padding: 8,
        borderRadius: 20,
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
