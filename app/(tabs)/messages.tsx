import { CustomHeader } from "@/components/customHeader";
import { CustomSearchBar } from "@/components/customSearchBar";
import { IconButton } from "@/components/iconButton";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { TopBar } from "@/components/topBar";
import { useTheme } from "@/hooks/useTheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Tables } from "@/types/database.types";
import { ActivityIndicator, FlatList, Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useChannels } from "@/hooks/use-channels";
import { getTime, getTimePast } from "@/utils/time-past";
import { Avatar } from "@kolking/react-native-avatar";
import { useAuth } from "@/contexts/auth-context";
import { SmallIconButton } from "@/components/small-iconButton";
import { Ionicons } from "@expo/vector-icons";
import { LoadingScreen } from "./(search)/results";
import { ChannelItem, ChannelRow } from "@/components/channelRow";
import { useSearchMessages } from "@/hooks/use-search-messages";
import { SearchView } from "@/components/searchView";

type Channels = Tables<"channels">

type TABS = "all" | "my listings" | "sellers"
const horizontalTabs: { id: string, tab: TABS }[] = [
    { id: "all", tab: "all" },
    { id: "my_listings", tab: "my listings" },
    { id: "sellers", tab: "sellers" },
]

export default function Messages() {
    const { colors } = useTheme();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [currentTab, setCurrentTab] = useState<TABS>("all")
    const { user } = useAuth()
    const { data, loading } = useChannels()

    const channels = currentTab === "my listings" ? data?.filter(m => m.listings?.user_id === user?.id) :
        currentTab === "sellers" ? data?.filter(m => m.listings?.id && m.listings?.user_id !== user?.id) : data

    return (
        <ThemedView isTabVisible>
            {isSearchOpen ?
                <SearchView onClose={() => setIsSearchOpen(false)} />
                :
                <View style={{ flex: 1, gap: 0 }}>
                    <CustomHeader title="Messages">
                        <IconButton icon={"search"} onPress={() => setIsSearchOpen(true)} badgeValue="" />
                    </CustomHeader>
                    <FlatList
                        data={horizontalTabs}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        decelerationRate="fast"
                        style={{ flexGrow: 0 }}
                        contentContainerStyle={{ padding: 5, gap: 10 }}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => <SmallIconButton
                            title={item.tab}
                            isSelected={currentTab === item.tab}
                            onPress={() => setCurrentTab(item.tab)}
                        />
                        }
                    />
                    {loading
                        ?
                        <LoadingScreen />
                        :
                        channels && channels?.length <= 0 ?
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <ThemedText type="defaultFaded">nothing to see here</ThemedText>
                            </View>
                            :

                            <FlatList
                                data={channels}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => <ChannelRow item={item} />} />
                    }

                </View>
            }
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    itemContainer: {
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
    sender: {
        flex: 1,
    },
    messageRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    lastMessage: {
        flex: 1,
    },
})
