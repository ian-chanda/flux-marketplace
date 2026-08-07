import { CustomHeader } from "@/components/customHeader"
import { ThemedView } from "@/components/themed-view"

export default function ProfileScreen(){
	return (
		<ThemedView isTabVisible>
			<CustomHeader showBack title="Profile"/>
		</ThemedView>
	)
}
