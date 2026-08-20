import { TouchableOpacity, View } from "react-native"
import { BookmarkBadge } from "./bookmark-badge"
import { Image } from "react-native"
import { ThemedText } from "./themed-text"
import { MaterialIcons } from "@expo/vector-icons"
import { IconButton } from "./iconButton"
import { SmallIconButton } from "./small-iconButton"


type prodCardTypes = {
	bookmarked: boolean,
	showMore?: boolean,
	img?: any,
	desc: string,
	name: string,
	price: string
	delivery?: string
}

export const ProductCardH = ({ bookmarked, desc, name, price, delivery, showMore=false }: prodCardTypes) => {
	return (
		<TouchableOpacity style={{ flexDirection: 'row', gap: 10 }}>
			<View>
				<BookmarkBadge
					bookmarked={bookmarked}
					onPress={() => { }}
				/>
				<Image
					source={require('@/assets/images/dino.jpg')}
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
