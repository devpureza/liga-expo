import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, TextInput, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import TabBar from '../../../components/TabBar';
import { CouponService } from '../../../services/couponService';
import { Cupom } from '../../../types/api';

export default function ListaCuponsScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { colors } = useTheme() as any;
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

	const filteredCupons = cupons.filter(cupom => {
		const matchesSearch = cupom.codigo.toLowerCase().includes(searchText.toLowerCase()) || 
		                     (cupom.descricao && cupom.descricao.toLowerCase().includes(searchText.toLowerCase()));
		
		const status = CouponService.getCouponStatus(cupom);
		const matchesFilter = filterStatus === 'todos' || 
		                     (filterStatus === 'ativos' && status === 'ativo') || 
		                     (filterStatus === 'expirados' && (status === 'expirado' || status === 'esgotado'));
		
		return matchesSearch && matchesFilter;
	});

	function toggleCupomStatus(cupomId: string) {
		Alert.alert('Funcionalidade', 'Alteração de status será implementada em breve.');
	}

	function editCupom(cupomId: string) {
		Alert.alert('Funcionalidade', 'Edição de cupom será implementada em breve.');
	}

	function duplicateCupom(cupomId: string) {
		Alert.alert('Funcionalidade', 'Duplicar cupom será implementada em breve.');
	}

	function renderCupomCard({ item }: { item: Cupom }) {
		const status = CouponService.getCouponStatus(item);
		const statusColor = CouponService.getCouponStatusColor(status);
		const usagePercentage = CouponService.calculateUsagePercentage(item.usos || 0, item.limite_uso_por_cupom);
		
		return (
			<View style={[styles.cupomCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }, styles.shadow]}>
				<View style={styles.cupomHeader}>
					<View style={styles.cupomInfo}>
						<Text style={[styles.cupomCodigo, { color: colors.primary }]}>{item.codigo}</Text>
						{item.descricao && (
							<Text style={[styles.cupomDescricao, { color: colors.cardText }]}>{item.descricao}</Text>
						)}
					</View>
					<View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
						<Text style={styles.statusText}>{status}</Text>
					</View>
				</View>

				<View style={styles.cupomStats}>
					<View style={styles.statItem}>
						<Text style={[styles.statLabel, { color: colors.cardMuted }]}>Desconto</Text>
						<Text style={[styles.statValue, { color: colors.cardText }]}>
							{item.tipo_desconto === 'percentual' ? `${Number(item.valor)}%` : `R$ ${Number(item.valor).toFixed(2)}`}
						</Text>
					</View>
					<View style={styles.statItem}>
						<Text style={[styles.statLabel, { color: colors.cardMuted }]}>Usos</Text>
						<Text style={[styles.statValue, { color: colors.cardText }]}>
							{item.usos || 0}{item.limite_uso_por_cupom ? `/${item.limite_uso_por_cupom}` : ''}
						</Text>
					</View>
					<View style={styles.statItem}>
						<Text style={[styles.statLabel, { color: colors.cardMuted }]}>Validade</Text>
						<Text style={[styles.statValue, { color: colors.cardText }]}>
							{item.data_expiracao ? CouponService.formatExpirationDate(item.data_expiracao) : 'Sem limite'}
						</Text>
					</View>
				</View>

				{item.limite_uso_por_cupom && (
					<View style={styles.progressContainer}>
						<View style={[styles.progressBar, { backgroundColor: colors.cardBorder }]}>
							<View 
								style={[
									styles.progressFill, 
									{ 
										backgroundColor: usagePercentage > 80 ? '#EF4444' : colors.primary,
										width: `${Math.min(usagePercentage, 100)}%` 
									}
								]} 
							/>
						</View>
						<Text style={[styles.progressText, { color: colors.cardMuted }]}>
							{usagePercentage.toFixed(0)}% dos usos
						</Text>
					</View>
				)}

				<View style={styles.cupomActions}>
					<TouchableOpacity 
						style={[styles.actionButton, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder }]}
						onPress={() => editCupom(item.id)}
					>
						<MaterialIcons name="edit" size={18} color={colors.cardText} />
						<Text style={[styles.actionButtonText, { color: colors.cardText }]}>Editar</Text>
					</TouchableOpacity>
					
					<TouchableOpacity 
						style={[styles.actionButton, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder }]}
						onPress={() => duplicateCupom(item.id)}
					>
						<MaterialIcons name="content-copy" size={18} color={colors.cardText} />
						<Text style={[styles.actionButtonText, { color: colors.cardText }]}>Duplicar</Text>
					</TouchableOpacity>
					
					<TouchableOpacity 
						style={[styles.actionButton, { backgroundColor: status === 'ativo' ? '#EF4444' : '#10B981', borderColor: 'transparent' }]}
						onPress={() => toggleCupomStatus(item.id)}
					>
						<MaterialIcons name={status === 'ativo' ? "visibility-off" : "visibility"} size={18} color="white" />
						<Text style={[styles.actionButtonText, { color: 'white' }]}>
							{status === 'ativo' ? 'Desativar' : 'Ativar'}
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}

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
							Carregando cupons...
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
					<TouchableOpacity onPress={goBack} style={styles.backButton}>
						<MaterialIcons name="arrow-back" size={24} color={colors.text} />
					</TouchableOpacity>
					<Image source={require('../../../assets/logo/Colorida-Offwhite.png')} style={styles.logo} resizeMode="contain" />
					<View style={styles.placeholder} />
				</View>

				<Text style={[styles.title, { color: colors.text }]}>Cupons do Evento</Text>

				{/* Busca e filtros */}
				<View style={styles.searchContainer}>
					<View style={[styles.searchInput, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder }]}>
						<MaterialIcons name="search" size={20} color={colors.inputPlaceholder} />
						<TextInput
							style={[styles.searchText, { color: colors.inputText }]}
							placeholder="Buscar por código ou descrição..."
							placeholderTextColor={colors.inputPlaceholder}
							value={searchText}
							onChangeText={setSearchText}
						/>
					</View>
				</View>

				<View style={styles.filterContainer}>
					{[
						{ key: 'todos', label: 'Todos' },
						{ key: 'ativos', label: 'Ativos' },
						{ key: 'expirados', label: 'Expirados' }
					].map((filter) => (
						<TouchableOpacity
							key={filter.key}
							style={[
								styles.filterButton,
								{
									backgroundColor: filterStatus === filter.key ? colors.primary : colors.card,
									borderColor: colors.cardBorder
								}
							]}
							onPress={() => setFilterStatus(filter.key as any)}
						>
							<Text style={[
								styles.filterButtonText,
								{ color: filterStatus === filter.key ? colors.buttonTextOnPrimary : colors.cardText }
							]}>
								{filter.label}
							</Text>
						</TouchableOpacity>
					))}
				</View>

				{/* Estatísticas */}
				<View style={[styles.statsCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }, styles.shadow]}>
					<View style={styles.statsRow}>
						<View style={styles.statsItem}>
							<Text style={[styles.statsNumber, { color: colors.primary }]}>
								{cupons.filter(c => CouponService.getCouponStatus(c) === 'ativo').length}
							</Text>
							<Text style={[styles.statsLabel, { color: colors.cardMuted }]}>Ativos</Text>
						</View>
						<View style={styles.statsItem}>
							<Text style={[styles.statsNumber, { color: colors.primary }]}>
								{cupons.reduce((acc, c) => acc + (c.usos || 0), 0)}
							</Text>
							<Text style={[styles.statsLabel, { color: colors.cardMuted }]}>Total de usos</Text>
						</View>
						<View style={styles.statsItem}>
							<Text style={[styles.statsNumber, { color: colors.primary }]}>
								{cupons.length}
							</Text>
							<Text style={[styles.statsLabel, { color: colors.cardMuted }]}>Total cupons</Text>
						</View>
					</View>
				</View>

				{/* Lista de cupons */}
				{filteredCupons.length === 0 ? (
					<View style={styles.emptyContainer}>
						<MaterialIcons name="local-offer" size={64} color={colors.mutedText} />
						<Text style={[styles.emptyTitle, { color: colors.text }]}>
							{cupons.length === 0 ? 'Nenhum cupom criado' : 'Nenhum cupom encontrado'}
						</Text>
						<Text style={[styles.emptySubtitle, { color: colors.mutedText }]}>
							{cupons.length === 0 
								? 'Crie o primeiro cupom para este evento'
								: 'Tente ajustar os filtros de busca'
							}
						</Text>
						{cupons.length === 0 && (
							<TouchableOpacity 
								onPress={() => router.push(`/events/${id}/criar-cupom`)}
								style={[styles.createButton, { backgroundColor: colors.primary }]}
							>
								<MaterialIcons name="add" size={20} color={colors.buttonTextOnPrimary} />
								<Text style={[styles.createButtonText, { color: colors.buttonTextOnPrimary }]}>
									Criar Cupom
								</Text>
							</TouchableOpacity>
						)}
					</View>
				) : (
					<FlatList
						data={filteredCupons}
						keyExtractor={(item) => item.id}
						renderItem={renderCupomCard}
						contentContainerStyle={styles.listContainer}
						showsVerticalScrollIndicator={false}
						onRefresh={onRefresh}
						refreshing={refreshing}
					/>
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
		marginBottom: 20,
		textAlign: 'center'
	},
	searchContainer: {
		marginBottom: 16
	},
	searchInput: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderRadius: 12,
		borderWidth: 1
	},
	searchText: {
		flex: 1,
		fontSize: 16
	},
	filterContainer: {
		flexDirection: 'row',
		gap: 12,
		marginBottom: 20
	},
	filterButton: {
		flex: 1,
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderRadius: 12,
		borderWidth: 1,
		alignItems: 'center'
	},
	filterButtonText: {
		fontSize: 14,
		fontWeight: '600'
	},
	statsCard: {
		padding: 16,
		borderRadius: 12,
		borderWidth: 1,
		marginBottom: 20
	},
	statsRow: {
		flexDirection: 'row',
		justifyContent: 'space-around'
	},
	statsItem: {
		alignItems: 'center'
	},
	statsNumber: {
		fontSize: 20,
		fontWeight: '800',
		marginBottom: 4
	},
	statsLabel: {
		fontSize: 12,
		textAlign: 'center'
	},
	listContainer: {
		paddingBottom: 20,
		gap: 16
	},
	cupomCard: {
		padding: 16,
		borderRadius: 12,
		borderWidth: 1,
		gap: 16
	},
	cupomHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start'
	},
	cupomInfo: {
		flex: 1
	},
	cupomCodigo: {
		fontSize: 16,
		fontWeight: '700',
		marginBottom: 4
	},
	cupomDescricao: {
		fontSize: 14,
		fontWeight: '400'
	},
	statusBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6
	},
	statusText: {
		fontSize: 12,
		fontWeight: '600',
		color: 'white'
	},
	cupomStats: {
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	statItem: {
		alignItems: 'center'
	},
	statLabel: {
		fontSize: 12,
		marginBottom: 4
	},
	statValue: {
		fontSize: 14,
		fontWeight: '600'
	},
	progressContainer: {
		gap: 6
	},
	progressBar: {
		height: 6,
		borderRadius: 3,
		overflow: 'hidden'
	},
	progressFill: {
		height: '100%',
		borderRadius: 3
	},
	progressText: {
		fontSize: 11,
		textAlign: 'center'
	},
	cupomActions: {
		flexDirection: 'row',
		gap: 8
	},
	actionButton: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 6,
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 8,
		borderWidth: 1
	},
	actionButtonText: {
		fontSize: 12,
		fontWeight: '600'
	},
	emptyContainer: {
		alignItems: 'center',
		paddingVertical: 40,
		gap: 12
	},
	emptyTitle: {
		fontSize: 18,
		fontWeight: '600'
	},
	emptySubtitle: {
		fontSize: 14,
		textAlign: 'center',
		marginBottom: 20
	},
	createButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 12
	},
	createButtonText: {
		fontSize: 16,
		fontWeight: '600'
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 20
	},
	loadingText: {
		marginTop: 10,
		fontSize: 16
	},
	shadow: {
		shadowColor: '#000',
		shadowOpacity: 0.08,
		shadowRadius: 8,
		shadowOffset: { width: 0, height: 2 },
		elevation: 2
	}
}); 