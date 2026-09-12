import { router } from "expo-router"
import { Image, StyleSheet, TouchableOpacity, View } from "react-native"
import { BookmarkBadge } from "./bookmark-badge"
import { ThemedText } from "./themed-text"

type prodCardTypes = {
	id: string,
	bookmarked: boolean,
	img?: string,
	desc: string,
	name: string,
	price: string,
	onBookmark?: () => void,
}

export const ProductCardV = ({ id, bookmarked, img, desc, name, price, onBookmark }: prodCardTypes) => {
	return (
		<TouchableOpacity style={styles.product_card} onPress={() => router.push(`/product/${id}`)}>
			<View>
				<BookmarkBadge
					bookmarked={bookmarked}
					onPress={() => onBookmark?.()}
				/>
				<Image
					source={img ? { uri: img } : require('@/assets/images/dino.jpg')}
					style={styles.image}
					resizeMode="cover"
				/>
			</View>

			<ThemedText type="smallFaded">{desc}</ThemedText>
			<ThemedText type="defaultBold" numberOfLines={1}>{name}</ThemedText>
			<ThemedText type="mediumBold">{price}</ThemedText>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	product_card: {
		width: '45%',
		borderRadius: 8,
		flex: 1,
	},
	image: {
		width: '100%',
		height: 150,
		borderRadius: 8,
	},
})