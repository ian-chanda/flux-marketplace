import { CustomHeader } from "@/components/customHeader"
import { IconButton } from "@/components/iconButton"
import { ThemedText } from "@/components/themed-text"
import { ThemedView } from "@/components/themed-view"
import { useTheme } from "@/hooks/useTheme"
import { MaterialIcons } from "@expo/vector-icons"
import { router } from "expo-router"
import { useState } from "react"
import { TouchableOpacity } from "react-native"
import { Image, ScrollView, View } from "react-native"


const FeedbackMessage = ({ img, name, when, msg, feedbackType }:
	{ img?: string, name: string, when: string, msg: string, feedbackType: string }) => {
	return (
		<View>
			<View style={{ gap: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
				<View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
					<View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
						<Image
							source={require('@/assets/images/dino.jpg')}
							style={{
								width: 20,
								height: 20,
								objectFit: 'cover',
								borderRadius: 100
							}}
						/>
						<ThemedText type="smallFaded">{name}</ThemedText>
					</View>
					<ThemedText type="smallFaded">-</ThemedText>
					<ThemedText type="smallFaded">{when}</ThemedText>
				</View>
				<ThemedText type="smallFaded">{feedbackType}</ThemedText>
			</View>
			<ThemedText>{msg}</ThemedText>
		</View>
	)
}

const feedbackMessages = [
	{
		name: "Admin Admin",
		when: "2y",
		feedbackType: "purchase",
		msg: "omg this guy funcking SUCKS! he tried to low ball me so much. he even ran off at some point and we had to chase him down"
	},
	{
		name: "Sarah Chen",
		when: "3d",
		feedbackType: "sale",
		msg: "Super smooth transaction, paid instantly and picked up right on time. Would sell to again!"
	},
	{
		name: "Marcus Webb",
		when: "1w",
		feedbackType: "purchase",
		msg: "Item was exactly as described, great communication throughout. Highly recommend."
	},
	{
		name: "Jenna Ortiz",
		when: "2w",
		feedbackType: "sale",
		msg: "Buyer was a bit slow to respond but everything worked out fine in the end."
	},
	{
		name: "Deshawn Miller",
		when: "1mo",
		feedbackType: "purchase",
		msg: "Packaging could've been better but the product itself was in great shape."
	},
	{
		name: "Olivia Park",
		when: "3mo",
		feedbackType: "sale",
		msg: "Quick payment, no hassle. One of the easier deals I've had on here."
	},
	{
		name: "Tariq Hassan",
		when: "5mo",
		feedbackType: "purchase",
		msg: "Took a while to arrange pickup but seller was patient and friendly about it."
	},
	{
		name: "Emily Novak",
		when: "8mo",
		feedbackType: "sale",
		msg: "Avoid this man at all costs. showed up late and tried to renegotiate price at the last second."
	},
	{
		name: "Ryan Kessler",
		when: "1y",
		feedbackType: "purchase",
		msg: "Great experience, item was even better than the photos showed."
	}
]

const ProfileTabs = ['About', 'Feedback'] as const
type ProfileTab = typeof ProfileTabs[number]

export default function ProfileScreen() {
	const { colors } = useTheme()
	const [selectedTab, setSelectedTab] = useState<ProfileTab>('About')
	return (
		<ThemedView isTabVisible={false} style={{ paddingHorizontal: 10, gap: 10 }}>
			<CustomHeader showBack title="Profile" />

			<View style={{ paddingTop: 10, marginBottom: 50 }}>
				{/* header image */}
				<Image
					source={require('@/assets/images/dino.jpg')}
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
						source={require('@/assets/images/dino.jpg')}
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
						<ThemedText type='largeBold'>Admin Admin</ThemedText>
						<MaterialIcons name='verified' color={colors.text} size={15} />
					</View>
					<ThemedText type='smallFaded'>@admin9003</ThemedText>
				</View>

				<IconButton icon={'edit'} onPress={() => router.push('/editProfile')} badgeValue="" />
			</View>

			<View style={{
				flexDirection: 'row',
				width: '100%',
				borderRadius: 12,
				backgroundColor: colors.surface,
				paddingVertical: 10,
				paddingHorizontal: 10,
				alignItems: 'center',
				justifyContent: 'space-evenly',
				marginBottom: 10,

			}}>
				<View>
					<ThemedText type="medium">Response Time</ThemedText>
					<ThemedText type="mediumFaded">~3yrs</ThemedText>
				</View>
				<View style={{ height: '80%', width: 1, backgroundColor: colors.accent }} />
				<View>
					<ThemedText type="medium">Successful Sales</ThemedText>
					<ThemedText type="mediumFaded">0</ThemedText>
				</View>
				<View style={{ height: '80%', width: 1, backgroundColor: colors.accent }} />
				<View>
					<ThemedText type="medium">Rating</ThemedText>
					<ThemedText type="mediumFaded">1.5</ThemedText>
				</View>
			</View>

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
					<View style={{gap: 5}}>
						<View style={{ flexDirection: 'row', gap: 5 }}>
							<ThemedText type="defaultFaded">Location:</ThemedText>
							<ThemedText type="default">Lusaka, Zambia</ThemedText>
						</View>
						<View style={{ flexDirection: 'row', gap: 5 }}>
							<ThemedText type="defaultFaded">Contact: </ThemedText>
							<ThemedText type="default">0764569576</ThemedText>
						</View>
						<View style={{ flexDirection: 'row', gap: 5 }}>
							<ThemedText type="defaultFaded">Member Since:</ThemedText>
							<ThemedText type="default">14 Aug, 2026</ThemedText>
						</View>
					</View>
				)}

				{selectedTab === 'Feedback' && (
					<View style={{ gap: 5 }}>
						<ThemedText type="subtitle">Ratings</ThemedText>
						<View style={{ marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
							<View style={{ flexDirection: 'column', }}>
								<ThemedText>Positive</ThemedText>
								<ThemedText type="defaultBold">0</ThemedText>
							</View>
							<View style={{ flexDirection: 'column', }}>
								<ThemedText>Neutral</ThemedText>
								<ThemedText type="defaultBold">0</ThemedText>
							</View>
							<View style={{ flexDirection: 'column', }}>
								<ThemedText>Negative</ThemedText>
								<ThemedText type="defaultBold">20</ThemedText>
							</View>
						</View>
						<ThemedText type="subtitle">All Feedback</ThemedText>

						{feedbackMessages.map((item, index) => (
							<View key={index}
								style={{
									paddingVertical: 10,
									borderBottomColor: colors.disabled,
									borderBottomWidth: 1
								}}>
								<FeedbackMessage
									name={item.name}
									when={item.when}
									feedbackType={item.feedbackType}
									msg={item.msg}
								/>
							</View>

						))}
					</View>
				)}
			</ScrollView>

		</ThemedView>
	)
}
