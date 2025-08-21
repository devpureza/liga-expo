import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, TouchableOpacity, View, Image, TextInput, FlatList, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import TabBar from '../../../components/TabBar';

type Cortesia = {
	id: string;
	codigo: string;
	nomeConvidado: string;
	email: string;
	telefone: string;
	setor: string;
	quantidade: number;
	valorEconomizado: number;
	dataGeracao: string;
	dataUso: string | null;
	status: 'pendente' | 'utilizada' | 'expirada';
	observacoes: string;
};

export default function ListaCortesiasScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { colors } = useTheme() as any;
	const [searchText, setSearchText] = useState('');
	const [filterStatus, setFilterStatus] = useState<'todos' | 'pendente' | 'utilizada' | 'expirada'>('todos');

	// Mock de dados de cortesias
	const mockCortesias: Cortesia[] = [
		{
			id: '1',
			codigo: 'CORTABC123',
			nomeConvidado: 'João Silva',
			email: 'joao@email.com',
			telefone: '(11) 99999-9999',
			setor: 'VIP',
			quantidade: 2,
			valorEconomizado: 300,
			dataGeracao: '15/11/2024',
			dataUso: '20/11/2024',
			status: 'utilizada',
			observacoes: 'Convidado especial da imprensa'
		},
		{
			id: '2',
			codigo: 'CORTDEF456',
			nomeConvidado: 'Maria Santos',
			email: 'maria@email.com',
			telefone: '(11) 88888-8888',
			setor: 'Camarote',
			quantidade: 1,
			valorEconomizado: 250,
			dataGeracao: '18/11/2024',
			dataUso: null,
			status: 'pendente',
			observacoes: ''
		},
		{
			id: '3',
			codigo: 'CORTGHI789',
			nomeConvidado: 'Pedro Costa',
			email: 'pedro@email.com',
			telefone: '(11) 77777-7777',
			setor: 'Pista',
			quantidade: 1,
			valorEconomizado: 80,
			dataGeracao: '10/11/2024',
			dataUso: null,
			status: 'pendente',
			observacoes: 'Influenciador digital'
		},
		{
			id: '4',
			codigo: 'CORTJKL012',
			nomeConvidado: 'Ana Paula',
			email: 'ana@email.com',
			telefone: '(11) 66666-6666',
			setor: 'VIP',
			quantidade: 3,
			valorEconomizado: 450,
			dataGeracao: '05/11/2024',
			dataUso: null,
			status: 'expirada',
			observacoes: 'Não compareceu'
		}
	];

	function goBack() {
		router.back();
	}

	const filteredCortesias = mockCortesias.filter(cortesia => {
		const matchesSearch = cortesia.nomeConvidado.toLowerCase().includes(searchText.toLowerCase()) ||
			cortesia.email.toLowerCase().includes(searchText.toLowerCase()) ||
			cortesia.codigo.toLowerCase().includes(searchText.toLowerCase());
		
		const matchesFilter = filterStatus === 'todos' || cortesia.status === filterStatus;

		return matchesSearch && matchesFilter;
	});

	function resendCortesia(cortesiaId: string) {
		Alert.alert(
			'Reenviar cortesia',
			'Deseja reenviar a cortesia por e-mail?',
			[
				{ text: 'Cancelar', style: 'cancel' },
				{ text: 'Reenviar', onPress: () => {
					console.log('Reenviando cortesia:', cortesiaId);
					Alert.alert('Sucesso', 'Cortesia reenviada por e-mail!');
				}}
			]
		);
	}

	function cancelCortesia(cortesiaId: string) {
		Alert.alert(
			'Cancelar cortesia',
			'Tem certeza que deseja cancelar esta cortesia? Esta ação não pode ser desfeita.',
			[
				{ text: 'Não', style: 'cancel' },
				{ text: 'Sim, cancelar', style: 'destructive', onPress: () => {
					console.log('Cancelando cortesia:', cortesiaId);
					Alert.alert('Sucesso', 'Cortesia cancelada!');
				}}
			]
		);
	}

	function markAsUsed(cortesiaId: string) {
		Alert.alert(
			'Marcar como utilizada',
			'Deseja marcar esta cortesia como utilizada?',
			[
				{ text: 'Cancelar', style: 'cancel' },
				{ text: 'Confirmar', onPress: () => {
					console.log('Marcando como utilizada:', cortesiaId);
					Alert.alert('Sucesso', 'Cortesia marcada como utilizada!');
				}}
			]
		);
	}

	function getStatusColor(status: string) {
		switch (status) {
			case 'utilizada': return '#10B981';
			case 'pendente': return '#F59E0B';
			case 'expirada': return '#EF4444';
			default: return colors.cardMuted;
		}
	}

	function getStatusText(status: string) {
		switch (status) {
			case 'utilizada': return 'Utilizada';
			case 'pendente': return 'Pendente';
			case 'expirada': return 'Expirada';
			default: return status;
		}
	}

	function renderCortesiaCard({ item }: { item: Cortesia }) {
		return (
			<View style={[styles.cortesiaCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }, styles.shadow]}>
				<View style={styles.cortesiaHeader}>
					<View style={styles.cortesiaInfo}>
						<Text style={[styles.cortesiaNome, { color: colors.cardText }]}>{item.nomeConvidado}</Text>
						<Text style={[styles.cortesiaCodigo, { color: colors.primary }]}>{item.codigo}</Text>
					</View>
					<View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
						<Text style={styles.statusText}>
							{getStatusText(item.status)}
						</Text>
					</View>
				</View>

				<View style={styles.cortesiaDetails}>
					<View style={styles.detailRow}>
						<MaterialIcons name="email" size={16} color={colors.cardMuted} />
						<Text style={[styles.detailText, { color: colors.cardText }]}>{item.email}</Text>
					</View>
					{item.telefone && (
						<View style={styles.detailRow}>
							<MaterialIcons name="phone" size={16} color={colors.cardMuted} />
							<Text style={[styles.detailText, { color: colors.cardText }]}>{item.telefone}</Text>
						</View>
					)}
					<View style={styles.detailRow}>
						<MaterialIcons name="location-on" size={16} color={colors.cardMuted} />
						<Text style={[styles.detailText, { color: colors.cardText }]}>
							{item.setor} • {item.quantidade} ingresso{item.quantidade > 1 ? 's' : ''}
						</Text>
					</View>
				</View>

				<View style={styles.cortesiaStats}>
					<View style={styles.statItem}>
						<Text style={[styles.statLabel, { color: colors.cardMuted }]}>Valor economizado</Text>
						<Text style={[styles.statValue, { color: colors.primary }]}>
							R$ {item.valorEconomizado.toFixed(2)}
						</Text>
					</View>
					<View style={styles.statItem}>
						<Text style={[styles.statLabel, { color: colors.cardMuted }]}>Data de geração</Text>
						<Text style={[styles.statValue, { color: colors.cardText }]}>
							{item.dataGeracao}
						</Text>
					</View>
					{item.dataUso && (
						<View style={styles.statItem}>
							<Text style={[styles.statLabel, { color: colors.cardMuted }]}>Data de uso</Text>
							<Text style={[styles.statValue, { color: colors.cardText }]}>
								{item.dataUso}
							</Text>
						</View>
					)}
				</View>

				{item.observacoes && (
					<View style={styles.observacoesContainer}>
						<Text style={[styles.observacoesLabel, { color: colors.cardMuted }]}>Observações:</Text>
						<Text style={[styles.observacoesText, { color: colors.cardText }]}>{item.observacoes}</Text>
					</View>
				)}

				<View style={styles.cortesiaActions}>
					{item.status === 'pendente' && (
						<>
							<TouchableOpacity 
								style={[styles.actionButton, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder }]}
								onPress={() => resendCortesia(item.id)}
							>
								<MaterialIcons name="email" size={16} color={colors.cardText} />
								<Text style={[styles.actionButtonText, { color: colors.cardText }]}>Reenviar</Text>
							</TouchableOpacity>
							
							<TouchableOpacity 
								style={[styles.actionButton, { backgroundColor: '#10B981', borderColor: 'transparent' }]}
								onPress={() => markAsUsed(item.id)}
							>
								<MaterialIcons name="check" size={16} color="white" />
								<Text style={[styles.actionButtonText, { color: 'white' }]}>Marcar Usada</Text>
							</TouchableOpacity>
						</>
					)}
					
					{item.status !== 'utilizada' && (
						<TouchableOpacity 
							style={[styles.actionButton, { backgroundColor: '#EF4444', borderColor: 'transparent' }]}
							onPress={() => cancelCortesia(item.id)}
						>
							<MaterialIcons name="cancel" size={16} color="white" />
							<Text style={[styles.actionButtonText, { color: 'white' }]}>Cancelar</Text>
						</TouchableOpacity>
					)}
				</View>
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

				<Text style={[styles.title, { color: colors.text }]}>Cortesias do Evento</Text>

				{/* Busca e filtros */}
				<View style={styles.searchContainer}>
					<View style={[styles.searchInput, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder }]}>
						<MaterialIcons name="search" size={20} color={colors.inputPlaceholder} />
						<TextInput
							style={[styles.searchText, { color: colors.inputText }]}
							placeholder="Buscar por nome, e-mail ou código..."
							placeholderTextColor={colors.inputPlaceholder}
							value={searchText}
							onChangeText={setSearchText}
						/>
					</View>
				</View>

				<View style={styles.filterContainer}>
					{[
						{ key: 'todos', label: 'Todos' },
						{ key: 'pendente', label: 'Pendentes' },
						{ key: 'utilizada', label: 'Utilizadas' },
						{ key: 'expirada', label: 'Expiradas' }
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
								{mockCortesias.filter(c => c.status === 'pendente').length}
							</Text>
							<Text style={[styles.statsLabel, { color: colors.cardMuted }]}>Pendentes</Text>
						</View>
						<View style={styles.statsItem}>
							<Text style={[styles.statsNumber, { color: colors.primary }]}>
								{mockCortesias.filter(c => c.status === 'utilizada').length}
							</Text>
							<Text style={[styles.statsLabel, { color: colors.cardMuted }]}>Utilizadas</Text>
						</View>
						<View style={styles.statsItem}>
							<Text style={[styles.statsNumber, { color: colors.primary }]}>
								R$ {mockCortesias.reduce((acc, c) => acc + c.valorEconomizado, 0).toFixed(0)}
							</Text>
							<Text style={[styles.statsLabel, { color: colors.cardMuted }]}>Valor total</Text>
						</View>
					</View>
				</View>

				{/* Lista de cortesias */}
				<FlatList
					data={filteredCortesias}
					keyExtractor={(item) => item.id}
					renderItem={renderCortesiaCard}
					contentContainerStyle={styles.listContainer}
					showsVerticalScrollIndicator={false}
					ListEmptyComponent={
						<View style={styles.emptyContainer}>
							<MaterialIcons name="card-giftcard" size={48} color={colors.cardMuted} />
							<Text style={[styles.emptyText, { color: colors.cardMuted }]}>
								Nenhuma cortesia encontrada
							</Text>
						</View>
					}
				/>
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
		gap: 8,
		marginBottom: 20
	},
	filterButton: {
		flex: 1,
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 12,
		borderWidth: 1,
		alignItems: 'center'
	},
	filterButtonText: {
		fontSize: 12,
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
	cortesiaCard: {
		padding: 16,
		borderRadius: 12,
		borderWidth: 1,
		gap: 16
	},
	cortesiaHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start'
	},
	cortesiaInfo: {
		flex: 1
	},
	cortesiaNome: {
		fontSize: 16,
		fontWeight: '700',
		marginBottom: 4
	},
	cortesiaCodigo: {
		fontSize: 14,
		fontWeight: '600',
		letterSpacing: 1
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
	cortesiaDetails: {
		gap: 8
	},
	detailRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8
	},
	detailText: {
		fontSize: 14,
		flex: 1
	},
	cortesiaStats: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		flexWrap: 'wrap',
		gap: 12
	},
	statItem: {
		alignItems: 'center',
		minWidth: 80
	},
	statLabel: {
		fontSize: 11,
		marginBottom: 4,
		textAlign: 'center'
	},
	statValue: {
		fontSize: 13,
		fontWeight: '600',
		textAlign: 'center'
	},
	observacoesContainer: {
		gap: 4
	},
	observacoesLabel: {
		fontSize: 12,
		fontWeight: '600'
	},
	observacoesText: {
		fontSize: 14,
		fontStyle: 'italic'
	},
	cortesiaActions: {
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
	emptyText: {
		fontSize: 16,
		fontWeight: '500'
	},
	shadow: {
		shadowColor: '#000',
		shadowOpacity: 0.08,
		shadowRadius: 8,
		shadowOffset: { width: 0, height: 2 },
		elevation: 2
	}
}); 