import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, TextInput, Alert, FlatList } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import TabBar from '../../../components/TabBar';
import PrimaryButton from '../../../components/PrimaryButton';

type Lote = {
	id: string;
	nome: string;
	status: 'vendendo' | 'fechado';
	inicio: string;
	termino: string;
	pontosVenda: ('web' | 'app')[];
	valorTotal: string;
	quantidade: string;
};

type Ingresso = {
	id: string;
	nome: string;
	tipo: 'inteira' | 'meia';
	quantidade: string;
	maximoPorCompra: string;
	maximoPorCpf: string;
	inicioVendas: string;
	terminoVendas: string;
	idade: string;
	lotes: Lote[];
};

export default function IngressosScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { colors } = useTheme() as any;
	const [ingressoSelecionado, setIngressoSelecionado] = useState<string | null>(null);
	const [loteExpandido, setLoteExpandido] = useState<string | null>(null);

	// Mock de dados de ingressos
	const [ingressos, setIngressos] = useState<Ingresso[]>([
		{
			id: '1',
			nome: 'Pista',
			tipo: 'inteira',
			quantidade: '2000',
			maximoPorCompra: '10',
			maximoPorCpf: '4',
			inicioVendas: '01/11/2024 10:00',
			terminoVendas: '25/12/2024 23:59',
			idade: '18',
			lotes: [
				{
					id: '1a',
					nome: '1º Lote',
					status: 'fechado',
					inicio: '01/11/2024 10:00',
					termino: '01/12/2024 23:59',
					pontosVenda: ['web', 'app'],
					valorTotal: '80.00',
					quantidade: '500'
				},
				{
					id: '1b',
					nome: '2º Lote',
					status: 'vendendo',
					inicio: '02/12/2024 00:00',
					termino: '20/12/2024 23:59',
					pontosVenda: ['web', 'app'],
					valorTotal: '100.00',
					quantidade: '1000'
				}
			]
		},
		{
			id: '2',
			nome: 'VIP',
			tipo: 'inteira',
			quantidade: '200',
			maximoPorCompra: '4',
			maximoPorCpf: '2',
			inicioVendas: '01/11/2024 10:00',
			terminoVendas: '25/12/2024 23:59',
			idade: '18',
			lotes: [
				{
					id: '2a',
					nome: 'Único Lote',
					status: 'vendendo',
					inicio: '01/11/2024 10:00',
					termino: '25/12/2024 23:59',
					pontosVenda: ['web'],
					valorTotal: '150.00',
					quantidade: '200'
				}
			]
		}
	]);

	function goBack() {
		router.back();
	}

	function editarIngresso(ingressoId: string) {
		setIngressoSelecionado(ingressoSelecionado === ingressoId ? null : ingressoId);
	}

	function salvarIngresso(ingressoId: string) {
		Alert.alert('Sucesso', 'Ingresso atualizado com sucesso!');
		setIngressoSelecionado(null);
	}

	function editarLote(loteId: string) {
		setLoteExpandido(loteExpandido === loteId ? null : loteId);
	}

	function salvarLote(loteId: string) {
		Alert.alert('Sucesso', 'Lote atualizado com sucesso!');
		setLoteExpandido(null);
	}

	function updateIngressoField(ingressoId: string, field: keyof Ingresso, value: any) {
		setIngressos(prev => prev.map(ingresso => 
			ingresso.id === ingressoId ? { ...ingresso, [field]: value } : ingresso
		));
	}

	function updateLoteField(ingressoId: string, loteId: string, field: keyof Lote, value: any) {
		setIngressos(prev => prev.map(ingresso => 
			ingresso.id === ingressoId ? {
				...ingresso,
				lotes: ingresso.lotes.map(lote => 
					lote.id === loteId ? { ...lote, [field]: value } : lote
				)
			} : ingresso
		));
	}

	function renderToggleButton(
		label: string, 
		value: string, 
		currentValue: string, 
		onPress: () => void,
		small: boolean = false
	) {
		const isSelected = currentValue === value;
		return (
			<TouchableOpacity
				style={[
					small ? styles.toggleOptionSmall : styles.toggleOption,
					{
						backgroundColor: isSelected ? colors.primary : colors.card,
						borderColor: isSelected ? colors.primary : colors.cardBorder
					}
				]}
				onPress={onPress}
			>
				<Text style={[
					styles.toggleText,
					{ color: isSelected ? colors.buttonTextOnPrimary : colors.cardText }
				]}>
					{label}
				</Text>
			</TouchableOpacity>
		);
	}

	function renderPontoVendaButton(ponto: 'web' | 'app', pontosAtivos: ('web' | 'app')[], onChange: (pontos: ('web' | 'app')[]) => void) {
		const isSelected = pontosAtivos.includes(ponto);
		
		return (
			<TouchableOpacity
				style={[
					styles.pontoVendaButton,
					{
						backgroundColor: isSelected ? colors.primary : colors.card,
						borderColor: isSelected ? colors.primary : colors.cardBorder
					}
				]}
				onPress={() => {
					if (isSelected) {
						onChange(pontosAtivos.filter(p => p !== ponto));
					} else {
						onChange([...pontosAtivos, ponto]);
					}
				}}
			>
				<MaterialIcons 
					name={ponto === 'web' ? 'web' : 'smartphone'} 
					size={16} 
					color={isSelected ? colors.buttonTextOnPrimary : colors.cardText} 
				/>
				<Text style={[
					styles.pontoVendaText,
					{ color: isSelected ? colors.buttonTextOnPrimary : colors.cardText }
				]}>
					{ponto === 'web' ? 'Web' : 'App'}
				</Text>
			</TouchableOpacity>
		);
	}

	function renderLote(lote: Lote, ingressoId: string) {
		const isExpanded = loteExpandido === lote.id;
		
		return (
			<View key={lote.id} style={[styles.loteCard, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder }]}>
				<TouchableOpacity
					style={styles.loteHeader}
					onPress={() => editarLote(lote.id)}
				>
					<View style={styles.loteInfo}>
						<Text style={[styles.loteNome, { color: colors.cardText }]}>{lote.nome}</Text>
						<View style={[styles.statusBadge, { backgroundColor: lote.status === 'vendendo' ? '#10B981' : '#EF4444' }]}>
							<Text style={styles.statusText}>
								{lote.status === 'vendendo' ? 'Vendendo' : 'Fechado'}
							</Text>
						</View>
					</View>
					<MaterialIcons 
						name={isExpanded ? 'expand-less' : 'expand-more'} 
						size={24} 
						color={colors.cardMuted} 
					/>
				</TouchableOpacity>

				{isExpanded && (
					<View style={styles.loteForm}>
						<View style={styles.field}>
							<Text style={[styles.label, { color: colors.cardText }]}>Nome do Lote</Text>
							<TextInput
								style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
								value={lote.nome}
								onChangeText={(text) => updateLoteField(ingressoId, lote.id, 'nome', text)}
							/>
						</View>

						<View style={styles.field}>
							<Text style={[styles.label, { color: colors.cardText }]}>Status</Text>
							<View style={styles.toggleContainer}>
								{renderToggleButton(
									'Vendendo', 
									'vendendo', 
									lote.status, 
									() => updateLoteField(ingressoId, lote.id, 'status', 'vendendo'),
									true
								)}
								{renderToggleButton(
									'Fechado', 
									'fechado', 
									lote.status, 
									() => updateLoteField(ingressoId, lote.id, 'status', 'fechado'),
									true
								)}
							</View>
						</View>

						<View style={styles.fieldRow}>
							<View style={[styles.field, { flex: 1 }]}>
								<Text style={[styles.label, { color: colors.cardText }]}>Início</Text>
								<TextInput
									style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
									placeholder="DD/MM/AAAA HH:MM"
									value={lote.inicio}
									onChangeText={(text) => updateLoteField(ingressoId, lote.id, 'inicio', text)}
								/>
							</View>
							<View style={[styles.field, { flex: 1 }]}>
								<Text style={[styles.label, { color: colors.cardText }]}>Término</Text>
								<TextInput
									style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
									placeholder="DD/MM/AAAA HH:MM"
									value={lote.termino}
									onChangeText={(text) => updateLoteField(ingressoId, lote.id, 'termino', text)}
								/>
							</View>
						</View>

						<View style={styles.field}>
							<Text style={[styles.label, { color: colors.cardText }]}>Pontos de Venda</Text>
							<View style={styles.pontosVendaContainer}>
								{renderPontoVendaButton(
									'web', 
									lote.pontosVenda, 
									(pontos) => updateLoteField(ingressoId, lote.id, 'pontosVenda', pontos)
								)}
								{renderPontoVendaButton(
									'app', 
									lote.pontosVenda, 
									(pontos) => updateLoteField(ingressoId, lote.id, 'pontosVenda', pontos)
								)}
							</View>
						</View>

						<View style={styles.fieldRow}>
							<View style={[styles.field, { flex: 1 }]}>
								<Text style={[styles.label, { color: colors.cardText }]}>Valor Total (R$)</Text>
								<TextInput
									style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
									placeholder="0.00"
									value={lote.valorTotal}
									onChangeText={(text) => updateLoteField(ingressoId, lote.id, 'valorTotal', text)}
									keyboardType="numeric"
								/>
							</View>
							<View style={[styles.field, { flex: 1 }]}>
								<Text style={[styles.label, { color: colors.cardText }]}>Quantidade</Text>
								<TextInput
									style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
									placeholder="0"
									value={lote.quantidade}
									onChangeText={(text) => updateLoteField(ingressoId, lote.id, 'quantidade', text)}
									keyboardType="numeric"
								/>
							</View>
						</View>

						<TouchableOpacity
							style={[styles.salvarLoteButton, { backgroundColor: colors.primary }]}
							onPress={() => salvarLote(lote.id)}
						>
							<Text style={[styles.salvarLoteText, { color: colors.buttonTextOnPrimary }]}>
								Salvar Lote
							</Text>
						</TouchableOpacity>
					</View>
				)}
			</View>
		);
	}

	function renderIngresso(ingresso: Ingresso) {
		const isExpanded = ingressoSelecionado === ingresso.id;
		
		return (
			<View style={[styles.ingressoCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }, styles.shadow]}>
				<TouchableOpacity
					style={styles.ingressoHeader}
					onPress={() => editarIngresso(ingresso.id)}
				>
					<View style={styles.ingressoInfo}>
						<Text style={[styles.ingressoNome, { color: colors.cardText }]}>{ingresso.nome}</Text>
						<Text style={[styles.ingressoTipo, { color: colors.cardMuted }]}>
							{ingresso.tipo === 'inteira' ? 'Inteira' : 'Meia'} • {ingresso.quantidade} ingressos
						</Text>
					</View>
					<MaterialIcons 
						name={isExpanded ? 'expand-less' : 'expand-more'} 
						size={24} 
						color={colors.cardMuted} 
					/>
				</TouchableOpacity>

				{isExpanded && (
					<View style={styles.ingressoForm}>
						<View style={styles.field}>
							<Text style={[styles.label, { color: colors.cardText }]}>Nome do Ingresso</Text>
							<TextInput
								style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
								value={ingresso.nome}
								onChangeText={(text) => updateIngressoField(ingresso.id, 'nome', text)}
							/>
						</View>

						<View style={styles.field}>
							<Text style={[styles.label, { color: colors.cardText }]}>Tipo</Text>
							<View style={styles.toggleContainer}>
								{renderToggleButton(
									'Inteira', 
									'inteira', 
									ingresso.tipo, 
									() => updateIngressoField(ingresso.id, 'tipo', 'inteira')
								)}
								{renderToggleButton(
									'Meia', 
									'meia', 
									ingresso.tipo, 
									() => updateIngressoField(ingresso.id, 'tipo', 'meia')
								)}
							</View>
						</View>

						<View style={styles.fieldRow}>
							<View style={[styles.field, { flex: 1 }]}>
								<Text style={[styles.label, { color: colors.cardText }]}>Quantidade Total</Text>
								<TextInput
									style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
									value={ingresso.quantidade}
									onChangeText={(text) => updateIngressoField(ingresso.id, 'quantidade', text)}
									keyboardType="numeric"
								/>
							</View>
							<View style={[styles.field, { flex: 1 }]}>
								<Text style={[styles.label, { color: colors.cardText }]}>Idade Mínima</Text>
								<TextInput
									style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
									value={ingresso.idade}
									onChangeText={(text) => updateIngressoField(ingresso.id, 'idade', text)}
									keyboardType="numeric"
								/>
							</View>
						</View>

						<View style={styles.fieldRow}>
							<View style={[styles.field, { flex: 1 }]}>
								<Text style={[styles.label, { color: colors.cardText }]}>Máx por Compra</Text>
								<TextInput
									style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
									value={ingresso.maximoPorCompra}
									onChangeText={(text) => updateIngressoField(ingresso.id, 'maximoPorCompra', text)}
									keyboardType="numeric"
								/>
							</View>
							<View style={[styles.field, { flex: 1 }]}>
								<Text style={[styles.label, { color: colors.cardText }]}>Máx por CPF</Text>
								<TextInput
									style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
									value={ingresso.maximoPorCpf}
									onChangeText={(text) => updateIngressoField(ingresso.id, 'maximoPorCpf', text)}
									keyboardType="numeric"
								/>
							</View>
						</View>

						<View style={styles.fieldRow}>
							<View style={[styles.field, { flex: 1 }]}>
								<Text style={[styles.label, { color: colors.cardText }]}>Início Vendas</Text>
								<TextInput
									style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
									placeholder="DD/MM/AAAA HH:MM"
									value={ingresso.inicioVendas}
									onChangeText={(text) => updateIngressoField(ingresso.id, 'inicioVendas', text)}
								/>
							</View>
							<View style={[styles.field, { flex: 1 }]}>
								<Text style={[styles.label, { color: colors.cardText }]}>Término Vendas</Text>
								<TextInput
									style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
									placeholder="DD/MM/AAAA HH:MM"
									value={ingresso.terminoVendas}
									onChangeText={(text) => updateIngressoField(ingresso.id, 'terminoVendas', text)}
								/>
							</View>
						</View>

						{/* Lotes */}
						<View style={styles.lotesSection}>
							<Text style={[styles.lotesTitle, { color: colors.cardText }]}>Lotes</Text>
							{ingresso.lotes.map(lote => renderLote(lote, ingresso.id))}
						</View>

						<TouchableOpacity
							style={[styles.salvarButton, { backgroundColor: colors.primary }]}
							onPress={() => salvarIngresso(ingresso.id)}
						>
							<Text style={[styles.salvarText, { color: colors.buttonTextOnPrimary }]}>
								Salvar Ingresso
							</Text>
						</TouchableOpacity>
					</View>
				)}
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

				<Text style={[styles.title, { color: colors.text }]}>Gestão de Ingressos</Text>

				<ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
					<View style={styles.content}>
						{ingressos.map(renderIngresso)}
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
		marginBottom: 20,
		textAlign: 'center'
	},
	scrollView: {
		flex: 1
	},
	content: {
		paddingBottom: 100,
		gap: 16
	},
	ingressoCard: {
		borderRadius: 12,
		borderWidth: 1,
		overflow: 'hidden'
	},
	ingressoHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 16
	},
	ingressoInfo: {
		flex: 1
	},
	ingressoNome: {
		fontSize: 16,
		fontWeight: '700',
		marginBottom: 4
	},
	ingressoTipo: {
		fontSize: 14
	},
	ingressoForm: {
		padding: 16,
		borderTopWidth: 1,
		borderTopColor: '#E5E7EB',
		gap: 16
	},
	field: {
		gap: 8
	},
	fieldRow: {
		flexDirection: 'row',
		gap: 12
	},
	label: {
		fontSize: 14,
		fontWeight: '600'
	},
	input: {
		paddingHorizontal: 12,
		paddingVertical: 10,
		borderRadius: 8,
		borderWidth: 1,
		fontSize: 14
	},
	toggleContainer: {
		flexDirection: 'row',
		gap: 8
	},
	toggleOption: {
		flex: 1,
		paddingVertical: 10,
		paddingHorizontal: 12,
		borderRadius: 8,
		borderWidth: 1,
		alignItems: 'center'
	},
	toggleOptionSmall: {
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 6,
		borderWidth: 1,
		alignItems: 'center',
		minWidth: 80
	},
	toggleText: {
		fontSize: 14,
		fontWeight: '600'
	},
	pontosVendaContainer: {
		flexDirection: 'row',
		gap: 8
	},
	pontoVendaButton: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 6,
		borderWidth: 1
	},
	pontoVendaText: {
		fontSize: 12,
		fontWeight: '600'
	},
	lotesSection: {
		gap: 12
	},
	lotesTitle: {
		fontSize: 16,
		fontWeight: '700'
	},
	loteCard: {
		borderRadius: 8,
		borderWidth: 1,
		overflow: 'hidden'
	},
	loteHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 12
	},
	loteInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
		flex: 1
	},
	loteNome: {
		fontSize: 14,
		fontWeight: '600'
	},
	statusBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 4
	},
	statusText: {
		color: 'white',
		fontSize: 11,
		fontWeight: '600'
	},
	loteForm: {
		padding: 12,
		borderTopWidth: 1,
		borderTopColor: '#E5E7EB',
		gap: 12
	},
	salvarButton: {
		paddingVertical: 12,
		borderRadius: 8,
		alignItems: 'center',
		marginTop: 8
	},
	salvarText: {
		fontSize: 16,
		fontWeight: '700'
	},
	salvarLoteButton: {
		paddingVertical: 10,
		borderRadius: 6,
		alignItems: 'center',
		marginTop: 4
	},
	salvarLoteText: {
		fontSize: 14,
		fontWeight: '600'
	},
	shadow: {
		shadowColor: '#000',
		shadowOpacity: 0.08,
		shadowRadius: 8,
		shadowOffset: { width: 0, height: 2 },
		elevation: 2
	}
}); 