import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import PrimaryButton from '../../../components/PrimaryButton';
import TabBar from '../../../components/TabBar';

export default function CriarCupomScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { colors } = useTheme() as any;

	const [formData, setFormData] = useState({
		nome: '',
		codigo: '',
		tipo: 'percentual', // percentual ou fixo
		valor: '',
		limiteUso: '',
		dataValidade: '',
		ativo: true
	});

	function goBack() {
		router.back();
	}

	function generateCode() {
		const code = 'LIGA' + Math.random().toString(36).substring(2, 8).toUpperCase();
		setFormData(prev => ({ ...prev, codigo: code }));
	}

	function handleSave() {
		if (!formData.nome || !formData.codigo || !formData.valor) {
			Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
			return;
		}

		Alert.alert(
			'Cupom criado! 🎉',
			`Cupom "${formData.nome}" foi criado com sucesso.\nCódigo: ${formData.codigo}`,
			[
				{ text: 'Criar outro', onPress: () => {
					setFormData({
						nome: '',
						codigo: '',
						tipo: 'percentual',
						valor: '',
						limiteUso: '',
						dataValidade: '',
						ativo: true
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

				<Text style={[styles.title, { color: colors.text }]}>Criar Cupom</Text>

				<ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
					<View style={styles.content}>
						{/* Nome do cupom */}
						<View style={styles.field}>
							<Text style={[styles.label, { color: colors.text }]}>Nome do cupom *</Text>
							<TextInput
								style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
								placeholder="Ex: Desconto Black Friday"
								placeholderTextColor={colors.inputPlaceholder}
								value={formData.nome}
								onChangeText={(text) => setFormData(prev => ({ ...prev, nome: text }))}
							/>
						</View>

						{/* Código */}
						<View style={styles.field}>
							<Text style={[styles.label, { color: colors.text }]}>Código do cupom *</Text>
							<View style={styles.codeContainer}>
								<TextInput
									style={[styles.input, styles.codeInput, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
									placeholder="CODIGO123"
									placeholderTextColor={colors.inputPlaceholder}
									value={formData.codigo}
									onChangeText={(text) => setFormData(prev => ({ ...prev, codigo: text.toUpperCase() }))}
									autoCapitalize="characters"
								/>
								<TouchableOpacity onPress={generateCode} style={[styles.generateButton, { backgroundColor: colors.primary }]}>
									<MaterialIcons name="refresh" size={20} color={colors.buttonTextOnPrimary} />
								</TouchableOpacity>
							</View>
						</View>

						{/* Tipo de desconto */}
						<View style={styles.field}>
							<Text style={[styles.label, { color: colors.text }]}>Tipo de desconto *</Text>
							<View style={styles.toggleContainer}>
								<TouchableOpacity 
									style={[
										styles.toggleOption, 
										{ backgroundColor: formData.tipo === 'percentual' ? colors.primary : colors.card, borderColor: colors.cardBorder }
									]}
									onPress={() => setFormData(prev => ({ ...prev, tipo: 'percentual' }))}
								>
									<Text style={[styles.toggleText, { color: formData.tipo === 'percentual' ? colors.buttonTextOnPrimary : colors.cardText }]}>
										Percentual (%)
									</Text>
								</TouchableOpacity>
								<TouchableOpacity 
									style={[
										styles.toggleOption, 
										{ backgroundColor: formData.tipo === 'fixo' ? colors.primary : colors.card, borderColor: colors.cardBorder }
									]}
									onPress={() => setFormData(prev => ({ ...prev, tipo: 'fixo' }))}
								>
									<Text style={[styles.toggleText, { color: formData.tipo === 'fixo' ? colors.buttonTextOnPrimary : colors.cardText }]}>
										Valor fixo (R$)
									</Text>
								</TouchableOpacity>
							</View>
						</View>

						{/* Valor */}
						<View style={styles.field}>
							<Text style={[styles.label, { color: colors.text }]}>
								Valor do desconto * {formData.tipo === 'percentual' ? '(%)' : '(R$)'}
							</Text>
							<TextInput
								style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
								placeholder={formData.tipo === 'percentual' ? 'Ex: 15' : 'Ex: 25.00'}
								placeholderTextColor={colors.inputPlaceholder}
								value={formData.valor}
								onChangeText={(text) => setFormData(prev => ({ ...prev, valor: text }))}
								keyboardType="numeric"
							/>
						</View>

						{/* Limite de uso */}
						<View style={styles.field}>
							<Text style={[styles.label, { color: colors.text }]}>Limite de uso</Text>
							<TextInput
								style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
								placeholder="Ex: 100 (deixe vazio para ilimitado)"
								placeholderTextColor={colors.inputPlaceholder}
								value={formData.limiteUso}
								onChangeText={(text) => setFormData(prev => ({ ...prev, limiteUso: text }))}
								keyboardType="numeric"
							/>
						</View>

						{/* Data de validade */}
						<View style={styles.field}>
							<Text style={[styles.label, { color: colors.text }]}>Data de validade</Text>
							<TextInput
								style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
								placeholder="DD/MM/AAAA (deixe vazio para sem validade)"
								placeholderTextColor={colors.inputPlaceholder}
								value={formData.dataValidade}
								onChangeText={(text) => setFormData(prev => ({ ...prev, dataValidade: text }))}
							/>
						</View>

						{/* Preview do cupom */}
						<View style={[styles.previewCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
							<Text style={[styles.previewTitle, { color: colors.cardText }]}>Preview do Cupom</Text>
							<View style={styles.previewContent}>
								<Text style={[styles.previewName, { color: colors.cardText }]}>
									{formData.nome || 'Nome do cupom'}
								</Text>
								<Text style={[styles.previewCode, { color: colors.primary }]}>
									{formData.codigo || 'CODIGO123'}
								</Text>
								<Text style={[styles.previewDiscount, { color: colors.cardText }]}>
									{formData.valor ? 
										(formData.tipo === 'percentual' ? `${formData.valor}% OFF` : `R$ ${formData.valor} OFF`) 
										: 'Valor do desconto'
									}
								</Text>
							</View>
						</View>

						<PrimaryButton onPress={handleSave} style={styles.saveButton}>
							Criar Cupom
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
	codeContainer: {
		flexDirection: 'row',
		gap: 12
	},
	codeInput: {
		flex: 1
	},
	generateButton: {
		width: 48,
		height: 48,
		borderRadius: 12,
		alignItems: 'center',
		justifyContent: 'center'
	},
	toggleContainer: {
		flexDirection: 'row',
		gap: 12
	},
	toggleOption: {
		flex: 1,
		paddingVertical: 14,
		paddingHorizontal: 16,
		borderRadius: 12,
		borderWidth: 1,
		alignItems: 'center'
	},
	toggleText: {
		fontSize: 14,
		fontWeight: '600'
	},
	previewCard: {
		padding: 20,
		borderRadius: 16,
		borderWidth: 1,
		marginTop: 12
	},
	previewTitle: {
		fontSize: 16,
		fontWeight: '700',
		marginBottom: 16,
		textAlign: 'center'
	},
	previewContent: {
		alignItems: 'center',
		gap: 8
	},
	previewName: {
		fontSize: 18,
		fontWeight: '600'
	},
	previewCode: {
		fontSize: 20,
		fontWeight: '800',
		letterSpacing: 2
	},
	previewDiscount: {
		fontSize: 16,
		fontWeight: '600'
	},
	saveButton: {
		marginTop: 20
	}
}); 