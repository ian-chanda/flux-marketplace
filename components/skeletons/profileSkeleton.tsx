import { useTheme } from "@/hooks/useTheme"
import { useEffect, useRef } from "react"
import { Animated, StyleSheet, View } from "react-native"

const SkeletonBlock = ({ style }: { style?: any }) => {
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

export const ProfileSkeleton = () => {
	const { colors } = useTheme()
	return (
		<View style={{ paddingHorizontal: 10, gap: 10 }}>
			{/* header image */}
			<View style={{ paddingTop: 10, marginBottom: 50 }}>
				<SkeletonBlock style={styles.header} />
				{/* avatar */}
				<View style={{ position: "absolute", bottom: -30, left: 15 }}>
					<SkeletonBlock style={styles.avatar} />
				</View>
			</View>

			{/* name row */}
			<View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
				<View style={{ gap: 6 }}>
					<SkeletonBlock style={{ width: 160, height: 20 }} />
					<SkeletonBlock style={{ width: 100, height: 14 }} />
				</View>
				<SkeletonBlock style={{ width: 32, height: 32, borderRadius: 16 }} />
			</View>

			{/* bio */}
			<SkeletonBlock style={{ width: "90%", height: 14 }} />

			{/* tabs */}
			<View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
				<SkeletonBlock style={{ width: 60, height: 20 }} />
			</View>

			{/* about section */}
			<View style={{
				backgroundColor: colors.surface,
				borderRadius: 12,
				padding: 14,
				gap: 10,
			}}>
				<View style={{ gap: 12,}}>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
						<SkeletonBlock style={{ width: 70, height: 14 }} />
						<SkeletonBlock style={{ width: 120, height: 14 }} />
					</View>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
						<SkeletonBlock style={{ width: 70, height: 14 }} />
						<SkeletonBlock style={{ width: 100, height: 14 }} />
					</View>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
						<SkeletonBlock style={{ width: 90, height: 14 }} />
						<SkeletonBlock style={{ width: 90, height: 14 }} />
					</View>
				</View>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	header: {
		width: "100%",
		height: 150,
		borderRadius: 12,
	},
	avatar: {
		width: 100,
		height: 100,
		borderRadius: 50,
	},
})
