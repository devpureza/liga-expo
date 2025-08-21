import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import TabBar from '../../../components/TabBar';
import PrimaryButton from '../../../components/PrimaryButton';
import { CouponService } from '../../../services/couponService';
import { CriarCupomRequest } from '../../../types/api';

export default function CriarCupomScreen() {
	const { id: eventoId } = useLocalSearchParams<{ id: string }>();
	const { colors } = useTheme() as any;
	const [loading, setLoading] = useState(false);

	// Estados do formulário
	const [formData, setFormData] = useState<CriarCupomRequest>({
		evento_id: eventoId || '',
		codigo: '',
		valor: 0,
		tipo_desconto: 'fixo',
		data_expiracao: '',
		descricao: '',
		limite_uso_por_cupom: 1,
		limite_uso_por_cliente: 1
	});

	function goBack() {
		router.back();
	}

	function updateForm(field: keyof CriarCupomRequest, value: any) {
		setFormData(prev => ({
			...prev,
			[field]: value
		}));
	}

	function formatDateInput(text: string) {
		// Remove tudo que não é número
		const numbers = text.replace(/\D/g, '');
		
		// Aplica máscara DD/MM/AAAA
		if (numbers.length <= 2) {
			return numbers;
		} else if (numbers.length <= 4) {
			return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
		} else {
			return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
		}
	}

	function convertBRToAPI(brDate: string): string {
		// Converte DD/MM/AAAA para YYYY-MM-DD
		const parts = brDate.split('/');
		if (parts.length === 3) {
			return `${parts[2]}-${parts[1]}-${parts[0]}`;
		}
		return brDate;
	}

	function convertAPIToBR(apiDate: string): string {
		// Converte YYYY-MM-DD para DD/MM/AAAA
		const parts = apiDate.split('-');
		if (parts.length === 3) {
			return `${parts[2]}/${parts[1]}/${parts[0]}`;
		}
		return apiDate;
	}

	function validateDate(brDateString: string): boolean {
		// Converte para formato da API para validação
		const apiDate = convertBRToAPI(brDateString);
		
		// Verifica formato DD/MM/AAAA
		const brDateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
		if (!brDateRegex.test(brDateString)) {
			return false;
		}

		// Verifica se é uma data válida
		const date = new Date(apiDate);
		if (isNaN(date.getTime())) {
			return false;
		}

		// Verifica se não é uma data passada
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		if (date < today) {
			return false;
		}

		return true;
	}

	async function handleSubmit() {
		// Validações básicas
		if (!formData.codigo.trim()) {
			Alert.alert('Erro', 'Código do cupom é obrigatório');
			return;
		}

		if (formData.valor <= 0) {
			Alert.alert('Erro', 'Valor do desconto deve ser maior que zero');
			return;
		}

		if (!formData.data_expiracao) {
			Alert.alert('Erro', 'Data de expiração é obrigatória');
			return;
		}

		if (!validateDate(formData.data_expiracao)) {
			Alert.alert('Erro', 'Data de expiração inválida. Use formato DD/MM/AAAA e certifique-se que não é uma data passada.');
			return;
		}

		if (!formData.descricao.trim()) {
			Alert.alert('Erro', 'Descrição é obrigatória');
			return;
		}

		try {
			setLoading(true);

			// Remover campos opcionais se não preenchidos
			const dataToSend = { ...formData };
			if (!dataToSend.gasto_minimo) delete dataToSend.gasto_minimo;
			if (!dataToSend.gasto_maximo) delete dataToSend.gasto_maximo;

			// Converter data brasileira para formato da API
			dataToSend.data_expiracao = convertBRToAPI(dataToSend.data_expiracao);

			const result = await CouponService.criarCupom(dataToSend);

			if (result.success) {
				Alert.alert(
					'Sucesso! 🎉',
					'Cupom criado com sucesso!',
					[
						{
							text: 'OK',
							onPress: () => router.back()
						}
					]
				);
			} else {
				Alert.alert('Erro', result.error || 'Erro ao criar cupom');
			}
		} catch (error) {
			console.error('Erro ao criar cupom:', error);
			Alert.alert('Erro', 'Erro interno. Tente novamente.');
		} finally {
			setLoading(false);
		}
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
						<Text style={[styles.title, { color: colors.text }]}>Criar Cupom</Text>
						<Text style={[styles.subtitle, { color: colors.mutedText }]}>
							Configure as regras e condições do cupom
						</Text>
					</View>

					{/* Formulário */}
					<View style={styles.form}>
						{/* Código do Cupom */}
						<View style={styles.inputGroup}>
							<Text style={[styles.label, { color: colors.text }]}>Código do Cupom *</Text>
							<TextInput
								style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
								value={formData.codigo}
								onChangeText={(text) => updateForm('codigo', text)}
								placeholder="Ex: DESCONTO50"
								placeholderTextColor={colors.inputPlaceholder}
								autoCapitalize="characters"
							/>
						</View>

						{/* Tipo de Desconto */}
						<View style={styles.inputGroup}>
							<Text style={[styles.label, { color: colors.text }]}>Tipo de Desconto *</Text>
							<View style={styles.radioGroup}>
								<TouchableOpacity
									style={[
										styles.radioButton,
										{ borderColor: colors.primary },
										formData.tipo_desconto === 'fixo' && { backgroundColor: colors.primary }
									]}
									onPress={() => updateForm('tipo_desconto', 'fixo')}
								>
									<Text style={[
										styles.radioText,
										{ color: formData.tipo_desconto === 'fixo' ? colors.buttonTextOnPrimary : colors.text }
									]}>
										Fixo (R$)
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[
										styles.radioButton,
										{ borderColor: colors.primary },
										formData.tipo_desconto === 'percentual' && { backgroundColor: colors.primary }
									]}
									onPress={() => updateForm('tipo_desconto', 'percentual')}
								>
									<Text style={[
										styles.radioText,
										{ color: formData.tipo_desconto === 'percentual' ? colors.buttonTextOnPrimary : colors.text }
									]}>
										Percentual (%)
									</Text>
								</TouchableOpacity>
							</View>
						</View>

						{/* Valor do Desconto */}
						<View style={styles.inputGroup}>
							<Text style={[styles.label, { color: colors.text }]}>
								Valor do Desconto * ({formData.tipo_desconto === 'fixo' ? 'R$' : '%'})
							</Text>
							<TextInput
								style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
								value={formData.valor.toString()}
								onChangeText={(text) => updateForm('valor', parseFloat(text) || 0)}
								placeholder={formData.tipo_desconto === 'fixo' ? '0.00' : '0'}
								placeholderTextColor={colors.inputPlaceholder}
								keyboardType="numeric"
							/>
						</View>

						{/* Data de Expiração */}
						<View style={styles.inputGroup}>
							<Text style={[styles.label, { color: colors.text }]}>Data de Expiração *</Text>
							<TextInput
								style={[
									styles.input,
									{ backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder },
									formData.data_expiracao && !validateDate(formData.data_expiracao) && { borderColor: '#EF4444' }
								]}
								value={formData.data_expiracao}
								onChangeText={(text) => {
									const formatted = formatDateInput(text);
									updateForm('data_expiracao', formatted);
								}}
								placeholder="DD/MM/AAAA"
								placeholderTextColor={colors.inputPlaceholder}
								keyboardType="numeric"
								maxLength={10}
							/>
							{formData.data_expiracao && !validateDate(formData.data_expiracao) && (
								<Text style={[styles.errorText, { color: '#EF4444' }]}>
									Data inválida ou no passado. Use formato DD/MM/AAAA
								</Text>
							)}
						</View>

						{/* Descrição */}
						<View style={styles.inputGroup}>
							<Text style={[styles.label, { color: colors.text }]}>Descrição *</Text>
							<TextInput
								style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
								value={formData.descricao}
								onChangeText={(text) => updateForm('descricao', text)}
								placeholder="Descreva o cupom..."
								placeholderTextColor={colors.inputPlaceholder}
								multiline
								numberOfLines={3}
							/>
						</View>

						{/* Limite de Uso por Cupom */}
						<View style={styles.inputGroup}>
							<Text style={[styles.label, { color: colors.text }]}>Limite de Uso por Cupom</Text>
							<TextInput
								style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
								value={formData.limite_uso_por_cupom.toString()}
								onChangeText={(text) => updateForm('limite_uso_por_cupom', parseInt(text) || 1)}
								placeholder="1"
								placeholderTextColor={colors.inputPlaceholder}
								keyboardType="numeric"
							/>
						</View>

						{/* Limite de Uso por Cliente */}
						<View style={styles.inputGroup}>
							<Text style={[styles.label, { color: colors.text }]}>Limite de Uso por Cliente</Text>
							<TextInput
								style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
								value={formData.limite_uso_por_cliente.toString()}
								onChangeText={(text) => updateForm('limite_uso_por_cliente', parseInt(text) || 1)}
								placeholder="1"
								placeholderTextColor={colors.inputPlaceholder}
								keyboardType="numeric"
							/>
						</View>

						{/* Botão de Envio */}
						<PrimaryButton
							onPress={handleSubmit}
							loading={loading}
							style={styles.submitButton}
						>
							{loading ? 'Criando...' : 'Criar Cupom'}
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
	radioGroup: {
		flexDirection: 'row',
		gap: 12
	},
	radioButton: {
		flex: 1,
		padding: 16,
		borderRadius: 12,
		borderWidth: 2,
		alignItems: 'center',
		justifyContent: 'center'
	},
	radioText: {
		fontSize: 14,
		fontWeight: '600'
	},
	submitButton: {
		marginTop: 20,
		paddingVertical: 16
	},
	errorText: {
		fontSize: 12,
		marginTop: 4
	}
}); 