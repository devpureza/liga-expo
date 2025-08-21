import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import TabBar from '../../../components/TabBar';

export default function CortesiasScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { colors } = useTheme() as any;

	function goBack() {
		router.push('/events');
	}

	return (
		<View style={{ flex: 1 }}>
			<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
				{/* Header com logo e botão voltar */}
				<View style={styles.header}>
					<TouchableOpacity onPress={goBack} style={styles.backButton}>
						<MaterialIcons name="arrow-back" size={24} color={colors.text} />
					</TouchableOpacity>
					<Image source={require('../../../assets/logo/Colorida-Offwhite.png')} style={styles.logo} resizeMode="contain" />
					<View style={styles.placeholder} />
				</View>

				<Text style={[styles.title, { color: colors.text }]}>Cortesias - Evento #{id}</Text>

				<ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
					<View style={styles.content}>
						<View style={styles.actionButtons}>
							<TouchableOpacity 
								style={[styles.actionButton, { backgroundColor: colors.primary }, styles.shadow]}
								onPress={() => router.push(`/events/${id}/gerar-cortesia`)}
							>
								<MaterialIcons name="add" size={24} color={colors.buttonTextOnPrimary} />
								<Text style={[styles.actionButtonText, { color: colors.buttonTextOnPrimary }]}>
									Gerar Cortesia
								</Text>
							</TouchableOpacity>
							
							<TouchableOpacity 
								style={[styles.actionButton, { backgroundColor: colors.card, borderColor: colors.cardBorder }, styles.shadow]}
								onPress={() => router.push(`/events/${id}/lista-cortesias`)}
							>
								<MaterialIcons name="list" size={24} color={colors.cardText} />
								<Text style={[styles.actionButtonText, { color: colors.cardText }]}>
									Listar Cortesias
								</Text>
							</TouchableOpacity>
						</View>

						<View style={[styles.statsCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }, styles.shadow]}>
							<Text style={[styles.statsTitle, { color: colors.cardText }]}>Estatísticas</Text>
							<View style={styles.statsGrid}>
								<View style={styles.statItem}>
									<Text style={[styles.statNumber, { color: colors.cardText }]}>8</Text>
									<Text style={[styles.statLabel, { color: colors.cardMuted }]}>Cortesias ativas</Text>
								</View>
								<View style={styles.statItem}>
									<Text style={[styles.statNumber, { color: colors.cardText }]}>5</Text>
									<Text style={[styles.statLabel, { color: colors.cardMuted }]}>Utilizadas</Text>
								</View>
								<View style={styles.statItem}>
									<Text style={[styles.statNumber, { color: colors.cardText }]}>3</Text>
									<Text style={[styles.statLabel, { color: colors.cardMuted }]}>Pendentes</Text>
								</View>
							</View>
						</View>

						<View style={[styles.quickActions, { backgroundColor: colors.card, borderColor: colors.cardBorder }, styles.shadow]}>
							<Text style={[styles.quickActionsTitle, { color: colors.cardText }]}>Ações Rápidas</Text>
							<TouchableOpacity style={styles.quickActionItem}>
								<MaterialIcons name="email" size={20} color={colors.cardText} />
								<Text style={[styles.quickActionText, { color: colors.cardText }]}>Enviar por e-mail</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.quickActionItem}>
								<MaterialIcons name="share" size={20} color={colors.cardText} />
								<Text style={[styles.quickActionText, { color: colors.cardText }]}>Compartilhar</Text>
							</TouchableOpacity>
							<TouchableOpacity style={[styles.quickActionItem, styles.lastQuickAction]}>
								<MaterialIcons name="download" size={20} color={colors.cardText} />
								<Text style={[styles.quickActionText, { color: colors.cardText }]}>Baixar lista</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>
			</SafeAreaView>
			<TabBar />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 24
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 16
	},
	backButton: {
		padding: 8
	},
	logo: {
		width: 120,
		height: 48
	},
	placeholder: {
		width: 40
	},
	title: {
		fontSize: 22,
		fontWeight: '700',
		marginBottom: 24
	},
	scrollView: {
		flex: 1
	},
	content: {
		paddingBottom: 32,
		gap: 24
	},
	actionButtons: {
		flexDirection: 'row',
		gap: 16,
		justifyContent: 'center'
	},
	actionButton: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		paddingVertical: 14,
		paddingHorizontal: 20,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: 'transparent'
	},
	actionButtonText: {
		fontSize: 14,
		fontWeight: '600'
	},
	statsCard: {
		padding: 20,
		borderRadius: 16,
		borderWidth: 1,
		marginHorizontal: 16
	},
	statsTitle: {
		fontSize: 18,
		fontWeight: '700',
		marginBottom: 16,
		textAlign: 'center'
	},
	statsGrid: {
		flexDirection: 'row',
		justifyContent: 'space-around'
	},
	statItem: {
		alignItems: 'center'
	},
	statNumber: {
		fontSize: 20,
		fontWeight: '700',
		marginBottom: 4
	},
	statLabel: {
		fontSize: 12,
		textAlign: 'center'
	},
	quickActions: {
		padding: 20,
		borderRadius: 16,
		borderWidth: 1,
		marginHorizontal: 16
	},
	quickActionsTitle: {
		fontSize: 16,
		fontWeight: '700',
		marginBottom: 16,
		textAlign: 'center'
	},
	quickActionItem: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(0,0,0,0.05)'
	},
	lastQuickAction: {
		borderBottomWidth: 0
	},
	quickActionText: {
		fontSize: 14,
		fontWeight: '500'
	},
	shadow: {
		shadowColor: '#000',
		shadowOpacity: 0.12,
		shadowRadius: 8,
		shadowOffset: { width: 0, height: 4 },
		elevation: 3
	}
}); 