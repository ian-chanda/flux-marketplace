import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/useTheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { FlatList, Image, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const messages = [
    {id: 1, in: "How much? for that shit", out: "I already told you"},
    {id: 2, in: "Seriously though, what's the price?", out: "It's K5,000 bro"},
    {id: 3, in: "That's expensive", out: "It's brand new, barely used"},
    {id: 4, in: "Can you go lower?", out: "Not really, it's a fair price"},
    {id: 5, in: "What about K4,500?", out: "K4,800 final offer"},
    {id: 6, in: "Deal! When can we meet?", out: "Tomorrow afternoon work?"},
    {id: 7, in: "Yeah, where?", out: "Lusaka City shopping mall?"},
    {id: 8, in: "Perfect, see you there", out: "Great! See you then"},
    {id: 9, in: "Just confirming, 2pm?", out: "Yes, 2pm at the mall"},
    {id: 10, in: "Awesome, I'm excited", out: "Me too!"},
]

export default function ChatScreen() {
    const { id } = useLocalSearchParams();
    const { colors } = useTheme();
    const [Number, onChangeNumber] = useState('');


    return (
        <SafeAreaView
        style={{flex: 1, flexDirection: "column", backgroundColor: colors.background}}>
        <View style={[styles.topBar, {paddingBottom: 10}]}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="chevron-left" size={30} color={colors.accent} />
        </Pressable>
        <View style={{justifyContent: "space-evenly"}}>
            <Image
            source={require("../../assets/images/pfp.jpg")} style={[styles.profile, {marginRight: 10}]}/>
        </View>
        <ThemedText type="subtitle">DealsHunter</ThemedText>
        </View>
        <FlatList
        data={ messages }
        inverted={true}
        renderItem={({ item }) => (
            <View style={{}}>
                <View
                style={[styles.messageBox, {
                backgroundColor: colors.placeholder,
                maxWidth: "80%",
                alignSelf: "flex-start",
                marginLeft: 10,
                marginRight: "auto"}]}>
                <ThemedText numberOfLines={5} darkColor="white">{item.in}</ThemedText>
            </View>
                <View
                style={[styles.messageBox, {
                backgroundColor: colors.accent,
                maxWidth: "80%",
                alignSelf: "flex-end",
                marginLeft: "auto",
                marginRight: 10
      }]}>
                <ThemedText numberOfLines={5} darkColor="white">{item.out}</ThemedText>
            </View>
            </View>
        )}/>
        <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={10}>
                <View>
                    <View>
                        <View style={styles.topBar}>
                        <View style={[styles.search_container, { backgroundColor: colors.surface }]}>
                            <TextInput
                                style={[styles.input, { color: colors.text, backgroundColor: colors.surface}]}
                                multiline={true}
                                onChangeText={onChangeNumber}
                                value={Number}
                                placeholderTextColor={colors.placeholder}
                                keyboardType="default"
                                placeholder="Message.."
                            />
                            <Pressable
                            onPress={()=>alert("add media")}>
                                <MaterialIcons name="add" size={24} color={colors.accent} />
                            </Pressable>
                        </View>
                        <View style={styles.cart}>
                            <Pressable onPress={() => alert("message sent")}>
                                <MaterialIcons name="send" size={33} color={colors.accent} />
                            </Pressable>
                        </View>
                    </View>
                    </View>
                </View>
        </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    topBar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

      cart: {
        alignItems: "flex-start",
        marginBottom: 2,
        marginRight: 20
    },

  backButton: {
    flex: 1,
    position: "absolute",
    left: 10,
  },

  profile: {
    width: 40,
    height: 40,
    borderRadius: 50
  },
  messageBox: {
    paddingLeft: 10,
    paddingRight: 10,
    margin: 12,
    padding: 8,
    borderRadius: 20,
    maxWidth: "80%"
  },

    TopBar: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 15,
        paddingHorizontal: 15,
        paddingVertical: 15,
    },
    search_container: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'center',
        borderRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 6,
        marginHorizontal: 30,
        marginLeft: 30
    },
        input: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 12,
        alignItems: 'center',
        width: "100%",
        borderRadius: 20,
    },
})
