import { CardButtonRow } from "@/components/cardButtonRow"
import { CustomHeader } from "@/components/customHeader"
import { SettingsSection } from "@/components/settingsSection"
import { ThemedText } from "@/components/themed-text"
import { ThemedView } from "@/components/themed-view"
import { DarkModeToggle } from "@/components/toggleButton"
import { useAuth } from "@/contexts/auth-context"
import { useUser } from "@/hooks/use-user"
import { useTheme } from "@/hooks/useTheme"
import { supabase } from "@/lib/supabase"
import { deleteAccount } from "@/services/users"
import { handleGetVerified } from "@/utils/handle-verification-route"
import { MaterialIcons } from "@expo/vector-icons"
import { router } from "expo-router"
import { useState } from "react"
import { ActivityIndicator, Modal, ScrollView, TouchableOpacity, View } from "react-native"


const DeleteAccountModal = ({
	isOpen, setIsOpen, onPress, loading }
	: {
		isOpen: boolean,
		setIsOpen: (e: boolean) => void,
		onPress: () => void,
		loading: boolean
	}) => {

	const { colors } = useTheme()
	return (
		<Modal
			visible={isOpen}
			transparent
			animationType="fade"
			onRequestClose={() => {
				if (loading)
					return
				else
					setIsOpen(false)
			}
			}
		>
			<TouchableOpacity
				activeOpacity={1}
				onPress={() => {
					if (loading)
						return
					else
						setIsOpen(false)
				}
				} // tap backdrop to dismiss
				style={{
					flex: 1,
					backgroundColor: 'rgba(0,0,0,0.8)',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<TouchableOpacity activeOpacity={1} style={{
					width: '80%',
					backgroundColor: colors.surface,
					borderRadius: 8,
					paddingHorizontal: 10,
					paddingVertical: 10,
				}}>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
						<ThemedText type="defaultFaded">Delete Account</ThemedText>

						<TouchableOpacity
							disabled={loading}
							onPress={() => setIsOpen(false)}
							hitSlop={10}
						>
							<MaterialIcons name="close" size={24} />
						</TouchableOpacity>
					</View>
					<View style={{ flexDirection: 'row', paddingVertical: 10 }}>
						<ThemedText>Are you sure chief?</ThemedText>
					</View>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
						<TouchableOpacity
							disabled={loading}
							onPress={() => onPress()}
							style={{ width: '48%', paddingHorizontal: 4, paddingVertical: 6, backgroundColor: colors.primary, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
							{loading ?
								<ActivityIndicator size={18} color={colors.surface} />
								:
								<ThemedText style={{ color: colors.surface}}>Delete Account</ThemedText>
							}
						</TouchableOpacity>

						<TouchableOpacity
							disabled={loading}
							onPress={() => setIsOpen(false)}
							style={{ width: '48%', paddingHorizontal: 4, paddingVertical: 6, backgroundColor: colors.primary, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
							<ThemedText style={{ color: colors.background }}>Cancel</ThemedText>
						</TouchableOpacity>
					</View>


				</TouchableOpacity>
			</TouchableOpacity>

		</Modal>
	)

}

export default function SettingsScreen() {
	const [isDeleting, setIsDeleting] = useState(false)
	const [deleteModalOpen, setDeleteModalOpen] = useState(false)
	const { colors, context } = useTheme()
	const isDark = context?.theme === "dark"
	const { userData } = useUser()
	const { signOut } = useAuth()


	const handleDeleteAccount = async () => {
		try {
			setIsDeleting(true)

			await deleteAccount()
			await signOut()

			router.replace('/auth/login')
		} catch (error: any) {
			console.error('error deleting account::', error.message)
		} finally {
			setIsDeleting(false)
		}
	}

	return (
		<ThemedView isTabVisible={false} style={{ paddingHorizontal: 10, gap: 10 }}>
			<CustomHeader showBack title="Settings" />

			{/* modal thing */}
			<DeleteAccountModal
				loading={isDeleting}
				isOpen={deleteModalOpen}
				setIsOpen={setDeleteModalOpen}
				onPress={() => handleDeleteAccount()}
			/>

			<ScrollView
				contentContainerStyle={{ gap: 10, paddingBottom: 100 }}
				showsVerticalScrollIndicator={false}
			>
				<SettingsSection title="Account">
					<CardButtonRow
						label="Delivery address"
						onPress={() => router.push('/settings/address/deliveryAddress')}
					/>
					<CardButtonRow
						label="Change password"
						onPress={() => router.push('/settings/changePassword')}
					/>
					<CardButtonRow
						label="Verification"
						desc={userData?.is_verified ? "verified" : "unverified"}
						onPress={() => handleGetVerified(userData?.verification?.status ?? "unsubmitted", "/me/settings")}
					/>
				</SettingsSection>

				<SettingsSection title="Notifications">
					<CardButtonRow
						label="Push notifications"
						onPress={() => { }}
					/>
				</SettingsSection>

				<SettingsSection title="General">
					<CardButtonRow
						icon={isDark ? "dark-mode" : "light-mode"}
						label={isDark ? "Dark mode" : "Light mode"}
						right={<DarkModeToggle />}
					/>
				</SettingsSection>

				<SettingsSection title="Support">
					<CardButtonRow
						label="Help center"
						onPress={() => router.push("/settings/help")}
					/>
					<CardButtonRow
						label="Report a problem"
						onPress={() => router.push("/settings/report")}
					/>
				</SettingsSection>

				<SettingsSection title="About">
					<CardButtonRow
						label="Terms of service"
						onPress={() => router.push("/settings/terms")}
					/>
					<CardButtonRow
						label="Privacy policy"
						onPress={() => router.push("/settings/privacyPolicy")}
					/>
					<CardButtonRow
						label="App version"
						right={<ThemedText type="smallFaded">1.0.0</ThemedText>}
					/>
				</SettingsSection>

				<CardButtonRow
					icon="delete-outline"
					label="Delete account"
					destructive
					onPress={() => setDeleteModalOpen(true)}
				/>
			</ScrollView>
		</ThemedView>
	)
}


