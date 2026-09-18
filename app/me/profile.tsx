import { CustomHeader } from "@/components/customHeader"
import { HeaderImage } from "@/components/header-image"
import { IconButton } from "@/components/iconButton"
import { PfpItem } from "@/components/pfp-item"
import { ProfileSkeleton } from "@/components/skeletons/profileSkeleton"
import { ThemedText } from "@/components/themed-text"
import { ThemedView } from "@/components/themed-view"
import { VerifiedBadge } from "@/components/verified-badge"
import { useAuth } from "@/contexts/auth-context"
import { useUser } from "@/hooks/use-user"
import { useTheme } from "@/hooks/useTheme"
import { supabase } from "@/lib/supabase"
import { handleGetVerified } from "@/utils/handle-verification-route"
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
	const firstName = userData?.first_name ?? "unknown";
	const lastName = userData?.last_name ?? "unknown";
	const bio = userData?.bio ?? "";
	const username = userData?.username ?? "unknown123";
	const contact = userData?.phone_number?.trim() ? userData.phone_number : "n/a"
	const location = `${userData?.location_city ?? "unknown"}, ${userData?.location_country ?? "unknown"}`
	const date = userData?.created_at ? new Date(userData?.created_at).toLocaleDateString("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
	}) : "00 jan 0000";

	if (isLoading) {
		return (
			<ThemedView isTabVisible={false} style={{ gap: 10 }}>
				<CustomHeader showBack title="Profile" />
				<View style={{ paddingTop: 10, marginBottom: 50 }}>

					<ProfileSkeleton />
				</View>
			</ThemedView>
		)
	}

	return (
		<ThemedView isTabVisible={false} style={{ gap: 10 }}>
			<CustomHeader showBack title="Profile" />

			<View style={{ flex: 1, paddingHorizontal: 10 }}>

				<View style={{ paddingTop: 10, marginBottom: 50 }}>
					{/* header image */}
					<HeaderImage source={header ? `${header}?v=${userData?.updated_at}` : ""} />
					{/* profile image */}
					<View style={{ position: 'absolute', bottom: -30, left: 15 }}>
						<PfpItem
							image={`${avatar}?v=${userData?.updated_at}`}
							name={`${firstName} ${lastName}`}
							size="medium"
						/>
					</View>
				</View>

				<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
					<View>
						<View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
							<ThemedText type='largeBold'>{firstName} {lastName}</ThemedText>
							{userData?.is_verified ?
								<VerifiedBadge />
								:
								<TouchableOpacity
									onPress={() => handleGetVerified(userData?.verification?.status ?? "unsubmitted", "/me/profile")}
									style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
									<VerifiedBadge />
									<ThemedText type='link'>Get Verified!</ThemedText>
								</TouchableOpacity>
							}
						</View>
						<ThemedText type='smallFaded'>@{username}</ThemedText>
					</View>

					<IconButton icon={'edit'} onPress={() => router.push('/editProfile')} badgeValue="" />
				</View>
				<ThemedText type='mediumFaded'>{bio}</ThemedText>

				<ThemedText type="defaultFaded" style={{ marginTop: 10, marginBottom: 6 }}>
					About
				</ThemedText>
				<View style={{
					backgroundColor: colors.surface, 
					borderRadius: 12,
					padding: 14,
					gap: 10,
				}}>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
						<ThemedText type="defaultFaded">Location</ThemedText>
						<ThemedText type="default">{location}</ThemedText>
					</View>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
						<ThemedText type="defaultFaded">Contact</ThemedText>
						<ThemedText type="default">{contact}</ThemedText>
					</View>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
						<ThemedText type="defaultFaded">Member Since</ThemedText>
						<ThemedText type="default">{date}</ThemedText>
					</View>
				</View>
			</View>

		</ThemedView>
	)
}
