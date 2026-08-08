import { CustomHeader } from "@/components/customHeader"
import { ThemedView } from "@/components/themed-view"
import { Image } from "react-native"

export default function ProfileScreen() {
	return (
		<ThemedView isTabVisible>
			<CustomHeader showBack title="Profile" />
			<Image
				source={require('@/assets/images/dino.jpg')}
				style={{
					width: 150,
					height: 150
				}} 
			/>
		</ThemedView>
	)
}
