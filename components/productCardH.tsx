import { Image, TouchableOpacity, View } from "react-native"
import { BookmarkBadge } from "./bookmark-badge"
import { ThemedText } from "./themed-text"
import { IconButton } from "./iconButton"
import { router } from "expo-router"


type prodCardTypes = {
	id?: string,
	bookmarked: boolean,
	showMore?: boolean,
	img?: string | null,
	desc: string,
	name: string,
	price: string
	delivery?: string
}

export const ProductCardH = ({ id, bookmarked, desc, name, price, delivery, showMore=false, img }: prodCardTypes) => {
	return (
		<TouchableOpacity style={{ flexDirection: 'row', gap: 10 }} onPress={id ? () => router.push(`/product/${id}`) : undefined}>
			<View>
				<BookmarkBadge
					bookmarked={bookmarked}
					onPress={() => { }}
				/>
				<Image
					source={img ? { uri: img } : require('@/assets/images/dino.jpg')}
					style={{ borderRadius: 12, width: 130, height: 130 }}
				/>
			</View>

			<View style={{ flex: 1 }}>
				{showMore &&
					<View style={{ flexDirection: 'row', position: 'absolute', right: 0, bottom: 0 }}>
						<IconButton icon={"delete"} onPress={() => { }} badgeValue='' />
						<IconButton icon={"more-vert"} onPress={() => { }} badgeValue='' />
					</View>
				}
				<ThemedText type='smallFaded'>{desc}</ThemedText>
				<ThemedText type='mediumBold' ellipsizeMode='tail'>
					{name}
				</ThemedText>
				<ThemedText type='largeBold'>{price}</ThemedText>
				<ThemedText type='mediumFaded'>{delivery ? delivery : "contact for delivery"}</ThemedText>
			</View>

		</TouchableOpacity>

	)
}
