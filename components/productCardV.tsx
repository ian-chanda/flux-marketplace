import { router } from "expo-router"
import { Image, StyleSheet, TouchableOpacity, View } from "react-native"
import { BookmarkBadge } from "./bookmark-badge"
import { ThemedText } from "./themed-text"

type prodCardTypes = {
	id: number,
	bookmarked: boolean,
	img?: any,
	desc: string,
	name: string,
	price: string,}

export const ProductCardV = ({ id, bookmarked, desc, name, price }: prodCardTypes) => {
	return (
		<TouchableOpacity style={styles.product_card} onPress={()=> router.push(`/product/${id}`)}>
			<View>
				<BookmarkBadge
					bookmarked={bookmarked}
					onPress={() => () => { }}
				/>
				<Image
					source={require('@/assets/images/dino.jpg')}
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

	},
	image: {
		width: '100%',
		height: 150,
		borderRadius: 8,
	},

})
