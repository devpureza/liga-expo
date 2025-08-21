import { ReactNode } from 'react';
import { ActivityIndicator, GestureResponderEvent, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@react-navigation/native';

type Props = {
	onPress?: (event: GestureResponderEvent) => void;
	children: ReactNode;
	disabled?: boolean;
	loading?: boolean;
	style?: ViewStyle;
	variant?: 'gradient' | 'solid';
};

export default function PrimaryButton({ onPress, children, disabled, loading, style, variant = 'gradient' }: Props) {
	const { colors } = useTheme() as any;
	const content = (
		loading ? (
			<ActivityIndicator color={colors.buttonTextOnPrimary} />
		) : (
			<Text style={[styles.text, { color: colors.buttonTextOnPrimary }]}>{children}</Text>
		)
	);

	if (variant === 'solid') {
		return (
			<TouchableOpacity activeOpacity={0.8} onPress={onPress} disabled={disabled || loading} style={[styles.base, { backgroundColor: colors.primary }, style]}>
				{content}
			</TouchableOpacity>
		);
	}

	return (
		<TouchableOpacity activeOpacity={0.8} onPress={onPress} disabled={disabled || loading} style={style}>
			<LinearGradient colors={colors.brandGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.base}>
				{content}
			</LinearGradient>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	base: {
		paddingVertical: 10,
		paddingHorizontal: 14,
		borderRadius: 10,
		alignItems: 'center'
	},
	text: {
		fontWeight: '600'
	}
}); 