import { useTheme } from "@/hooks/useTheme"
import { Image, StyleSheet, View } from "react-native"

export const HeaderImage = ({source} : {source: string}) => {
	const {colors} = useTheme()
	if (source) {
		return (
			<Image
				source={{uri: source }}
				style={[styles.header, { objectFit: "cover", }]}
			/>
		)
	} else {
		return (
			<View
				style={[styles.header, {
					backgroundColor: colors.disabled
				}]} />
		)
	}

}

const styles = StyleSheet.create({
	"header": {
		width: "100%",
		height: 150,
		objectFit: "cover",
		borderRadius: 12,
	}
})
