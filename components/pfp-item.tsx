import { useTheme } from "@/hooks/useTheme"
import {Avatar} from "@kolking/react-native-avatar"

export const PfpItem = ({ image, name, size }: { image: string, name: string, size: 'small' | 'medium' | 'large' }) => {

	const img_size = size === 'small' ? 50 : size === 'medium' ? 100 : 150
	const {colors} = useTheme()

	return (
		<Avatar 
			source={image ? { uri: image } : undefined}
			size={img_size}
			color={colors.secondary}
			radius={100}
			name={name}
		/>
	)
}
