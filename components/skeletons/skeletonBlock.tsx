import { useTheme } from "@/hooks/useTheme"
import { useEffect, useRef } from "react"
import { Animated } from "react-native"

export const SkeletonBlock = ({ style }: { style?: any }) => {
	const { colors } = useTheme()
	const opacity = useRef(new Animated.Value(0.4)).current

	useEffect(() => {
		const pulse = Animated.loop(
			Animated.sequence([
				Animated.timing(opacity, {
					toValue: 1,
					duration: 700,
					useNativeDriver: true,
				}),
				Animated.timing(opacity, {
					toValue: 0.4,
					duration: 700,
					useNativeDriver: true,
				}),
			])
		)
		pulse.start()
		return () => pulse.stop()
	}, [])

	return (
		<Animated.View
			style={[
				{ backgroundColor: colors.disabled, borderRadius: 8, opacity },
				style,
			]}
		/>
	)
}
