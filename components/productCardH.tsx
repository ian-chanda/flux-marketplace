import { useTheme } from "@/hooks/useTheme"
import { getTimePast } from "@/utils/time-past"
import { MaterialIcons } from "@expo/vector-icons"
import { router } from "expo-router"
import { Image, StyleSheet, TouchableOpacity, View } from "react-native"
import { BookmarkBadge } from "./bookmark-badge"
import { IconButton } from "./iconButton"
import { ThemedText } from "./themed-text"

type prodCardTypes = {
	id: string,
	bookmarked: boolean,
	showMore?: boolean,
	img?: any,
	desc: string,
	name?: string,
	condition?: string,
	price: number,
	delivery?: string,        // free-text override, e.g. "free delivery in Lusaka"

	// new, all optional so existing usages keep working
	location?: string | null,
	postedAt?: string,        // ISO date, shown as "2d" etc.
	specs?: string,           // e.g. attributesToString(listing.attributes)
	deliveryAvailable?: boolean,
	pickupAvailable?: boolean,
	available?: boolean,      // false shows a "Sold" tag on the photo
	sellerName?: string | null,
	sellerVerified?: boolean,
	onBookmark?: () => void,
}

const Tag = ({ icon, label }: { icon: keyof typeof MaterialIcons.glyphMap, label: string }) => {
	const { colors } = useTheme()
	return (
		<View style={[styles.tag, { backgroundColor: colors.surface }]}>
			<MaterialIcons name={icon} size={12} color={colors.accent} />
			<ThemedText type='smallFaded'>{label}</ThemedText>
		</View>
	)
}

export const ProductCardH = ({
	id, img, bookmarked, desc, condition, name, price, delivery,
	location, postedAt, specs, deliveryAvailable, pickupAvailable,
	available = true, sellerName, sellerVerified, onBookmark,
	showMore = false,
}: prodCardTypes) => {
	const { colors } = useTheme()

	const hasFulfilment = deliveryAvailable || pickupAvailable
	const metaLabel = condition ? condition : name

	return (
		<TouchableOpacity
			style={styles.card}
			onPress={() => router.push(`/product/${id}`)}
		>
			<View>
				<BookmarkBadge
					bookmarked={bookmarked}
					onPress={onBookmark ?? (() => { })}
				/>
				{img ? (
					<Image
						source={{ uri: img }}
						style={[styles.image, !available && { opacity: 0.5 }]}
					/>
				) : (
					<View style={[styles.image, styles.noImage, { backgroundColor: colors.surface }]}>
						<MaterialIcons name="image" size={32} color={colors.placeholder} />
					</View>
				)}
				{!available && (
					<View style={styles.soldTag}>
						<ThemedText type='smallBold' style={{ color: 'white' }}>Sold</ThemedText>
					</View>
				)}
			</View>

			<View style={{ flex: 1, gap: 2 }}>
				{/* condition on the left, posted time on the right */}
				<View style={styles.topRow}>
					<ThemedText type='smallFaded' numberOfLines={1} style={{ flexShrink: 1 }}>
						{metaLabel}
					</ThemedText>
					{postedAt && (
						<ThemedText type='smallFaded'>{getTimePast(postedAt)}</ThemedText>
					)}
				</View>

				<ThemedText type='mediumBold' numberOfLines={2} ellipsizeMode='tail'>
					{desc}
				</ThemedText>

				{specs ? (
					<ThemedText type='smallFaded' numberOfLines={1}>{specs}</ThemedText>
				) : null}

				<ThemedText type='largeBold'>K{price.toLocaleString()}</ThemedText>

				{location ? (
					<View style={styles.iconRow}>
						<MaterialIcons name="place" size={14} color={colors.placeholder} />
						<ThemedText type='smallFaded' numberOfLines={1} style={{ flexShrink: 1 }}>
							{location}
						</ThemedText>
					</View>
				) : null}

				{/* how the buyer can get it */}
				<View style={[styles.tags, showMore && { paddingRight: 80 }]}>
					{hasFulfilment ? (
						<>
							{deliveryAvailable && <Tag icon="directions-car" label="Delivery" />}
							{pickupAvailable && <Tag icon="directions-walk" label="Pickup" />}
						</>
					) : (
						<ThemedText type='mediumFaded'>
							{delivery ? delivery : "contact for delivery"}
						</ThemedText>
					)}
				</View>

				{sellerName ? (
					<View style={styles.iconRow}>
						<ThemedText type='smallFaded' numberOfLines={1} style={{ flexShrink: 1 }}>
							{sellerName}
						</ThemedText>
						{sellerVerified && (
							<MaterialIcons name="verified" size={14} color={colors.accent} />
						)}
					</View>
				) : null}

				{showMore &&
					<View style={styles.actions}>
						<IconButton icon={"delete"} onPress={() => { }} badgeValue='' />
						<IconButton icon={"more-vert"} onPress={() => { }} badgeValue='' />
					</View>
				}
			</View>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	card: {
		flexDirection: 'row',
		gap: 10,
	},
	image: {
		borderRadius: 12,
		width: 130,
		height: 130,
	},
	noImage: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	soldTag: {
		position: 'absolute',
		left: 6,
		bottom: 6,
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 6,
		backgroundColor: 'rgba(0,0,0,0.7)',
	},
	topRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: 8,
	},
	iconRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 2,
	},
	tags: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		alignItems: 'center',
		gap: 6,
		marginTop: 2,
	},
	tag: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 3,
		paddingHorizontal: 8,
		paddingVertical: 3,
		borderRadius: 50,
	},
	actions: {
		flexDirection: 'row',
		position: 'absolute',
		right: 0,
		bottom: 0,
	},
})
