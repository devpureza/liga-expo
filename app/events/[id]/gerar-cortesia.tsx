import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import PrimaryButton from '../../../components/PrimaryButton';
import TabBar from '../../../components/TabBar';

export default function GerarCortesiaScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { colors } = useTheme() as any;

	const [formData, setFormData] = useState({
		nomeConvidado: '',
		email: '',
		telefone: '',
		documento: '',
		setor: 'pista', // pista, vip, camarote
		quantidade: '1',
		observacoes: '',
		enviarPorEmail: true
	});

	const setores = [
		{ id: 'pista', nome: 'Pista', preco: 'R$ 80,00' },
		{ id: 'vip', nome: 'VIP', preco: 'R$ 150,00' },
		{ id: 'camarote', nome: 'Camarote', preco: 'R$ 250,00' }
	];

	function goBack() {
		router.back();
	}

	function generateTicketCode() {
		return 'CORT' + Math.random().toString(36).substring(2, 10).toUpperCase();
	}

	function handleGenerate() {
		if (!formData.nomeConvidado || !formData.email) {
			Alert.alert('Erro', 'Preencha pelo menos o nome e e-mail do convidado');
			return;
		}

		const ticketCode = generateTicketCode();
		const selectedSetor = setores.find(s => s.id === formData.setor);
		
		Alert.alert(
			'Cortesia gerada! 🎁',
			`Cortesia para "${formData.nomeConvidado}" foi gerada com sucesso.\n\nCódigo: ${ticketCode}\nSetor: ${selectedSetor?.nome}\nQuantidade: ${formData.quantidade} ingresso(s)\n\n${formData.enviarPorEmail ? 'E-mail será enviado automaticamente.' : ''}`,
			[
				{ text: 'Gerar outra', onPress: () => {
					setFormData({
						nomeConvidado: '',
						email: '',
						telefone: '',
						documento: '',
						setor: 'pista',
						quantidade: '1',
						observacoes: '',
						enviarPorEmail: true
					});
				}},
				{ text: 'Voltar', onPress: goBack }
			]
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

				<Text style={[styles.title, { color: colors.text }]}>Gerar Cortesia</Text>

				<ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
					<View style={styles.content}>
						{/* Dados do convidado */}
						<View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
							<Text style={[styles.sectionTitle, { color: colors.cardText }]}>Dados do Convidado</Text>
							
							<View style={styles.field}>
								<Text style={[styles.label, { color: colors.cardText }]}>Nome completo *</Text>
								<TextInput
									style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
									placeholder="Ex: João Silva"
									placeholderTextColor={colors.inputPlaceholder}
									value={formData.nomeConvidado}
									onChangeText={(text) => setFormData(prev => ({ ...prev, nomeConvidado: text }))}
								/>
							</View>

							<View style={styles.field}>
								<Text style={[styles.label, { color: colors.cardText }]}>E-mail *</Text>
								<TextInput
									style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
									placeholder="joao@email.com"
									placeholderTextColor={colors.inputPlaceholder}
									value={formData.email}
									onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
									keyboardType="email-address"
									autoCapitalize="none"
								/>
							</View>

							<View style={styles.field}>
								<Text style={[styles.label, { color: colors.cardText }]}>Telefone</Text>
								<TextInput
									style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
									placeholder="(11) 99999-9999"
									placeholderTextColor={colors.inputPlaceholder}
									value={formData.telefone}
									onChangeText={(text) => setFormData(prev => ({ ...prev, telefone: text }))}
									keyboardType="phone-pad"
								/>
							</View>

							<View style={styles.field}>
								<Text style={[styles.label, { color: colors.cardText }]}>CPF/RG</Text>
								<TextInput
									style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
									placeholder="000.000.000-00"
									placeholderTextColor={colors.inputPlaceholder}
									value={formData.documento}
									onChangeText={(text) => setFormData(prev => ({ ...prev, documento: text }))}
								/>
							</View>
						</View>

						{/* Configurações da cortesia */}
						<View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
							<Text style={[styles.sectionTitle, { color: colors.cardText }]}>Configurações da Cortesia</Text>
							
							<View style={styles.field}>
								<Text style={[styles.label, { color: colors.cardText }]}>Setor *</Text>
								<View style={styles.setorContainer}>
									{setores.map((setor) => (
										<TouchableOpacity
											key={setor.id}
											style={[
												styles.setorOption,
												{ 
													backgroundColor: formData.setor === setor.id ? colors.primary : colors.inputBackground,
													borderColor: formData.setor === setor.id ? colors.primary : colors.inputBorder
												}
											]}
											onPress={() => setFormData(prev => ({ ...prev, setor: setor.id }))}
										>
											<Text style={[styles.setorNome, { color: formData.setor === setor.id ? colors.buttonTextOnPrimary : colors.cardText }]}>
												{setor.nome}
											</Text>
											<Text style={[styles.setorPreco, { color: formData.setor === setor.id ? colors.buttonTextOnPrimary : colors.cardMuted }]}>
												{setor.preco}
											</Text>
										</TouchableOpacity>
									))}
								</View>
							</View>

							<View style={styles.field}>
								<Text style={[styles.label, { color: colors.cardText }]}>Quantidade de ingressos</Text>
								<View style={styles.quantityContainer}>
									<TouchableOpacity 
										style={[styles.quantityButton, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder }]}
										onPress={() => {
											const current = parseInt(formData.quantidade) || 1;
											if (current > 1) {
												setFormData(prev => ({ ...prev, quantidade: (current - 1).toString() }));
											}
										}}
									>
										<MaterialIcons name="remove" size={20} color={colors.cardText} />
									</TouchableOpacity>
									<TextInput
										style={[styles.quantityInput, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
										value={formData.quantidade}
										onChangeText={(text) => setFormData(prev => ({ ...prev, quantidade: text }))}
										keyboardType="numeric"
										textAlign="center"
									/>
									<TouchableOpacity 
										style={[styles.quantityButton, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder }]}
										onPress={() => {
											const current = parseInt(formData.quantidade) || 1;
											setFormData(prev => ({ ...prev, quantidade: (current + 1).toString() }));
										}}
									>
										<MaterialIcons name="add" size={20} color={colors.cardText} />
									</TouchableOpacity>
								</View>
							</View>

							<View style={styles.field}>
								<Text style={[styles.label, { color: colors.cardText }]}>Observações</Text>
								<TextInput
									style={[styles.textArea, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
									placeholder="Observações sobre a cortesia..."
									placeholderTextColor={colors.inputPlaceholder}
									value={formData.observacoes}
									onChangeText={(text) => setFormData(prev => ({ ...prev, observacoes: text }))}
									multiline
									numberOfLines={3}
									textAlignVertical="top"
								/>
							</View>

							<TouchableOpacity 
								style={styles.checkboxContainer}
								onPress={() => setFormData(prev => ({ ...prev, enviarPorEmail: !prev.enviarPorEmail }))}
							>
								<MaterialIcons 
									name={formData.enviarPorEmail ? "check-box" : "check-box-outline-blank"} 
									size={24} 
									color={colors.primary} 
								/>
								<Text style={[styles.checkboxText, { color: colors.cardText }]}>
									Enviar cortesia por e-mail automaticamente
								</Text>
							</TouchableOpacity>
						</View>

						{/* Resumo */}
						<View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
							<Text style={[styles.summaryTitle, { color: colors.cardText }]}>Resumo da Cortesia</Text>
							<View style={styles.summaryContent}>
								<View style={styles.summaryRow}>
									<Text style={[styles.summaryLabel, { color: colors.cardMuted }]}>Convidado:</Text>
									<Text style={[styles.summaryValue, { color: colors.cardText }]}>
										{formData.nomeConvidado || 'Nome não informado'}
									</Text>
								</View>
								<View style={styles.summaryRow}>
									<Text style={[styles.summaryLabel, { color: colors.cardMuted }]}>Setor:</Text>
									<Text style={[styles.summaryValue, { color: colors.cardText }]}>
										{setores.find(s => s.id === formData.setor)?.nome}
									</Text>
								</View>
								<View style={styles.summaryRow}>
									<Text style={[styles.summaryLabel, { color: colors.cardMuted }]}>Quantidade:</Text>
									<Text style={[styles.summaryValue, { color: colors.cardText }]}>
										{formData.quantidade} ingresso(s)
									</Text>
								</View>
								<View style={styles.summaryRow}>
									<Text style={[styles.summaryLabel, { color: colors.cardMuted }]}>Valor economizado:</Text>
									<Text style={[styles.summaryValue, { color: colors.primary }]}>
										{setores.find(s => s.id === formData.setor)?.preco.replace('R$ ', 'R$ ' + (parseFloat(setores.find(s => s.id === formData.setor)?.preco.replace('R$ ', '').replace(',', '.') || '0') * parseInt(formData.quantidade || '1')).toFixed(2).replace('.', ','))}
									</Text>
								</View>
							</View>
						</View>

						<PrimaryButton onPress={handleGenerate} style={styles.generateButton}>
							Gerar Cortesia
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
		marginBottom: 24,
		textAlign: 'center'
	},
	scrollView: {
		flex: 1
	},
	content: {
		paddingBottom: 32,
		gap: 20
	},
	section: {
		padding: 20,
		borderRadius: 16,
		borderWidth: 1,
		gap: 16
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '700',
		marginBottom: 4
	},
	field: {
		gap: 8
	},
	label: {
		fontSize: 14,
		fontWeight: '600'
	},
	input: {
		borderRadius: 12,
		borderWidth: 1,
		paddingHorizontal: 16,
		paddingVertical: 14,
		fontSize: 16
	},
	textArea: {
		borderRadius: 12,
		borderWidth: 1,
		paddingHorizontal: 16,
		paddingVertical: 14,
		fontSize: 16,
		minHeight: 80
	},
	setorContainer: {
		gap: 12
	},
	setorOption: {
		padding: 16,
		borderRadius: 12,
		borderWidth: 2
	},
	setorNome: {
		fontSize: 16,
		fontWeight: '600',
		marginBottom: 4
	},
	setorPreco: {
		fontSize: 14,
		fontWeight: '500'
	},
	quantityContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
		justifyContent: 'center'
	},
	quantityButton: {
		width: 44,
		height: 44,
		borderRadius: 12,
		borderWidth: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	quantityInput: {
		width: 80,
		borderRadius: 12,
		borderWidth: 1,
		paddingHorizontal: 16,
		paddingVertical: 12,
		fontSize: 16,
		fontWeight: '600'
	},
	checkboxContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
		marginTop: 8
	},
	checkboxText: {
		fontSize: 14,
		fontWeight: '500',
		flex: 1
	},
	summaryCard: {
		padding: 20,
		borderRadius: 16,
		borderWidth: 1
	},
	summaryTitle: {
		fontSize: 18,
		fontWeight: '700',
		marginBottom: 16,
		textAlign: 'center'
	},
	summaryContent: {
		gap: 12
	},
	summaryRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	summaryLabel: {
		fontSize: 14,
		fontWeight: '500'
	},
	summaryValue: {
		fontSize: 14,
		fontWeight: '600'
	},
	generateButton: {
		marginTop: 20
	}
}); 