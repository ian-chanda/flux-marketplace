import React, { useEffect, useRef } from 'react';
import { Pressable, Animated, StyleSheet, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

// Adjust these to match your track/thumb sizing preferences
const TRACK_WIDTH = 52;
const TRACK_HEIGHT = 30;
const THUMB_SIZE = 24;
const THUMB_MARGIN = (TRACK_HEIGHT - THUMB_SIZE) / 2;

type DarkModeToggleProps = {
	// Optional overrides in case you want to control it externally
	value?: boolean;
	onValueChange?: (value: boolean) => void;
};

export function DarkModeToggle({ value, onValueChange }: DarkModeToggleProps) {
	// Assumes useTheme() exposes `isDark` and `toggleTheme`.
	// If your hook is named differently, swap these two lines.
	const { colors, context } = useTheme()
	const isDark = context?.theme === 'dark'

	const isOn = value !== undefined ? value : isDark;
	const handleToggle = onValueChange
		? () => onValueChange(!isOn)
		: context?.toggleTheme;

	const anim = useRef(new Animated.Value(isOn ? 1 : 0)).current;

	useEffect(() => {
		Animated.timing(anim, {
			toValue: isOn ? 1 : 0,
			duration: 220,
			useNativeDriver: false, // color/layout interpolation needs JS driver
		}).start();
	}, [isOn, anim]);

	const trackColor = anim.interpolate({
		inputRange: [0, 1],
		outputRange: [colors.primary, colors.secondary], // light track -> dark/on track
	});

	const thumbTranslateX = anim.interpolate({
		inputRange: [0, 1],
		outputRange: [THUMB_MARGIN, TRACK_WIDTH - THUMB_SIZE - THUMB_MARGIN],
	});

	return (
		<Pressable onPress={handleToggle} hitSlop={8}>
			<Animated.View style={[styles.track, { backgroundColor: trackColor }]}>
				<Animated.View
					style={[
						styles.thumb,
						{
							backgroundColor: colors.surface,
							transform: [{ translateX: thumbTranslateX }]
						},
					]}
				>
					{/* Optional: swap icon based on state, e.g. sun/moon */}
					<View style={styles.thumbInner} />
				</Animated.View>
			</Animated.View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	track: {
		width: TRACK_WIDTH,
		height: TRACK_HEIGHT,
		borderRadius: TRACK_HEIGHT / 2,
		justifyContent: 'center',
	},
	thumb: {
		width: THUMB_SIZE,
		height: THUMB_SIZE,
		borderRadius: THUMB_SIZE / 2,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.2,
		shadowRadius: 2,
		elevation: 2,
		alignItems: 'center',
		justifyContent: 'center',
	},
	thumbInner: {
		width: 0,
		height: 0,
	},
});
