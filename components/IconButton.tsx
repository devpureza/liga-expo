import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

type Props = {
	onPress?: () => void;
	style?: ViewStyle;
	name?: keyof typeof MaterialIcons.glyphMap;
	size?: number;
};

export default function IconButton({ onPress, style, name = 'arrow-forward', size = 22 }: Props) {
	const { colors } = useTheme() as any;
	return (
		<TouchableOpacity onPress={onPress} activeOpacity={0.85} style={[styles.base, { backgroundColor: colors.primary }, styles.shadow, style]}> 
			<MaterialIcons name={name} color={colors.buttonTextOnPrimary} size={size} />
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	base: {
		width: 40,
		height: 40,
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center'
	},
	shadow: {
		shadowColor: '#000',
		shadowOpacity: 0.2,
		shadowRadius: 6,
		shadowOffset: { width: 0, height: 3 },
		elevation: 4
	}
}); 