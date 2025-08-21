import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, TextInput, Alert, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import TabBar from '../../../components/TabBar';
import PrimaryButton from '../../../components/PrimaryButton';

type EventoData = {
	nome: string;
	visibilidade: 'publico' | 'privado';
	status: 'vendendo' | 'fechado';
	quantidadeCompra: string;
	quantidadePorCpf: string;
	inicio: string;
	encerramento: string;
	aberturaPortoes: string;
	limiteTransferencias: string;
	descricao: string;
	imagem: string | null;
};

export default function EditarEventoScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { colors } = useTheme() as any;
	const [salvando, setSalvando] = useState(false);

	// Mock de dados do evento
	const [eventoData, setEventoData] = useState<EventoData>({
		nome: 'Festival de Música LIGA 2024',
		visibilidade: 'publico',
		status: 'vendendo',
		quantidadeCompra: '10',
		quantidadePorCpf: '4',
		inicio: '25/12/2024 20:00',
		encerramento: '26/12/2024 04:00',
		aberturaPortoes: '25/12/2024 18:00',
		limiteTransferencias: '24/12/2024 23:59',
		descricao: 'O maior festival de música da região com artistas nacionais e internacionais.',
		imagem: null
	});

	function goBack() {
		router.back();
	}

	function selecionarImagem() {
		if (Platform.OS === 'web') {
			Alert.alert('Funcionalidade não disponível na web', 'O upload de imagem funciona apenas em dispositivos móveis.');
			return;
		}

		Alert.alert(
			'Selecionar Imagem',
			'Escolha uma opção para adicionar a imagem do evento (1920x1080):',
			[
				{ text: 'Cancelar', style: 'cancel' },
				{ text: 'Câmera', onPress: () => simularUpload('camera') },
				{ text: 'Galeria', onPress: () => simularUpload('galeria') }
			]
		);
	}

	function simularUpload(origem: string) {
		// Simular upload de imagem
		setTimeout(() => {
			setEventoData(prev => ({ 
				...prev, 
				imagem: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...' 
			}));
			Alert.alert('Sucesso', `Imagem carregada da ${origem} com sucesso!`);
		}, 1500);
	}

	function removerImagem() {
		setEventoData(prev => ({ ...prev, imagem: null }));
	}

	function salvarEvento() {
		if (!eventoData.nome.trim()) {
			Alert.alert('Erro', 'Nome do evento é obrigatório.');
			return;
		}

		setSalvando(true);
		
		// Simular salvamento
		setTimeout(() => {
			setSalvando(false);
			Alert.alert(
				'Evento atualizado! ✅',
				'As informações do evento foram salvas com sucesso.',
				[{ text: 'OK', onPress: goBack }]
			);
		}, 2000);
	}

	function renderToggleButton(
		label: string, 
		value: string, 
		currentValue: string, 
		onPress: () => void
	) {
		const isSelected = currentValue === value;
		return (
			<TouchableOpacity
				style={[
					styles.toggleOption,
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

				<Text style={[styles.title, { color: colors.text }]}>Editar Evento</Text>

				<ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
					<View style={styles.content}>
						{/* Informações Básicas */}
						<View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
							<Text style={[styles.sectionTitle, { color: colors.cardText }]}>Informações Básicas</Text>
							
							<View style={styles.field}>
								<Text style={[styles.label, { color: colors.cardText }]}>Nome do Evento *</Text>
								<TextInput
									style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
									placeholder="Nome do evento"
									placeholderTextColor={colors.inputPlaceholder}
									value={eventoData.nome}
									onChangeText={(text) => setEventoData(prev => ({ ...prev, nome: text }))}
								/>
							</View>

							<View style={styles.field}>
								<Text style={[styles.label, { color: colors.cardText }]}>Visibilidade</Text>
								<View style={styles.toggleContainer}>
									{renderToggleButton(
										'Público', 
										'publico', 
										eventoData.visibilidade, 
										() => setEventoData(prev => ({ ...prev, visibilidade: 'publico' }))
									)}
									{renderToggleButton(
										'Privado', 
										'privado', 
										eventoData.visibilidade, 
										() => setEventoData(prev => ({ ...prev, visibilidade: 'privado' }))
									)}
								</View>
							</View>

							<View style={styles.field}>
								<Text style={[styles.label, { color: colors.cardText }]}>Status de Vendas</Text>
								<View style={styles.toggleContainer}>
									{renderToggleButton(
										'Vendendo', 
										'vendendo', 
										eventoData.status, 
										() => setEventoData(prev => ({ ...prev, status: 'vendendo' }))
									)}
									{renderToggleButton(
										'Fechado', 
										'fechado', 
										eventoData.status, 
										() => setEventoData(prev => ({ ...prev, status: 'fechado' }))
									)}
								</View>
							</View>
						</View>

						{/* Configurações de Compra */}
						<View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
							<Text style={[styles.sectionTitle, { color: colors.cardText }]}>Configurações de Compra</Text>
							
							<View style={styles.field}>
								<Text style={[styles.label, { color: colors.cardText }]}>Quantidade máxima por compra</Text>
								<TextInput
									style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
									placeholder="Ex: 10"
									placeholderTextColor={colors.inputPlaceholder}
									value={eventoData.quantidadeCompra}
									onChangeText={(text) => setEventoData(prev => ({ ...prev, quantidadeCompra: text }))}
									keyboardType="numeric"
								/>
							</View>

							<View style={styles.field}>
								<Text style={[styles.label, { color: colors.cardText }]}>Quantidade máxima por CPF</Text>
								<TextInput
									style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
									placeholder="Ex: 4"
									placeholderTextColor={colors.inputPlaceholder}
									value={eventoData.quantidadePorCpf}
									onChangeText={(text) => setEventoData(prev => ({ ...prev, quantidadePorCpf: text }))}
									keyboardType="numeric"
								/>
							</View>
						</View>

						{/* Datas e Horários */}
						<View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
							<Text style={[styles.sectionTitle, { color: colors.cardText }]}>Datas e Horários</Text>
							
							<View style={styles.field}>
								<Text style={[styles.label, { color: colors.cardText }]}>Início do Evento</Text>
								<TextInput
									style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
									placeholder="DD/MM/AAAA HH:MM"
									placeholderTextColor={colors.inputPlaceholder}
									value={eventoData.inicio}
									onChangeText={(text) => setEventoData(prev => ({ ...prev, inicio: text }))}
								/>
							</View>

							<View style={styles.field}>
								<Text style={[styles.label, { color: colors.cardText }]}>Encerramento do Evento</Text>
								<TextInput
									style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
									placeholder="DD/MM/AAAA HH:MM"
									placeholderTextColor={colors.inputPlaceholder}
									value={eventoData.encerramento}
									onChangeText={(text) => setEventoData(prev => ({ ...prev, encerramento: text }))}
								/>
							</View>

							<View style={styles.field}>
								<Text style={[styles.label, { color: colors.cardText }]}>Abertura dos Portões</Text>
								<TextInput
									style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
									placeholder="DD/MM/AAAA HH:MM"
									placeholderTextColor={colors.inputPlaceholder}
									value={eventoData.aberturaPortoes}
									onChangeText={(text) => setEventoData(prev => ({ ...prev, aberturaPortoes: text }))}
								/>
							</View>

							<View style={styles.field}>
								<Text style={[styles.label, { color: colors.cardText }]}>Limite para Transferências</Text>
								<TextInput
									style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
									placeholder="DD/MM/AAAA HH:MM"
									placeholderTextColor={colors.inputPlaceholder}
									value={eventoData.limiteTransferencias}
									onChangeText={(text) => setEventoData(prev => ({ ...prev, limiteTransferencias: text }))}
								/>
							</View>
						</View>

						{/* Descrição e Imagem */}
						<View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
							<Text style={[styles.sectionTitle, { color: colors.cardText }]}>Descrição e Imagem</Text>
							
							<View style={styles.field}>
								<Text style={[styles.label, { color: colors.cardText }]}>Descrição do Evento</Text>
								<TextInput
									style={[styles.textArea, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
									placeholder="Descreva o evento..."
									placeholderTextColor={colors.inputPlaceholder}
									value={eventoData.descricao}
									onChangeText={(text) => setEventoData(prev => ({ ...prev, descricao: text }))}
									multiline
									numberOfLines={4}
									textAlignVertical="top"
								/>
							</View>

							<View style={styles.field}>
								<Text style={[styles.label, { color: colors.cardText }]}>Imagem do Evento (1920x1080)</Text>
								
								{eventoData.imagem ? (
									<View style={styles.imagemContainer}>
										<View style={[styles.imagemPreview, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder }]}>
											<MaterialIcons name="image" size={48} color={colors.cardMuted} />
											<Text style={[styles.imagemText, { color: colors.cardText }]}>Imagem carregada</Text>
										</View>
										<TouchableOpacity 
											onPress={removerImagem}
											style={[styles.removerImagemButton, { backgroundColor: '#EF4444' }]}
										>
											<MaterialIcons name="delete" size={20} color="white" />
											<Text style={styles.removerImagemText}>Remover</Text>
										</TouchableOpacity>
									</View>
								) : (
									<TouchableOpacity 
										onPress={selecionarImagem}
										style={[styles.uploadButton, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder }]}
									>
										<MaterialIcons name="cloud-upload" size={32} color={colors.cardMuted} />
										<Text style={[styles.uploadText, { color: colors.cardMuted }]}>
											{Platform.OS === 'web' ? 'Disponível apenas no app' : 'Selecionar Imagem'}
										</Text>
									</TouchableOpacity>
								)}
							</View>
						</View>

						<PrimaryButton 
							onPress={salvarEvento} 
							loading={salvando}
							style={styles.salvarButton}
						>
							{salvando ? 'Salvando...' : 'Salvar Alterações'}
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
		gap: 20
	},
	section: {
		padding: 16,
		borderRadius: 12,
		borderWidth: 1,
		gap: 16
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: '700'
	},
	field: {
		gap: 8
	},
	label: {
		fontSize: 14,
		fontWeight: '600'
	},
	input: {
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderRadius: 8,
		borderWidth: 1,
		fontSize: 16
	},
	textArea: {
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderRadius: 8,
		borderWidth: 1,
		fontSize: 16,
		minHeight: 100
	},
	toggleContainer: {
		flexDirection: 'row',
		gap: 12
	},
	toggleOption: {
		flex: 1,
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderRadius: 8,
		borderWidth: 1,
		alignItems: 'center'
	},
	toggleText: {
		fontSize: 14,
		fontWeight: '600'
	},
	imagemContainer: {
		gap: 12
	},
	imagemPreview: {
		padding: 20,
		borderRadius: 8,
		borderWidth: 1,
		alignItems: 'center',
		gap: 8
	},
	imagemText: {
		fontSize: 14,
		fontWeight: '600'
	},
	uploadButton: {
		padding: 20,
		borderRadius: 8,
		borderWidth: 2,
		borderStyle: 'dashed',
		alignItems: 'center',
		gap: 8
	},
	uploadText: {
		fontSize: 14,
		fontWeight: '600'
	},
	removerImagemButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderRadius: 8
	},
	removerImagemText: {
		color: 'white',
		fontSize: 14,
		fontWeight: '600'
	},
	salvarButton: {
		marginTop: 20,
		paddingVertical: 16
	}
}); 