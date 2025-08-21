import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, TouchableOpacity, View, Image, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import TabBar from '../../../components/TabBar';
import { useEventDetails } from '../../../hooks/useEventDetails';
import { ReportService, VendasPorEvento } from '../../../services/reportService';

export default function SalesScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { colors } = useTheme() as any;
	const { evento, loading: eventLoading, error: eventError } = useEventDetails(id || '');
	const [vendasData, setVendasData] = useState<VendasPorEvento | null>(null);
	const [loadingVendas, setLoadingVendas] = useState(true);
	const [errorVendas, setErrorVendas] = useState<string | null>(null);

	// Carregar dados de vendas quando o evento estiver disponível
	useEffect(() => {
		if (evento && !eventLoading) {
			loadVendasData();
		}
	}, [evento, eventLoading]);

	async function loadVendasData() {
		try {
			setLoadingVendas(true);
			setErrorVendas(null);

			// Usar o nome do evento para buscar vendas
			const eventName = evento?.nome;
			if (!eventName) {
				setErrorVendas('Nome do evento não disponível');
				return;
			}

			console.log('🔍 Buscando vendas para evento:', eventName);

			const result = await ReportService.getRelatorioVendasEvento(eventName, ReportService.getDefaultPeriod());

			if (result.success && result.data) {
				console.log('✅ Dados de vendas carregados:', result.data);
				setVendasData(result.data);
			} else {
				console.error('❌ Erro ao carregar vendas:', result.error);
				setErrorVendas(result.error || 'Erro ao carregar dados de vendas');
			}
		} catch (error) {
			console.error('Erro ao carregar vendas:', error);
			setErrorVendas('Erro de conexão. Verifique sua internet.');
		} finally {
			setLoadingVendas(false);
		}
	}

	function goBack() {
		router.back();
	}

	const formatBRL = ReportService.formatBRL;

	// Renderizar loading enquanto carrega os dados do evento
	if (eventLoading) {
		return (
			<View style={{ flex: 1 }}>
				<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
					<View style={styles.header}>
						<TouchableOpacity onPress={goBack} style={styles.backButton}>
							<MaterialIcons name="arrow-back" size={24} color={colors.text} />
						</TouchableOpacity>
						<Image source={require('../../../assets/logo/Colorida-Offwhite.png')} style={styles.logo} resizeMode="contain" />
						<View style={styles.placeholder} />
					</View>
					<View style={styles.loadingContainer}>
						<ActivityIndicator size="large" color={colors.primary} />
						<Text style={[styles.loadingText, { color: colors.mutedText }]}>Carregando dados do evento...</Text>
					</View>
				</SafeAreaView>
				<TabBar />
			</View>
		);
	}

	// Renderizar erro se houver
	if (eventError) {
		return (
			<View style={{ flex: 1 }}>
				<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
					<View style={styles.header}>
						<TouchableOpacity onPress={goBack} style={styles.backButton}>
							<MaterialIcons name="arrow-back" size={24} color={colors.text} />
						</TouchableOpacity>
						<Image source={require('../../../assets/logo/Colorida-Offwhite.png')} style={styles.logo} resizeMode="contain" />
						<View style={styles.placeholder} />
					</View>
					<View style={styles.errorContainer}>
						<MaterialIcons name="error-outline" size={64} color={colors.mutedText} />
						<Text style={[styles.errorTitle, { color: colors.text }]}>Erro ao carregar evento</Text>
						<Text style={[styles.errorText, { color: colors.mutedText }]}>{eventError}</Text>
					</View>
				</SafeAreaView>
				<TabBar />
			</View>
		);
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

				{/* Título com nome do evento */}
				<Text style={[styles.title, { color: colors.text }]}>
					Vendas - {evento?.nome || `Evento #${id}`}
				</Text>

				{/* Subtítulo com data do evento se disponível */}
				{evento?.data_evento && (
					<Text style={[styles.subtitle, { color: colors.mutedText }]}>
						{new Date(evento.data_evento).toLocaleDateString('pt-BR')}
					</Text>
				)}

				{/* Status de carregamento das vendas */}
				{loadingVendas && (
					<View style={styles.vendasLoadingContainer}>
						<ActivityIndicator size="small" color={colors.primary} />
						<Text style={[styles.vendasLoadingText, { color: colors.mutedText }]}>
							Carregando dados de vendas...
						</Text>
					</View>
				)}

				{/* Erro ao carregar vendas */}
				{errorVendas && !loadingVendas && (
					<View style={styles.vendasErrorContainer}>
						<MaterialIcons name="warning" size={24} color={colors.mutedText} />
						<Text style={[styles.vendasErrorText, { color: colors.mutedText }]}>
							{errorVendas}
						</Text>
						<TouchableOpacity 
							style={[styles.retryButton, { backgroundColor: colors.primary }]}
							onPress={loadVendasData}
						>
							<Text style={[styles.retryButtonText, { color: colors.buttonTextOnPrimary }]}>
								Tentar Novamente
							</Text>
						</TouchableOpacity>
					</View>
				)}

				{/* Cards informativos - apenas receita total */}
				<View style={styles.stats}>
					<View style={[styles.statsCardWide, { backgroundColor: colors.card, borderColor: colors.cardBorder }, styles.shadow]}>
						<Text style={[styles.statsLabel, { color: colors.cardMuted }]}>Receita Total</Text>
						<Text style={[styles.statsValue, { color: colors.cardText }]}>
							{formatBRL(vendasData?.receita || 0)}
						</Text>
					</View>
				</View>

				{/* Resumo de vendas - apenas quantidade */}
				<View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }, styles.shadow]}>
					<View style={styles.summaryHeader}>
						<Text style={[styles.summaryTitle, { color: colors.cardText }]}>Resumo de Vendas</Text>
					</View>
					<View style={styles.summaryRow}>
						<View style={styles.summaryItem}>
							<Text style={[styles.summaryLabel, { color: colors.cardMuted }]}>Ingressos vendidos</Text>
							<Text style={[styles.summaryValue, { color: colors.cardText }]}>
								{vendasData?.quantidade || 0}
							</Text>
						</View>
					</View>
				</View>

				{/* Informações da API se disponíveis */}
				{vendasData && (
					<View style={[styles.apiInfoCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }, styles.shadow]}>
						<View style={styles.apiInfoHeader}>
							<MaterialIcons name="api" size={20} color={colors.primary} />
							<Text style={[styles.apiInfoTitle, { color: colors.cardText }]}>Dados da API</Text>
						</View>
						<Text style={[styles.apiInfoText, { color: colors.cardMuted }]}>
							Evento: {vendasData.evento}
						</Text>
						<Text style={[styles.apiInfoText, { color: colors.cardMuted }]}>
							Quantidade: {vendasData.quantidade} ingressos
						</Text>
						<Text style={[styles.apiInfoText, { color: colors.cardMuted }]}>
							Receita: {formatBRL(vendasData.receita)}
						</Text>
						<Text style={[styles.apiInfoText, { color: colors.cardMuted }]}>
							Tíquete médio: {formatBRL(vendasData.receita / vendasData.quantidade)}
						</Text>
					</View>
				)}
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
	subtitle: {
		fontSize: 14,
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
	statsCardWide: {
		flex: 1, // Ocupa todo o espaço disponível
		borderRadius: 12,
		padding: 20, // Padding maior para mais destaque
		borderWidth: 1,
		alignItems: 'center', // Centraliza o conteúdo
		justifyContent: 'center' // Centraliza verticalmente
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
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20
	},
	loadingText: {
		marginTop: 10,
		fontSize: 16
	},
	errorContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20
	},
	errorTitle: {
		fontSize: 18,
		fontWeight: '700',
		marginTop: 10
	},
	errorText: {
		fontSize: 14,
		textAlign: 'center',
		marginTop: 5
	},
	vendasLoadingContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 10,
		marginBottom: 10
	},
	vendasLoadingText: {
		marginLeft: 5,
		fontSize: 14
	},
	vendasErrorContainer: {
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 10,
		marginBottom: 10,
		padding: 15,
		backgroundColor: '#fdd',
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#f00'
	},
	vendasErrorText: {
		fontSize: 14,
		textAlign: 'center',
		marginTop: 5,
		marginBottom: 10
	},
	retryButton: {
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 8
	},
	retryButtonText: {
		fontSize: 16,
		fontWeight: '700'
	},
	apiInfoCard: {
		borderRadius: 12,
		padding: 16,
		borderWidth: 1,
		marginTop: 10,
		marginBottom: 10
	},
	apiInfoHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10
	},
	apiInfoTitle: {
		fontSize: 16,
		fontWeight: '700',
		marginLeft: 8
	},
	apiInfoText: {
		fontSize: 14,
		marginBottom: 4
	}
}); 