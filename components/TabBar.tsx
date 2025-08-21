import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';

export default function TabBar() {
	const { colors } = useTheme() as any;
	const pathname = usePathname();

	const tabs = [
		{ name: 'Eventos', icon: 'event', path: '/events' },
		{ name: 'Perfil', icon: 'person', path: '/profile' }
	];

	const isActive = (path: string) => pathname === path;

	const handleTabPress = (path: string) => {
		// Só navega se não estiver na tela atual
		if (!isActive(path)) {
			router.push(path);
		}
	};

	return (
		<View style={[styles.container, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
			{tabs.map((tab) => (
				<TouchableOpacity
					key={tab.path}
					style={styles.tab}
					onPress={() => handleTabPress(tab.path)}
					disabled={isActive(tab.path)}
				>
					<MaterialIcons
						name={tab.icon as any}
						size={24}
						color={isActive(tab.path) ? colors.text : colors.mutedText}
					/>
					<Text style={[
						styles.tabText,
						{ color: isActive(tab.path) ? colors.text : colors.mutedText }
					]}>
						{tab.name}
					</Text>
				</TouchableOpacity>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		borderTopWidth: 1,
		paddingVertical: 8,
		paddingHorizontal: 16
	},
	tab: {
		flex: 1,
		alignItems: 'center',
		paddingVertical: 8
	},
	tabText: {
		fontSize: 12,
		marginTop: 4,
		fontWeight: '500'
	}
}); 