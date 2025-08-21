import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import TabBar from '../../../components/TabBar';

export default function SalesScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { colors } = useTheme() as any;

	function goBack() {
		router.back();
	}

	// Mock de métricas do evento (sem backend por enquanto)
	const totals = {
		totalComTaxa: 125000.5,
		totalSemTaxa: 115000,
		taxaTotal: 10000.5,
		ingressosVendidos: 3250,
		vendasHoje: 120,
		ticketMedio: 35.4
	};
	const formatBRL = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

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

				<Text style={[styles.title, { color: colors.text }]}>Vendas - Evento #{id}</Text>

				{/* Cards informativos */}
				<View style={styles.stats}>
					<View style={[styles.statsCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }, styles.shadow]}>
						<Text style={[styles.statsLabel, { color: colors.cardMuted }]}>Valor total com taxa</Text>
						<Text style={[styles.statsValue, { color: colors.cardText }]}>{formatBRL(totals.totalComTaxa)}</Text>
					</View>
					<View style={[styles.statsCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }, styles.shadow]}>
						<Text style={[styles.statsLabel, { color: colors.cardMuted }]}>Valor total sem taxa</Text>
						<Text style={[styles.statsValue, { color: colors.cardText }]}>{formatBRL(totals.totalSemTaxa)}</Text>
					</View>
					<View style={[styles.statsCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }, styles.shadow]}>
						<Text style={[styles.statsLabel, { color: colors.cardMuted }]}>Valor taxa</Text>
						<Text style={[styles.statsValue, { color: colors.cardText }]}>{formatBRL(totals.taxaTotal)}</Text>
					</View>
				</View>

				{/* Resumo de vendas */}
				<View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }, styles.shadow]}>
					<View style={styles.summaryHeader}>
						<Text style={[styles.summaryTitle, { color: colors.cardText }]}>Resumo de Vendas</Text>
					</View>
					<View style={styles.summaryRow}>
						<View style={styles.summaryItem}>
							<Text style={[styles.summaryLabel, { color: colors.cardMuted }]}>Ingressos vendidos</Text>
							<Text style={[styles.summaryValue, { color: colors.cardText }]}>{totals.ingressosVendidos}</Text>
						</View>
						<View style={styles.summaryItem}>
							<Text style={[styles.summaryLabel, { color: colors.cardMuted }]}>Vendas hoje</Text>
							<Text style={[styles.summaryValue, { color: colors.cardText }]}>{totals.vendasHoje}</Text>
						</View>
						<View style={styles.summaryItem}>
							<Text style={[styles.summaryLabel, { color: colors.cardMuted }]}>Tíquete médio</Text>
							<Text style={[styles.summaryValue, { color: colors.cardText }]}>{formatBRL(totals.ticketMedio)}</Text>
						</View>
					</View>
					<View style={styles.divider} />
					<View style={styles.summaryTotals}>
						<View style={styles.summaryTotalCol}>
							<Text style={[styles.summaryLabel, { color: colors.cardMuted }]}>Sem taxa</Text>
							<Text style={[styles.summaryValue, { color: colors.cardText }]}>{formatBRL(totals.totalSemTaxa)}</Text>
						</View>
						<View style={styles.summaryTotalCol}>
							<Text style={[styles.summaryLabel, { color: colors.cardMuted }]}>Taxa</Text>
							<Text style={[styles.summaryValue, { color: colors.cardText }]}>{formatBRL(totals.taxaTotal)}</Text>
						</View>
						<View style={styles.summaryTotalCol}>
							<Text style={[styles.summaryLabel, { color: colors.cardMuted }]}>Com taxa</Text>
							<Text style={[styles.summaryValue, { color: colors.cardText }]}>{formatBRL(totals.totalComTaxa)}</Text>
						</View>
					</View>
				</View>
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
		marginBottom: 16
	},
	stats: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 12,
		marginBottom: 12
	},
	statsCard: {
		flexBasis: '31%',
		borderRadius: 12,
		padding: 14,
		borderWidth: 1
	},
	statsLabel: {
		fontSize: 12,
		marginBottom: 4
	},
	statsValue: {
		fontSize: 16,
		fontWeight: '700'
	},
	summaryCard: {
		borderRadius: 12,
		padding: 16,
		borderWidth: 1,
		marginBottom: 16
	},
	summaryHeader: {
		marginBottom: 10
	},
	summaryTitle: {
		fontSize: 16,
		fontWeight: '700'
	},
	summaryRow: {
		flexDirection: 'row',
		gap: 12
	},
	summaryItem: {
		flex: 1,
		paddingVertical: 6
	},
	summaryLabel: {
		fontSize: 12
	},
	summaryValue: {
		marginTop: 4,
		fontSize: 16,
		fontWeight: '700'
	},
	divider: {
		height: 1,
		backgroundColor: 'rgba(0,0,0,0.06)',
		marginVertical: 10
	},
	summaryTotals: {
		flexDirection: 'row',
		gap: 12
	},
	summaryTotalCol: {
		flex: 1
	},
	shadow: {
		shadowColor: '#000',
		shadowOpacity: 0.12,
		shadowRadius: 8,
		shadowOffset: { width: 0, height: 4 },
		elevation: 3
	}
}); 