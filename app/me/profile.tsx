import { CustomHeader } from "@/components/customHeader"
import { IconButton } from "@/components/iconButton"
import { ThemedText } from "@/components/themed-text"
import { ThemedView } from "@/components/themed-view"
import { useAuth } from "@/contexts/auth-context"
import { useUser } from "@/hooks/use-user"
import { useTheme } from "@/hooks/useTheme"
import { supabase } from "@/lib/supabase"
import { MaterialIcons } from "@expo/vector-icons"
import { router } from "expo-router"
import { useEffect, useState } from "react"
import { TouchableOpacity } from "react-native"
import { Image, ScrollView, View } from "react-native"


const ProfileTabs = ['About'] as const
type ProfileTab = typeof ProfileTabs[number]

export default function ProfileScreen() {
	const { colors } = useTheme()
	const [selectedTab, setSelectedTab] = useState<ProfileTab>('About')
	const { userData, loading: isLoading } = useUser()


	const avatar = userData?.avatar_url ?? ""
	const header = userData?.header_url ?? ""
	const name = userData?.name ?? "unknown unknown";
	const username = userData?.username ?? "unknown123";
	const contact = userData?.phone_number ?? "090000001";
	const date = userData?.created_at ? new Date(userData?.created_at).toLocaleDateString("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
	}) : "00 jan 0000";


	return (
		<ThemedView isTabVisible={false} style={{ paddingHorizontal: 10, gap: 10 }}>
			<CustomHeader showBack title="Profile" />

			<View style={{ paddingTop: 10, marginBottom: 50 }}>
				{/* header image */}
				<Image
					source={header
						? { uri: `${header}?v=${userData?.updated_at}` }
						: require('@/assets/images/dino.jpg')}
					style={{
						width: '100%',
						height: 150,
						objectFit: 'cover',
						borderRadius: 12
					}}
				/>
				{/* profile image */}
				<View style={{ position: 'absolute', bottom: -30, left: 15 }}>
					<Image
						source={avatar
							? { uri: `${avatar}?v=${userData?.updated_at}` }
							: require('@/assets/images/dino.jpg')}
						style={{
							width: 120,
							height: 120,
							borderRadius: 100,
							borderWidth: 4,
							borderColor: colors.background
						}}
					/>
				</View>
			</View>

			<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
				<View>
					<View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
						<ThemedText type='largeBold'>{name}</ThemedText>
						<MaterialIcons name='verified' color={colors.text} size={15} />
					</View>
					<ThemedText type='smallFaded'>@{username}</ThemedText>
				</View>

				<IconButton icon={'edit'} onPress={() => router.push('/editProfile')} badgeValue="" />
			</View>
			<ThemedText type='mediumFaded'>the users bio can go here easy peasy </ThemedText>

			<ScrollView horizontal
				style={{
					flexGrow: 0,
					flexShrink: 0,
					maxHeight: 40,
				}}
				contentContainerStyle={{
					gap: 10,
					alignItems: 'center',
				}}
			>
				{ProfileTabs.map((item, index) => (
					<TouchableOpacity
						style={{
							paddingBottom: 8,
							borderColor: colors.accent,
							borderBottomWidth: selectedTab === item ? 2 : 0,
							alignItems: 'center',
							justifyContent: 'center'
						}}
						key={index}
						onPress={() => setSelectedTab(item)}
					>
						<ThemedText>{item}</ThemedText>
					</TouchableOpacity>
				))}
			</ScrollView>
			<ScrollView
				style={{ flex: 1 }}
				contentContainerStyle={{ gap: 10, paddingBottom: 100 }}
				showsVerticalScrollIndicator={false}
			>
				{selectedTab === 'About' && (
					<View style={{ gap: 5 }}>
						<View style={{ flexDirection: 'row', gap: 5 }}>
							<ThemedText type="defaultFaded">Location:</ThemedText>
							<ThemedText type="default">Lusaka, Zambia</ThemedText>
						</View>
						<View style={{ flexDirection: 'row', gap: 5 }}>
							<ThemedText type="defaultFaded">Contact: </ThemedText>
							<ThemedText type="default">{contact}</ThemedText>
						</View>
						<View style={{ flexDirection: 'row', gap: 5 }}>
							<ThemedText type="defaultFaded">Member Since:</ThemedText>
							<ThemedText type="default">{date}</ThemedText>
						</View>
					</View>
				)}

			</ScrollView>

		</ThemedView>
	)
}
