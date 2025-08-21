import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import TabBar from '../../components/TabBar';
import { EventService } from '../../services/eventService';
import { Evento } from '../../types/api';

export default function EventsScreen() {
	const { colors } = useTheme() as any;
	const [eventos, setEventos] = useState<Evento[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	useEffect(() => {
		loadEvents();
	}, []);

	async function loadEvents() {
		try {
			setLoading(true);
			const result = await EventService.getActiveEvents();

			console.log('🔍 Resultado do EventService:', result);

			if (result.success && result.data) {
				console.log('📋 Tipo de dados recebidos:', typeof result.data);
				console.log('📋 É array?:', Array.isArray(result.data));
				console.log('📋 Quantidade de eventos:', result.data.length);
				
				setEventos(result.data);
			} else {
				console.error('❌ Erro ao carregar eventos:', result.error);
				Alert.alert('Erro', result.error || 'Não foi possível carregar os eventos');
			}
		} catch (error) {
			console.error('Erro ao carregar eventos:', error);
			Alert.alert('Erro', 'Erro de conexão. Verifique sua internet.');
		} finally {
			setLoading(false);
		}
	}

	async function onRefresh() {
		setRefreshing(true);
		await loadEvents();
		setRefreshing(false);
	}

	function navigateToEvent(eventId: string) {
		router.push(`/events/${eventId}`);
	}

	function renderEventCard(evento: Evento) {
		const isToday = EventService.isEventToday(evento.data_evento);
		const isPast = EventService.isEventPast(evento.data_evento);
		const statusColor = EventService.getEventStatusColor(evento.status);

		// Construir texto de localização de forma segura
		const locationParts = [
			evento.nome_local,
			evento.cidade,
			evento.estado
		].filter(Boolean); // Remove valores null/undefined/vazios

		const locationText = locationParts.length > 0 
			? locationParts.join(', ') 
			: 'Local não informado';

		return (
			<TouchableOpacity 
				key={evento.id}
				style={[styles.eventCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }, styles.shadow]}
				onPress={() => navigateToEvent(evento.id)}
			>
				{/* Header do card */}
				<View style={styles.eventHeader}>
					<View style={styles.eventInfo}>
						<Text style={[styles.eventName, { color: colors.cardText }]} numberOfLines={2}>
							{evento.nome}
						</Text>
						<View style={styles.eventLocation}>
							<MaterialIcons name="location-on" size={16} color={colors.cardMuted} />
							<Text style={[styles.locationText, { color: colors.cardMuted }]} numberOfLines={1}>
								{locationText}
							</Text>
						</View>
					</View>
					<View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
						<Text style={styles.statusText}>{evento.status}</Text>
					</View>
				</View>

				{/* Data e indicadores */}
				<View style={styles.eventDetails}>
					<View style={styles.dateContainer}>
						<MaterialIcons name="event" size={20} color={colors.primary} />
						<Text style={[styles.eventDate, { color: colors.cardText }]}>
							{EventService.formatEventDateShort(evento.data_evento)}
						</Text>
						{isToday && (
							<View style={[styles.todayBadge, { backgroundColor: colors.primary }]}>
								<Text style={[styles.todayText, { color: colors.buttonTextOnPrimary }]}>HOJE</Text>
							</View>
						)}
						{isPast && (
							<View style={[styles.pastBadge, { backgroundColor: '#6B7280' }]}>
								<Text style={[styles.pastText, { color: 'white' }]}>FINALIZADO</Text>
							</View>
						)}
					</View>
					<MaterialIcons name="chevron-right" size={24} color={colors.cardMuted} />
				</View>

				{/* Descrição se houver */}
				{evento.descricao && (
					<View style={styles.descriptionContainer}>
						<Text style={[styles.eventDescription, { color: colors.cardMuted }]} numberOfLines={2}>
							{evento.descricao}
						</Text>
					</View>
				)}
			</TouchableOpacity>
		);
	}

	if (loading) {
		return (
			<View style={{ flex: 1 }}>
				<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
					{/* Header */}
					<View style={styles.header}>
						<Image source={require('../../assets/logo/Colorida-Offwhite.png')} style={styles.logo} resizeMode="contain" />
					</View>

					<View style={styles.loadingContainer}>
						<ActivityIndicator size="large" color={colors.primary} />
						<Text style={[styles.loadingText, { color: colors.mutedText }]}>
							Carregando eventos...
						</Text>
					</View>
				</SafeAreaView>
				<TabBar />
			</View>
		);
	}

	return (
		<View style={{ flex: 1 }}>
			<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
				{/* Header */}
				<View style={styles.header}>
					<Image source={require('../../assets/logo/Colorida-Offwhite.png')} style={styles.logo} resizeMode="contain" />
				</View>

				<Text style={[styles.title, { color: colors.text }]}>Eventos Ativos</Text>

				{eventos.length === 0 ? (
					<View style={styles.emptyContainer}>
						<MaterialIcons name="event-busy" size={64} color={colors.mutedText} />
						<Text style={[styles.emptyTitle, { color: colors.text }]}>Nenhum evento ativo</Text>
						<Text style={[styles.emptySubtitle, { color: colors.mutedText }]}>
							Não há eventos ativos no momento
						</Text>
						<TouchableOpacity onPress={loadEvents} style={[styles.retryButton, { backgroundColor: colors.primary }]}>
							<MaterialIcons name="refresh" size={20} color={colors.buttonTextOnPrimary} />
							<Text style={[styles.retryButtonText, { color: colors.buttonTextOnPrimary }]}>
								Atualizar
							</Text>
						</TouchableOpacity>
					</View>
				) : (
					<ScrollView 
						style={styles.scrollView}
						refreshControl={
							<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
						}
						showsVerticalScrollIndicator={false}
					>
						<View style={styles.eventsContainer}>
							{Array.isArray(eventos) && eventos.length > 0 ? (
								eventos.map(renderEventCard)
							) : (
								<View style={styles.emptyContainer}>
									<MaterialIcons name="event-note" size={64} color={colors.mutedText} />
									<Text style={[styles.emptyTitle, { color: colors.text }]}>Nenhum evento encontrado</Text>
									<Text style={[styles.emptySubtitle, { color: colors.mutedText }]}>
										Os dados foram carregados mas não há eventos disponíveis
									</Text>
								</View>
							)}
						</View>
					</ScrollView>
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
		alignItems: 'center',
		marginBottom: 24
	},
	logo: {
		width: 160,
		height: 64
	},
	title: {
		fontSize: 24,
		fontWeight: '700',
		marginBottom: 24,
		textAlign: 'center'
	},
	loadingContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		gap: 16
	},
	loadingText: {
		fontSize: 16,
		fontWeight: '500'
	},
	emptyContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		gap: 16,
		paddingHorizontal: 32
	},
	emptyTitle: {
		fontSize: 20,
		fontWeight: '600'
	},
	emptySubtitle: {
		fontSize: 16,
		textAlign: 'center',
		lineHeight: 24
	},
	retryButton: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		paddingHorizontal: 20,
		paddingVertical: 12,
		borderRadius: 8,
		marginTop: 8
	},
	retryButtonText: {
		fontSize: 14,
		fontWeight: '600'
	},
	scrollView: {
		flex: 1
	},
	eventsContainer: {
		gap: 16,
		paddingBottom: 16
	},
	eventCard: {
		borderRadius: 16,
		padding: 20,
		borderWidth: 1
	},
	shadow: {
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 3
	},
	eventHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 16
	},
	eventInfo: {
		flex: 1,
		marginRight: 12
	},
	eventName: {
		fontSize: 18,
		fontWeight: '600',
		marginBottom: 8,
		lineHeight: 24
	},
	eventLocation: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4
	},
	locationText: {
		fontSize: 14,
		flex: 1
	},
	statusBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12
	},
	statusText: {
		color: 'white',
		fontSize: 12,
		fontWeight: '600',
		textTransform: 'uppercase'
	},
	eventDetails: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	dateContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		flex: 1
	},
	eventDate: {
		fontSize: 16,
		fontWeight: '500'
	},
	todayBadge: {
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 8
	},
	todayText: {
		fontSize: 10,
		fontWeight: '700'
	},
	pastBadge: {
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 8
	},
	pastText: {
		fontSize: 10,
		fontWeight: '700'
	},
	descriptionContainer: {
		marginTop: 12,
		paddingTop: 12,
		borderTopWidth: 1,
		borderTopColor: 'rgba(255,255,255,0.1)'
	},
	eventDescription: {
		fontSize: 14,
		lineHeight: 20
	}
}); 