import Button from "@/components/Button"
import { CustomHeader } from "@/components/customHeader"
import { CustomInputField } from "@/components/customInput"
import { IconButton } from "@/components/iconButton"
import { ThemedView } from "@/components/themed-view"
import { useTheme } from "@/hooks/useTheme"
import { useState } from "react"
import { ScrollView } from "react-native"
import { TouchableOpacity, View } from "react-native"

export default function AddressScreen() {
	const { colors } = useTheme()
	const [name, setName] = useState("");

	return (
		<ThemedView>
			<CustomHeader showBack title="Edit Address">
				<IconButton icon={"delete"} badgeValue="" onPress={() => { }} />
			</CustomHeader>

			<ScrollView 
				style={{ paddingHorizontal: 10,}}
				contentContainerStyle={{gap: 10}}
			>
				<CustomInputField
					onChangeText={setName}
					value={name}
					placeholder="address nickname"
				/>
				<CustomInputField
					onChangeText={setName}
					value={name}
					placeholder="name"
				/>
				<CustomInputField
					onChangeText={setName}
					value={name}
					placeholder="country or region"
				/>
				<CustomInputField
					onChangeText={setName}
					value={name}
					placeholder="street address"
				/>
				<CustomInputField
					onChangeText={setName}
					value={name}
					placeholder="street address 2"
				/>
				<CustomInputField
					onChangeText={setName}
					value={name}
					placeholder="city"
				/>
				<CustomInputField
					onChangeText={setName}
					value={name}
					placeholder="state/province/region"
				/>
				<CustomInputField
					onChangeText={setName}
					value={name}
					placeholder="phone number"
				/>
				<Button title="Done" onPress={() => {}}/>


			</ScrollView>
		</ThemedView>

	)
}
