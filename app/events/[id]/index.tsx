import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import TabBar from '../../../components/TabBar';
import { EventService } from '../../../services/eventService';
import { Evento } from '../../../types/api';

export default function EventMenuScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { colors } = useTheme() as any;
	const [evento, setEvento] = useState<Evento | null>(null);
	const [loading, setLoading] = useState(true);
	const [entryExpanded, setEntryExpanded] = useState(false);

	useEffect(() => {
		if (id) {
			loadEventDetails();
		}
	}, [id]);

	async function loadEventDetails() {
		try {
			setLoading(true);
			const result = await EventService.getEventDetails(id);

			if (result.success && result.data) {
				console.log('📅 Detalhes do evento carregados:', result.data);
				setEvento(result.data);
			} else {
				console.error('❌ Erro ao carregar evento:', result.error);
				Alert.alert('Erro', result.error || 'Não foi possível carregar os detalhes do evento');
			}
		} catch (error) {
			console.error('Erro ao carregar evento:', error);
			Alert.alert('Erro', 'Erro de conexão. Verifique sua internet.');
		} finally {
			setLoading(false);
		}
	}

	function open(path: string) {
		router.push(`/events/${id}/${path}`);
	}

	function goBack() {
		router.push('/events');
	}

	// Mock de dados de entrada (será integrado depois)
	const entryData = {
		totalCapacity: 5000,
		currentEntries: 3247,
		entriesPercentage: 64.9,
		entriesToday: 1205,
		lastEntryTime: '14:32',
		exitCount: 156,
		peakHour: '13:00-14:00',
		averageStayTime: '2h 15min',
		// Dados expandidos adicionais
		entryMethods: {
			qrCode: 2547,
			facial: 489,
			manual: 211
		},
		hourlyData: [
			{ hour: '10:00', entries: 134 },
			{ hour: '11:00', entries: 289 },
			{ hour: '12:00', entries: 456 },
			{ hour: '13:00', entries: 672 },
			{ hour: '14:00', entries: 578 },
			{ hour: '15:00', entries: 234 }
		],
		statusSummary: {
			validated: 3247,
			pending: 23,
			blocked: 8
		}
	};

	if (loading) {
		return (
			<View style={{ flex: 1 }}>
				<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
					{/* Header */}
					<View style={styles.header}>
						<TouchableOpacity onPress={goBack} style={styles.backButton}>
							<MaterialIcons name="arrow-back" size={24} color={colors.text} />
						</TouchableOpacity>
						<Image source={require('../../../assets/logo/Colorida-Offwhite.png')} style={styles.logo} resizeMode="contain" />
						<View style={styles.placeholder} />
					</View>

					<View style={styles.loadingContainer}>
						<ActivityIndicator size="large" color={colors.primary} />
						<Text style={[styles.loadingText, { color: colors.mutedText }]}>
							Carregando evento...
						</Text>
					</View>
				</SafeAreaView>
				<TabBar />
			</View>
		);
	}

	if (!evento) {
		return (
			<View style={{ flex: 1 }}>
				<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
					{/* Header */}
					<View style={styles.header}>
						<TouchableOpacity onPress={goBack} style={styles.backButton}>
							<MaterialIcons name="arrow-back" size={24} color={colors.text} />
						</TouchableOpacity>
						<Image source={require('../../../assets/logo/Colorida-Offwhite.png')} style={styles.logo} resizeMode="contain" />
						<View style={styles.placeholder} />
					</View>

					<View style={styles.errorContainer}>
						<MaterialIcons name="error-outline" size={64} color={colors.mutedText} />
						<Text style={[styles.errorTitle, { color: colors.text }]}>Evento não encontrado</Text>
						<Text style={[styles.errorSubtitle, { color: colors.mutedText }]}>
							Não foi possível carregar os detalhes deste evento
						</Text>
						<TouchableOpacity onPress={loadEventDetails} style={[styles.retryButton, { backgroundColor: colors.primary }]}>
							<MaterialIcons name="refresh" size={20} color={colors.buttonTextOnPrimary} />
							<Text style={[styles.retryButtonText, { color: colors.buttonTextOnPrimary }]}>
								Tentar novamente
							</Text>
						</TouchableOpacity>
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

				<ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
					{/* Título estilizado com nome do evento */}
					<View style={styles.titleContainer}>
						<Text style={[styles.title, { color: colors.text }]}>{evento.nome}</Text>
						<View style={[styles.titleUnderline, { backgroundColor: colors.primary }]} />
						
						{/* Info adicional do evento */}
						<View style={styles.eventInfoContainer}>
							{evento.data_evento && (
								<View style={styles.eventInfoItem}>
									<MaterialIcons name="event" size={16} color={colors.cardMuted} />
									<Text style={[styles.eventInfoText, { color: colors.cardMuted }]}>
										{EventService.formatEventDate(evento.data_evento)}
									</Text>
								</View>
							)}
							
							{(evento.nome_local || evento.cidade || evento.estado) && (
								<View style={styles.eventInfoItem}>
									<MaterialIcons name="location-on" size={16} color={colors.cardMuted} />
									<Text style={[styles.eventInfoText, { color: colors.cardMuted }]}>
										{[evento.nome_local, evento.cidade, evento.estado].filter(Boolean).join(', ') || 'Local não informado'}
									</Text>
								</View>
							)}

							<View style={styles.eventInfoItem}>
								<MaterialIcons name="info" size={16} color={colors.cardMuted} />
								<Text style={[styles.eventInfoText, { color: colors.cardMuted }]}>
									Status: {evento.status}
								</Text>
							</View>
						</View>
					</View>

					{/* Card de entrada - Toggle */}
					<TouchableOpacity 
						style={[styles.entryCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }, styles.shadow]}
						onPress={() => setEntryExpanded(!entryExpanded)}
						activeOpacity={0.7}
					>
						{/* Header sempre visível */}
						<View style={styles.entryHeader}>
							<View style={styles.entryHeaderLeft}>
								<MaterialIcons name="login" size={32} color={colors.primary} />
								<View style={styles.entryHeaderInfo}>
									<Text style={[styles.entryTitle, { color: colors.cardText }]}>Controle de Entrada</Text>
									<Text style={[styles.entrySubtitle, { color: colors.cardMuted }]}>
										{entryData.currentEntries.toLocaleString('pt-BR')} / {entryData.totalCapacity.toLocaleString('pt-BR')}
									</Text>
								</View>
							</View>
							<MaterialIcons 
								name={entryExpanded ? "expand-less" : "expand-more"} 
								size={24} 
								color={colors.cardMuted} 
							/>
						</View>

						{/* Conteúdo expandido */}
						{entryExpanded && (
							<>
								<View style={styles.entryStats}>
									<View style={styles.mainStat}>
										<Text style={[styles.mainStatNumber, { color: colors.primary }]}>
											{entryData.currentEntries.toLocaleString('pt-BR')}
										</Text>
										<Text style={[styles.mainStatLabel, { color: colors.cardMuted }]}>
											pessoas entraram
										</Text>
									</View>
									
									<View style={styles.progressContainer}>
										<View style={[styles.progressBar, { backgroundColor: colors.cardBorder }]}>
											<View 
												style={[
													styles.progressFill, 
													{ backgroundColor: colors.primary, width: `${entryData.entriesPercentage}%` }
												]} 
											/>
										</View>
										<Text style={[styles.progressText, { color: colors.cardMuted }]}>
											{entryData.entriesPercentage}% da capacidade
										</Text>
									</View>
								</View>

								{/* Stats Grid */}
								<View style={styles.statsGrid}>
									<View style={styles.statGridItem}>
										<MaterialIcons name="today" size={20} color={colors.primary} />
										<Text style={[styles.statGridNumber, { color: colors.cardText }]}>
											{entryData.entriesToday.toLocaleString('pt-BR')}
										</Text>
										<Text style={[styles.statGridLabel, { color: colors.cardMuted }]}>Hoje</Text>
									</View>
									<View style={styles.statGridItem}>
										<MaterialIcons name="exit-to-app" size={20} color={colors.primary} />
										<Text style={[styles.statGridNumber, { color: colors.cardText }]}>
											{entryData.exitCount}
										</Text>
										<Text style={[styles.statGridLabel, { color: colors.cardMuted }]}>Saídas</Text>
									</View>
									<View style={styles.statGridItem}>
										<MaterialIcons name="schedule" size={20} color={colors.primary} />
										<Text style={[styles.statGridNumber, { color: colors.cardText }]}>
											{entryData.averageStayTime}
										</Text>
										<Text style={[styles.statGridLabel, { color: colors.cardMuted }]}>Tempo médio</Text>
									</View>
								</View>

								{/* Métodos de entrada */}
								<View style={styles.entryMethodsSection}>
									<Text style={[styles.sectionTitle, { color: colors.cardText }]}>Métodos de Entrada</Text>
									<View style={styles.methodsGrid}>
										<View style={styles.methodItem}>
											<MaterialIcons name="qr-code-2" size={18} color={colors.primary} />
											<Text style={[styles.methodLabel, { color: colors.cardMuted }]}>QR Code</Text>
											<Text style={[styles.methodValue, { color: colors.cardText }]}>
												{entryData.entryMethods.qrCode.toLocaleString('pt-BR')}
											</Text>
										</View>
										<View style={styles.methodItem}>
											<MaterialIcons name="face-retouching-natural" size={18} color={colors.primary} />
											<Text style={[styles.methodLabel, { color: colors.cardMuted }]}>Facial</Text>
											<Text style={[styles.methodValue, { color: colors.cardText }]}>
												{entryData.entryMethods.facial.toLocaleString('pt-BR')}
											</Text>
										</View>
										<View style={styles.methodItem}>
											<MaterialIcons name="edit" size={18} color={colors.primary} />
											<Text style={[styles.methodLabel, { color: colors.cardMuted }]}>Manual</Text>
											<Text style={[styles.methodValue, { color: colors.cardText }]}>
												{entryData.entryMethods.manual.toLocaleString('pt-BR')}
											</Text>
										</View>
									</View>
								</View>

								{/* Status Summary */}
								<View style={styles.statusSection}>
									<Text style={[styles.sectionTitle, { color: colors.cardText }]}>Status dos Ingressos</Text>
									<View style={styles.statusGrid}>
										<View style={[styles.statusItem, { backgroundColor: '#10B981' }]}>
											<Text style={styles.statusNumber}>{entryData.statusSummary.validated}</Text>
											<Text style={styles.statusLabel}>Validados</Text>
										</View>
										<View style={[styles.statusItem, { backgroundColor: '#F59E0B' }]}>
											<Text style={styles.statusNumber}>{entryData.statusSummary.pending}</Text>
											<Text style={styles.statusLabel}>Pendentes</Text>
										</View>
										<View style={[styles.statusItem, { backgroundColor: '#EF4444' }]}>
											<Text style={styles.statusNumber}>{entryData.statusSummary.blocked}</Text>
											<Text style={styles.statusLabel}>Bloqueados</Text>
										</View>
									</View>
								</View>
							</>
						)}
					</TouchableOpacity>

					<View style={styles.grid}>
						<TouchableOpacity style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }, styles.shadow]} onPress={() => open('sales')}>
							<View style={styles.left}>
								<MaterialIcons name="sell" size={22} color={colors.cardText} />
								<Text style={[styles.cardTitle, { color: colors.cardText }]}>Relatório</Text>
							</View>
							<MaterialIcons name="chevron-right" size={22} color={colors.cardMuted} />
						</TouchableOpacity>
						<TouchableOpacity style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }, styles.shadow]} onPress={() => open('pos')}>
							<View style={styles.left}>
								<MaterialIcons name="point-of-sale" size={22} color={colors.cardText} />
								<Text style={[styles.cardTitle, { color: colors.cardText }]}>PDV</Text>
							</View>
							<MaterialIcons name="chevron-right" size={22} color={colors.cardMuted} />
						</TouchableOpacity>
						<TouchableOpacity style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }, styles.shadow]} onPress={() => open('qrcode')}>
							<View style={styles.left}>
								<MaterialIcons name="qr-code-2" size={22} color={colors.cardText} />
								<Text style={[styles.cardTitle, { color: colors.cardText }]}>QR Code</Text>
							</View>
							<MaterialIcons name="chevron-right" size={22} color={colors.cardMuted} />
						</TouchableOpacity>
						<TouchableOpacity style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }, styles.shadow]} onPress={() => open('facial')}>
							<View style={styles.left}>
								<MaterialIcons name="face-retouching-natural" size={22} color={colors.cardText} />
								<Text style={[styles.cardTitle, { color: colors.cardText }]}>Facial</Text>
							</View>
							<MaterialIcons name="chevron-right" size={22} color={colors.cardMuted} />
						</TouchableOpacity>
						<TouchableOpacity style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }, styles.shadow]} onPress={() => open('cupons')}>
							<View style={styles.left}>
								<MaterialIcons name="local-offer" size={22} color={colors.cardText} />
								<Text style={[styles.cardTitle, { color: colors.cardText }]}>Cupons</Text>
							</View>
							<MaterialIcons name="chevron-right" size={22} color={colors.cardMuted} />
						</TouchableOpacity>
						<TouchableOpacity style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }, styles.shadow]} onPress={() => open('cortesias')}>
							<View style={styles.left}>
								<MaterialIcons name="card-giftcard" size={22} color={colors.cardText} />
								<Text style={[styles.cardTitle, { color: colors.cardText }]}>Cortesias</Text>
							</View>
							<MaterialIcons name="chevron-right" size={22} color={colors.cardMuted} />
						</TouchableOpacity>
						<TouchableOpacity style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }, styles.shadow]} onPress={() => open('editar')}>
							<View style={styles.left}>
								<MaterialIcons name="edit" size={22} color={colors.cardText} />
								<Text style={[styles.cardTitle, { color: colors.cardText }]}>Editar</Text>
							</View>
							<MaterialIcons name="chevron-right" size={22} color={colors.cardMuted} />
						</TouchableOpacity>
						<TouchableOpacity style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }, styles.shadow]} onPress={() => open('ingressos')}>
							<View style={styles.left}>
								<MaterialIcons name="confirmation-number" size={22} color={colors.cardText} />
								<Text style={[styles.cardTitle, { color: colors.cardText }]}>Ingressos</Text>
							</View>
							<MaterialIcons name="chevron-right" size={22} color={colors.cardMuted} />
						</TouchableOpacity>
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
	titleContainer: {
		alignItems: 'center',
		marginBottom: 24
	},
	title: {
		fontSize: 28,
		fontWeight: '800',
		marginBottom: 8,
		textAlign: 'center'
	},
	titleUnderline: {
		width: 60,
		height: 4,
		borderRadius: 2
	},
	entryCard: {
		padding: 20,
		borderRadius: 16,
		borderWidth: 1,
		marginBottom: 24
	},
	entryHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 16
	},
	entryHeaderLeft: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12
	},
	entryHeaderInfo: {
		flex: 1
	},
	entryTitle: {
		fontSize: 18,
		fontWeight: '700'
	},
	entrySubtitle: {
		fontSize: 14,
		fontWeight: '500',
		marginTop: 2
	},
	entryStats: {
		marginBottom: 20
	},
	mainStat: {
		alignItems: 'center',
		marginBottom: 16
	},
	mainStatNumber: {
		fontSize: 36,
		fontWeight: '800',
		marginBottom: 4
	},
	mainStatLabel: {
		fontSize: 14,
		fontWeight: '500'
	},
	progressContainer: {
		gap: 8
	},
	progressBar: {
		height: 8,
		borderRadius: 4,
		overflow: 'hidden'
	},
	progressFill: {
		height: '100%',
		borderRadius: 4
	},
	progressText: {
		fontSize: 12,
		textAlign: 'center'
	},
	entryDetails: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		gap: 16
	},
	entryDetailItem: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		flex: 1
	},
	entryDetailText: {
		fontSize: 13,
		fontWeight: '500',
		flex: 1
	},
	grid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 12
	},
	card: {
		flexBasis: '48%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderRadius: 12,
		padding: 16,
		borderWidth: 1
	},
	shadow: {
		shadowColor: '#000',
		shadowOpacity: 0.12,
		shadowRadius: 8,
		shadowOffset: { width: 0, height: 4 },
		elevation: 3
	},
	left: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10
	},
	cardTitle: {
		fontWeight: '700',
		fontSize: 16
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
		fontSize: 20,
		fontWeight: '700',
		marginTop: 10,
		textAlign: 'center'
	},
	errorSubtitle: {
		fontSize: 14,
		marginTop: 5,
		textAlign: 'center'
	},
	retryButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 10,
		marginTop: 20
	},
	retryButtonText: {
		fontSize: 16,
		fontWeight: '600',
		marginLeft: 8
	},
	eventInfoContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-around',
		marginTop: 10,
		paddingVertical: 10,
		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderColor: '#eee'
	},
	eventInfoItem: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 5
	},
	eventInfoText: {
		fontSize: 13,
		marginLeft: 5
	},
	scrollView: {
		flex: 1
	},
	// Estilos para o toggle expandido
	statsGrid: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginBottom: 20,
		paddingTop: 16,
		borderTopWidth: 1,
		borderTopColor: '#E5E7EB'
	},
	statGridItem: {
		alignItems: 'center',
		flex: 1
	},
	statGridNumber: {
		fontSize: 18,
		fontWeight: '700',
		marginTop: 4
	},
	statGridLabel: {
		fontSize: 12,
		fontWeight: '500',
		marginTop: 2,
		textAlign: 'center'
	},
	entryMethodsSection: {
		marginBottom: 20
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: '600',
		marginBottom: 12
	},
	methodsGrid: {
		flexDirection: 'row',
		justifyContent: 'space-around'
	},
	methodItem: {
		alignItems: 'center',
		flex: 1
	},
	methodLabel: {
		fontSize: 12,
		fontWeight: '500',
		marginTop: 4,
		textAlign: 'center'
	},
	methodValue: {
		fontSize: 16,
		fontWeight: '700',
		marginTop: 2
	},
	statusSection: {
		marginTop: 8
	},
	statusGrid: {
		flexDirection: 'row',
		gap: 8
	},
	statusItem: {
		flex: 1,
		alignItems: 'center',
		paddingVertical: 12,
		paddingHorizontal: 8,
		borderRadius: 8
	},
	statusNumber: {
		fontSize: 18,
		fontWeight: '800',
		color: 'white'
	},
	statusLabel: {
		fontSize: 12,
		fontWeight: '600',
		color: 'white',
		marginTop: 2
	}
});	