import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, TextInput, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import TabBar from '../../../components/TabBar';
import { CouponService } from '../../../services/couponService';
import { useEventDetails } from '../../../hooks/useEventDetails';
import { Cupom } from '../../../types/api';

export default function CuponsScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { colors } = useTheme() as any;
	const { evento, loading: eventLoading, error: eventError } = useEventDetails(id || '');
	const [searchText, setSearchText] = useState('');
	const [filterStatus, setFilterStatus] = useState<'todos' | 'ativos' | 'expirados'>('todos');
	const [cupons, setCupons] = useState<Cupom[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	useEffect(() => {
		loadCoupons();
	}, [id]);

	async function loadCoupons() {
		try {
			setLoading(true);
			const result = await CouponService.getCouponsByEvent(id);

			if (result.success && result.data) {
				console.log('🎫 Cupons do evento carregados:', result.data);
				setCupons(result.data);
			} else {
				console.error('❌ Erro ao carregar cupons:', result.error);
				Alert.alert('Erro', result.error || 'Não foi possível carregar os cupons');
			}
		} catch (error) {
			console.error('Erro ao carregar cupons:', error);
			Alert.alert('Erro', 'Erro de conexão. Verifique sua internet.');
		} finally {
			setLoading(false);
		}
	}

	async function onRefresh() {
		setRefreshing(true);
		await loadCoupons();
		setRefreshing(false);
	}

	function goBack() {
		router.back();
	}

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
					Cupons - {evento?.nome || `Evento #${id}`}
				</Text>

				{/* Subtítulo com data do evento se disponível */}
				{evento?.data_evento && (
					<Text style={[styles.subtitle, { color: colors.mutedText }]}>
						{new Date(evento.data_evento).toLocaleDateString('pt-BR')}
					</Text>
				)}

				<View style={styles.content}>
					<View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }, styles.shadow]}>
						<MaterialIcons name="local-offer" size={48} color={colors.cardText} />
						<Text style={[styles.infoTitle, { color: colors.cardText }]}>Cupons de Desconto</Text>
						<Text style={[styles.infoDesc, { color: colors.cardMuted }]}>
							Gerencie cupons de desconto para o evento. Crie, edite e monitore o uso dos cupons.
						</Text>
					</View>

					<View style={styles.actionButtons}>
						<TouchableOpacity 
							style={[styles.actionButton, { backgroundColor: colors.primary }, styles.shadow]}
							onPress={() => router.push(`/events/${id}/criar-cupom`)}
						>
							<MaterialIcons name="add" size={24} color={colors.buttonTextOnPrimary} />
							<Text style={[styles.actionButtonText, { color: colors.buttonTextOnPrimary }]}>
								Criar Cupom
							</Text>
						</TouchableOpacity>
						
						<TouchableOpacity 
							style={[styles.actionButton, { backgroundColor: colors.card, borderColor: colors.cardBorder }, styles.shadow]}
							onPress={() => router.push(`/events/${id}/lista-cupons`)}
						>
							<MaterialIcons name="list" size={24} color={colors.cardText} />
							<Text style={[styles.actionButtonText, { color: colors.cardText }]}>
								Listar Cupons
							</Text>
						</TouchableOpacity>
					</View>

					<View style={[styles.statsCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }, styles.shadow]}>
						<Text style={[styles.statsTitle, { color: colors.cardText }]}>Estatísticas</Text>
						<View style={styles.statsGrid}>
							<View style={styles.statItem}>
								<Text style={[styles.statNumber, { color: colors.cardText }]}>12</Text>
								<Text style={[styles.statLabel, { color: colors.cardMuted }]}>Cupons ativos</Text>
							</View>
							<View style={styles.statItem}>
								<Text style={[styles.statNumber, { color: colors.cardText }]}>67</Text>
								<Text style={[styles.statLabel, { color: colors.cardMuted }]}>Usos hoje</Text>
							</View>
							<View style={styles.statItem}>
								<Text style={[styles.statNumber, { color: colors.cardText }]}>R$ 2.450</Text>
								<Text style={[styles.statLabel, { color: colors.cardMuted }]}>Desconto total</Text>
							</View>
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
	subtitle: {
		fontSize: 14,
		marginBottom: 24
	},
	content: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		gap: 32
	},
	infoCard: {
		alignItems: 'center',
		padding: 32,
		borderRadius: 16,
		borderWidth: 1,
		maxWidth: 300
	},
	infoTitle: {
		fontSize: 20,
		fontWeight: '700',
		marginTop: 16,
		marginBottom: 8,
		textAlign: 'center'
	},
	infoDesc: {
		fontSize: 14,
		textAlign: 'center',
		lineHeight: 20
	},
	actionButtons: {
		flexDirection: 'row',
		gap: 16
	},
	actionButton: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		paddingVertical: 12,
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
		width: '100%',
		maxWidth: 300
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
	}
}); 