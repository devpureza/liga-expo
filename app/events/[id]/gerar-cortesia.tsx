import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import TabBar from '../../../components/TabBar';
import PrimaryButton from '../../../components/PrimaryButton';
import { CourtesyService } from '../../../services/courtesyService';
import { DispararCortesiaRequest } from '../../../types/api';
import { EventService } from '../../../services/eventService';
import { useEventDetails } from '../../../hooks/useEventDetails';

export default function GerarCortesiaScreen() {
	const { id: eventoId } = useLocalSearchParams<{ id: string }>();
	const { colors } = useTheme() as any;
	const [loading, setLoading] = useState(false);
	const [loadingData, setLoadingData] = useState(true);

	// Usar o hook para carregar detalhes do evento
	const { evento, loading: eventLoading, error: eventError } = useEventDetails(eventoId || '');

	// Estados do formulário
	const [formData, setFormData] = useState<DispararCortesiaRequest>({
		evento: eventoId || '',
		ingresso: '',
		lote_id: '',
		quantidade: 1,
		restricao_cpf: '',
		pode_transferir: false,
		observacao: ''
	});

	// Estados para os dados do evento
	const [ingressos, setIngressos] = useState<any[]>([]);
	const [lotes, setLotes] = useState<any[]>([]);
	
	// Estados para controlar dropdowns
	const [ingressosDropdownOpen, setIngressosDropdownOpen] = useState(false);
	const [lotesDropdownOpen, setLotesDropdownOpen] = useState(false);

	useEffect(() => {
		if (evento) {
			loadEventData();
		}
	}, [evento]);

	// Fechar dropdowns quando selecionar uma opção
	useEffect(() => {
		if (formData.ingresso) {
			setIngressosDropdownOpen(false);
		}
	}, [formData.ingresso]);

	useEffect(() => {
		if (formData.lote_id) {
			setLotesDropdownOpen(false);
		}
	}, [formData.lote_id]);

	async function loadEventData() {
		try {
			setLoadingData(true);
			
			// Carregar ingressos do evento
			const ingressosResult = await EventService.getEventTickets(eventoId || '');
			if (ingressosResult.success && ingressosResult.data) {
				setIngressos(ingressosResult.data);
			}

			// Carregar lotes do evento
			const lotesResult = await EventService.getEventLotes(eventoId || '');
			if (lotesResult.success && lotesResult.data) {
				setLotes(lotesResult.data);
			}
		} catch (error) {
			console.error('Erro ao carregar dados do evento:', error);
		} finally {
			setLoadingData(false);
		}
	}

	function goBack() {
		router.back();
	}

	function updateForm(field: keyof DispararCortesiaRequest, value: any) {
		setFormData(prev => ({
			...prev,
			[field]: value
		}));
	}

	function formatCPF(text: string) {
		// Remove tudo que não é número
		const numbers = text.replace(/\D/g, '');
		
		// Aplica máscara CPF: XXX.XXX.XXX-XX
		if (numbers.length <= 3) {
			return numbers;
		} else if (numbers.length <= 6) {
			return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
		} else if (numbers.length <= 9) {
			return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
		} else {
			return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
		}
	}

	async function handleSubmit() {
		// Validações básicas
		if (!formData.ingresso) {
			Alert.alert('Erro', 'Selecione um ingresso');
			return;
		}

		if (!formData.lote_id) {
			Alert.alert('Erro', 'Selecione um lote');
			return;
		}

		if (formData.quantidade <= 0) {
			Alert.alert('Erro', 'Quantidade deve ser maior que zero');
			return;
		}

		if (formData.restricao_cpf && formData.restricao_cpf.replace(/\D/g, '').length !== 11) {
			Alert.alert('Erro', 'CPF deve ter 11 dígitos');
			return;
		}

		try {
			setLoading(true);

			// Limpar CPF para envio (remover pontos e traços)
			const dataToSend = { ...formData };
			if (dataToSend.restricao_cpf) {
				dataToSend.restricao_cpf = dataToSend.restricao_cpf.replace(/\D/g, '');
			}

			const result = await CourtesyService.dispararCortesia(dataToSend);

			if (result.success) {
				Alert.alert(
					'Sucesso! 🎉',
					'Cortesia gerada com sucesso!',
					[
						{
							text: 'OK',
							onPress: () => router.back()
						}
					]
				);
			} else {
				Alert.alert('Erro', result.error || 'Erro ao gerar cortesia');
			}
		} catch (error) {
			console.error('Erro ao gerar cortesia:', error);
			Alert.alert('Erro', 'Erro interno. Tente novamente.');
		} finally {
			setLoading(false);
		}
	}

	if (eventLoading || loadingData) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ActivityIndicator size="large" color={colors.primary} />
				<Text style={[styles.loadingText, { color: colors.text }]}>
					{eventLoading ? 'Carregando evento...' : 'Carregando dados do evento...'}
				</Text>
			</View>
		);
	}

	if (eventError) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
				<MaterialIcons name="error" size={48} color={colors.error || '#EF4444'} />
				<Text style={[styles.errorTitle, { color: colors.text }]}>Erro ao carregar evento</Text>
				<Text style={[styles.errorText, { color: colors.mutedText }]}>{eventError}</Text>
				<TouchableOpacity 
					style={[styles.retryButton, { backgroundColor: colors.primary }]} 
					onPress={() => router.back()}
				>
					<Text style={[styles.retryButtonText, { color: colors.buttonTextOnPrimary }]}>Voltar</Text>
				</TouchableOpacity>
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

				<ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
					{/* Título */}
					<View style={styles.titleContainer}>
						<Text style={[styles.title, { color: colors.text }]}>Gerar Cortesia</Text>
						<Text style={[styles.subtitle, { color: colors.mutedText }]}>
							{evento?.nome || 'Evento'}
						</Text>
					</View>

					{/* Formulário */}
					<View style={styles.form}>
						{/* Ingresso */}
						<View style={styles.inputGroup}>
							<Text style={[styles.label, { color: colors.text }]}>Ingresso *</Text>
							<TouchableOpacity 
								style={[styles.pickerContainer, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder }]}
								onPress={() => setIngressosDropdownOpen(!ingressosDropdownOpen)}
							>
								<Text style={[styles.pickerText, { color: formData.ingresso ? colors.inputText : colors.inputPlaceholder }]}>
									{formData.ingresso ? ingressos.find(i => i.id === formData.ingresso)?.nome || 'Ingresso selecionado' : 'Selecione um ingresso'}
								</Text>
								<MaterialIcons 
									name={ingressosDropdownOpen ? "arrow-drop-up" : "arrow-drop-down"} 
									size={24} 
									color={colors.primary} 
								/>
							</TouchableOpacity>
							
							{/* Dropdown de opções */}
							{ingressosDropdownOpen && (
								<View style={[styles.dropdownOptions, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
									{ingressos.map((ingresso) => (
										<TouchableOpacity
											key={ingresso.id}
											style={[
												styles.dropdownOption,
												{ borderBottomColor: colors.cardBorder },
												formData.ingresso === ingresso.id && { backgroundColor: colors.primary + '20' }
											]}
											onPress={() => {
												updateForm('ingresso', ingresso.id);
												setIngressosDropdownOpen(false);
											}}
										>
											<Text style={[styles.dropdownOptionText, { color: colors.text }]}>{ingresso.nome}</Text>
											<Text style={[styles.dropdownOptionSubtext, { color: colors.mutedText }]}>
												R$ {ingresso.valor ? Number(ingresso.valor).toFixed(2) : '0.00'}
											</Text>
										</TouchableOpacity>
									))}
								</View>
							)}
						</View>

						{/* Lote */}
						<View style={styles.inputGroup}>
							<Text style={[styles.label, { color: colors.text }]}>Lote *</Text>
							<TouchableOpacity 
								style={[styles.pickerContainer, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder }]}
								onPress={() => setLotesDropdownOpen(!lotesDropdownOpen)}
							>
								<Text style={[styles.pickerText, { color: formData.lote_id ? colors.inputText : colors.inputPlaceholder }]}>
									{formData.lote_id ? lotes.find(l => l.id === formData.lote_id)?.nome || 'Lote selecionado' : 'Selecione um lote'}
								</Text>
								<MaterialIcons 
									name={lotesDropdownOpen ? "arrow-drop-up" : "arrow-drop-down"} 
									size={24} 
									color={colors.primary} 
								/>
							</TouchableOpacity>
							
							{/* Dropdown de opções */}
							{lotesDropdownOpen && (
								<View style={[styles.dropdownOptions, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
									{lotes.map((lote) => (
										<TouchableOpacity
											key={lote.id}
											style={[
												styles.dropdownOption,
												{ borderBottomColor: colors.cardBorder },
												formData.lote_id === lote.id && { backgroundColor: colors.primary + '20' }
											]}
											onPress={() => {
												updateForm('lote_id', lote.id);
												setLotesDropdownOpen(false);
											}}
										>
											<Text style={[styles.dropdownOptionText, { color: colors.text }]}>{lote.nome}</Text>
											<Text style={[styles.dropdownOptionSubtext, { color: colors.mutedText }]}>
												R$ {lote.valor ? Number(lote.valor).toFixed(2) : '0.00'}
											</Text>
										</TouchableOpacity>
									))}
								</View>
							)}
						</View>

						{/* Quantidade */}
						<View style={styles.inputGroup}>
							<Text style={[styles.label, { color: colors.text }]}>Quantidade *</Text>
							<TextInput
								style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
								value={formData.quantidade.toString()}
								onChangeText={(text) => updateForm('quantidade', parseInt(text) || 1)}
								placeholder="1"
								placeholderTextColor={colors.inputPlaceholder}
								keyboardType="numeric"
							/>
						</View>

						{/* CPF de Restrição */}
						<View style={styles.inputGroup}>
							<Text style={[styles.label, { color: colors.text }]}>CPF de Restrição (opcional)</Text>
							<TextInput
								style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
								value={formData.restricao_cpf}
								onChangeText={(text) => updateForm('restricao_cpf', formatCPF(text))}
								placeholder="000.000.000-00"
								placeholderTextColor={colors.inputPlaceholder}
								keyboardType="numeric"
								maxLength={14}
							/>
							<Text style={[styles.helpText, { color: colors.mutedText }]}>
								Deixe vazio para cortesia sem restrição de CPF
							</Text>
						</View>

						{/* Pode Transferir */}
						<View style={styles.inputGroup}>
							<Text style={[styles.label, { color: colors.text }]}>Pode Transferir</Text>
							<View style={styles.toggleContainer}>
								<TouchableOpacity
									style={[
										styles.toggleOption,
										{ backgroundColor: colors.card, borderColor: colors.cardBorder },
										!formData.pode_transferir && { backgroundColor: colors.primary }
									]}
									onPress={() => updateForm('pode_transferir', false)}
								>
									<Text style={[
										styles.toggleText,
										{ color: !formData.pode_transferir ? colors.buttonTextOnPrimary : colors.text }
									]}>
										Não
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[
										styles.toggleOption,
										{ backgroundColor: colors.card, borderColor: colors.cardBorder },
										formData.pode_transferir && { backgroundColor: colors.primary }
									]}
									onPress={() => updateForm('pode_transferir', true)}
								>
									<Text style={[
										styles.toggleText,
										{ color: formData.pode_transferir ? colors.buttonTextOnPrimary : colors.text }
									]}>
										Sim
									</Text>
								</TouchableOpacity>
							</View>
						</View>

						{/* Observação */}
						<View style={styles.inputGroup}>
							<Text style={[styles.label, { color: colors.text }]}>Observação (opcional)</Text>
							<TextInput
								style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
								value={formData.observacao}
								onChangeText={(text) => updateForm('observacao', text)}
								placeholder="Observações sobre a cortesia..."
								placeholderTextColor={colors.inputPlaceholder}
								multiline
								numberOfLines={3}
							/>
						</View>

						{/* Botão de Envio */}
						<PrimaryButton
							onPress={handleSubmit}
							loading={loading}
							style={styles.submitButton}
						>
							{loading ? 'Gerando...' : 'Gerar Cortesia'}
						</PrimaryButton>
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
	scrollView: {
		flex: 1
	},
	titleContainer: {
		alignItems: 'center',
		marginBottom: 32
	},
	title: {
		fontSize: 24,
		fontWeight: '700',
		marginBottom: 8
	},
	subtitle: {
		fontSize: 16,
		textAlign: 'center'
	},
	form: {
		gap: 20
	},
	inputGroup: {
		gap: 8
	},
	label: {
		fontSize: 14,
		fontWeight: '600'
	},
	input: {
		padding: 16,
		borderRadius: 12,
		borderWidth: 1,
		fontSize: 16
	},
	pickerContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 16,
		borderRadius: 12,
		borderWidth: 1,
		fontSize: 16
	},
	pickerText: {
		flex: 1
	},
	optionItem: {
		padding: 12,
		borderRadius: 8,
		borderWidth: 1,
		marginTop: 4
	},
	optionText: {
		fontSize: 14,
		fontWeight: '600'
	},
	optionSubtext: {
		fontSize: 12,
		marginTop: 2
	},
	toggleContainer: {
		flexDirection: 'row',
		gap: 12
	},
	toggleOption: {
		flex: 1,
		padding: 16,
		borderRadius: 12,
		borderWidth: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	toggleText: {
		fontSize: 14,
		fontWeight: '600'
	},
	helpText: {
		fontSize: 12,
		fontStyle: 'italic'
	},
	submitButton: {
		marginTop: 20,
		paddingVertical: 16
	},
	loadingText: {
		marginTop: 16,
		fontSize: 16
	},
	errorTitle: {
		fontSize: 18,
		fontWeight: '700',
		marginTop: 16,
		marginBottom: 8
	},
	errorText: {
		fontSize: 14,
		textAlign: 'center',
		marginBottom: 20
	},
	retryButton: {
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 12
	},
	retryButtonText: {
		fontSize: 16,
		fontWeight: '600'
	},
	dropdownOptions: {
		position: 'absolute',
		top: '100%',
		left: 0,
		right: 0,
		borderRadius: 12,
		borderWidth: 1,
		borderTopWidth: 0,
		zIndex: 10,
		maxHeight: 200,
		overflow: 'hidden',
		elevation: 5,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4
	},
	dropdownOption: {
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderBottomWidth: 1,
		backgroundColor: 'transparent'
	},
	dropdownOptionText: {
		fontSize: 14,
		fontWeight: '600'
	},
	dropdownOptionSubtext: {
		fontSize: 12,
		marginTop: 2,
		opacity: 0.7
	}
}); 