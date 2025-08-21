import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, TextInput, Alert, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import TabBar from '../../../components/TabBar';
import PrimaryButton from '../../../components/PrimaryButton';

type CarrinhoItem = {
	ingressoId: string;
	setor: string;
	preco: number;
	quantidade: number;
};

type Usuario = {
	cpf: string;
	nome: string;
	email: string;
	telefone: string;
	dataNascimento: string;
	foto: string | null;
};

export default function POSVinculacaoScreen() {
	const { id, carrinho: carrinhoParam } = useLocalSearchParams<{ id: string; carrinho: string }>();
	const { colors } = useTheme() as any;
	const [cpfBusca, setCpfBusca] = useState('');
	const [usuarioEncontrado, setUsuarioEncontrado] = useState<Usuario | null>(null);
	const [dadosUsuario, setDadosUsuario] = useState<Usuario>({
		cpf: '',
		nome: '',
		email: '',
		telefone: '',
		dataNascimento: '',
		foto: null
	});
	const [fotoCapturada, setFotoCapturada] = useState<string | null>(null);
	const [mostrarCamera, setMostrarCamera] = useState(false);

	const carrinho: CarrinhoItem[] = carrinhoParam ? JSON.parse(carrinhoParam) : [];

	useEffect(() => {
		if (usuarioEncontrado) {
			setDadosUsuario(usuarioEncontrado);
			setFotoCapturada(usuarioEncontrado.foto);
		}
	}, [usuarioEncontrado]);

	function goBack() {
		router.back();
	}

	function formatCPF(cpf: string): string {
		const numbers = cpf.replace(/\D/g, '');
		return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
	}

	function buscarUsuarioPorCPF() {
		const cpfLimpo = cpfBusca.replace(/\D/g, '');
		
		if (cpfLimpo.length !== 11) {
			Alert.alert('CPF Inválido', 'Digite um CPF válido com 11 dígitos.');
			return;
		}

		// Mock de busca - CPF específico retorna dados
		if (cpfLimpo === '03286917125') {
			const usuario: Usuario = {
				cpf: cpfLimpo,
				nome: 'Mateus Pureza',
				email: 'mateus@liga.com',
				telefone: '(11) 99999-9999',
				dataNascimento: '15/08/1990',
				foto: require('../../../assets/profile/121321221.png')
			};
			setUsuarioEncontrado(usuario);
			Alert.alert('Usuário encontrado! ✅', `${usuario.nome} foi encontrado no sistema.`);
		} else {
			setUsuarioEncontrado(null);
			setDadosUsuario(prev => ({
				...prev,
				cpf: cpfLimpo,
				nome: '',
				email: '',
				telefone: '',
				dataNascimento: '',
				foto: null
			}));
			setFotoCapturada(null);
			Alert.alert(
				'Usuário não encontrado',
				'CPF não encontrado no sistema. Preencha os dados para cadastro.',
				[{ text: 'OK' }]
			);
		}
	}

	function abrirCamera() {
		if (Platform.OS === 'web') {
			Alert.alert(
				'Funcionalidade não disponível na web',
				'A captura de foto só funciona em dispositivos móveis.',
				[{ text: 'OK' }]
			);
			return;
		}
		setMostrarCamera(true);
	}

	function simularCaptura() {
		// Simular captura de foto
		setTimeout(() => {
			const fotoSimulada = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAoACgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUWEHInGBEzKRobHBCNHw8eL/2gAMAwEAAhEDEQA/APf6KKK9Y5gooooAKKKKACiiigD/2Q==';
			setFotoCapturada(fotoSimulada);
			setMostrarCamera(false);
			Alert.alert('Foto capturada! 📸', 'Foto capturada com sucesso.');
		}, 2000);
	}

	function removerFoto() {
		setFotoCapturada(null);
		if (usuarioEncontrado) {
			setUsuarioEncontrado({ ...usuarioEncontrado, foto: null });
		}
	}

	function validarDados(): boolean {
		if (!dadosUsuario.nome.trim()) {
			Alert.alert('Erro', 'Nome é obrigatório.');
			return false;
		}
		if (!dadosUsuario.email.trim()) {
			Alert.alert('Erro', 'E-mail é obrigatório.');
			return false;
		}
		if (!dadosUsuario.telefone.trim()) {
			Alert.alert('Erro', 'Telefone é obrigatório.');
			return false;
		}
		if (!fotoCapturada && !usuarioEncontrado) {
			Alert.alert('Erro', 'Foto é obrigatória para novos usuários.');
			return false;
		}
		return true;
	}

	function prosseguirPagamento() {
		if (!validarDados()) return;

		const dadosCompletos = {
			...dadosUsuario,
			foto: fotoCapturada
		};

		router.push({
			pathname: `/events/${id}/pos-pagamento`,
			params: { 
				carrinho: JSON.stringify(carrinho),
				usuario: JSON.stringify(dadosCompletos)
			}
		});
	}

	function getTotal(): number {
		return carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
	}

	function getTotalItens(): number {
		return carrinho.reduce((total, item) => total + item.quantidade, 0);
	}

	if (mostrarCamera && Platform.OS !== 'web') {
		return (
			<View style={styles.cameraContainer}>
				<View style={styles.cameraSimulation}>
					<Text style={styles.cameraText}>📷 Simulação da Câmera</Text>
					<Text style={styles.cameraSubtext}>
						Posicione o rosto na área indicada
					</Text>
				</View>
				<View style={styles.cameraOverlay}>
					<TouchableOpacity onPress={() => setMostrarCamera(false)} style={styles.closeButton}>
						<MaterialIcons name="close" size={24} color="white" />
					</TouchableOpacity>
					<View style={styles.faceArea}>
						<View style={styles.faceFrame} />
						<Text style={styles.faceText}>Posicione o rosto aqui</Text>
					</View>
					<TouchableOpacity onPress={simularCaptura} style={styles.captureButton}>
						<View style={styles.captureButtonInner} />
					</TouchableOpacity>
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

				<Text style={[styles.title, { color: colors.text }]}>Vinculação do Usuário</Text>

				<ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
					<View style={styles.content}>
						{/* Busca por CPF */}
						<View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
							<Text style={[styles.sectionTitle, { color: colors.cardText }]}>Buscar por CPF</Text>
							
							<View style={styles.cpfContainer}>
								<TextInput
									style={[styles.cpfInput, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
									placeholder="000.000.000-00"
									placeholderTextColor={colors.inputPlaceholder}
									value={formatCPF(cpfBusca)}
									onChangeText={(text) => setCpfBusca(text.replace(/\D/g, '').slice(0, 11))}
									keyboardType="numeric"
									maxLength={14}
								/>
								<TouchableOpacity 
									onPress={buscarUsuarioPorCPF}
									style={[styles.buscarButton, { backgroundColor: colors.primary }]}
								>
									<MaterialIcons name="search" size={20} color={colors.buttonTextOnPrimary} />
								</TouchableOpacity>
							</View>
						</View>

						{/* Foto do usuário */}
						<View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
							<Text style={[styles.sectionTitle, { color: colors.cardText }]}>Foto do Usuário</Text>
							
							<View style={styles.fotoContainer}>
								{fotoCapturada || usuarioEncontrado?.foto ? (
									<View style={styles.fotoWrapper}>
										<Image 
											source={typeof fotoCapturada === 'string' && fotoCapturada.startsWith('data:') 
												? { uri: fotoCapturada }
												: usuarioEncontrado?.foto || fotoCapturada
											}
											style={styles.fotoUsuario}
										/>
										<TouchableOpacity 
											onPress={removerFoto}
											style={[styles.removerFotoButton, { backgroundColor: '#EF4444' }]}
										>
											<MaterialIcons name="delete" size={16} color="white" />
										</TouchableOpacity>
									</View>
								) : (
									<TouchableOpacity 
										onPress={abrirCamera}
										style={[styles.capturarFotoButton, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder }]}
									>
										<MaterialIcons name="camera-alt" size={32} color={colors.cardMuted} />
										<Text style={[styles.capturarFotoText, { color: colors.cardMuted }]}>
											{Platform.OS === 'web' ? 'Disponível apenas no app' : 'Capturar Foto'}
										</Text>
									</TouchableOpacity>
								)}
							</View>
						</View>

						{/* Dados do usuário */}
						<View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
							<Text style={[styles.sectionTitle, { color: colors.cardText }]}>
								{usuarioEncontrado ? 'Dados Encontrados' : 'Cadastro de Usuário'}
							</Text>
							
							<View style={styles.field}>
								<Text style={[styles.label, { color: colors.cardText }]}>Nome completo *</Text>
								<TextInput
									style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
									placeholder="Nome do cliente"
									placeholderTextColor={colors.inputPlaceholder}
									value={dadosUsuario.nome}
									onChangeText={(text) => setDadosUsuario(prev => ({ ...prev, nome: text }))}
									editable={!usuarioEncontrado}
								/>
							</View>

							<View style={styles.field}>
								<Text style={[styles.label, { color: colors.cardText }]}>E-mail *</Text>
								<TextInput
									style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
									placeholder="email@exemplo.com"
									placeholderTextColor={colors.inputPlaceholder}
									value={dadosUsuario.email}
									onChangeText={(text) => setDadosUsuario(prev => ({ ...prev, email: text }))}
									keyboardType="email-address"
									autoCapitalize="none"
									editable={!usuarioEncontrado}
								/>
							</View>

							<View style={styles.field}>
								<Text style={[styles.label, { color: colors.cardText }]}>Telefone *</Text>
								<TextInput
									style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
									placeholder="(11) 99999-9999"
									placeholderTextColor={colors.inputPlaceholder}
									value={dadosUsuario.telefone}
									onChangeText={(text) => setDadosUsuario(prev => ({ ...prev, telefone: text }))}
									keyboardType="phone-pad"
									editable={!usuarioEncontrado}
								/>
							</View>

							<View style={styles.field}>
								<Text style={[styles.label, { color: colors.cardText }]}>Data de nascimento</Text>
								<TextInput
									style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
									placeholder="DD/MM/AAAA"
									placeholderTextColor={colors.inputPlaceholder}
									value={dadosUsuario.dataNascimento}
									onChangeText={(text) => setDadosUsuario(prev => ({ ...prev, dataNascimento: text }))}
									editable={!usuarioEncontrado}
								/>
							</View>

							{usuarioEncontrado && (
								<View style={[styles.usuarioEncontradoInfo, { backgroundColor: colors.inputBackground }]}>
									<MaterialIcons name="check-circle" size={20} color="#10B981" />
									<Text style={[styles.usuarioEncontradoText, { color: colors.cardText }]}>
										Usuário encontrado no sistema
									</Text>
								</View>
							)}
						</View>
					</View>
				</ScrollView>

				{/* Resumo fixo no bottom */}
				<View style={[styles.resumoContainer, { backgroundColor: colors.card, borderTopColor: colors.cardBorder }]}>
					<View style={styles.resumoInfo}>
						<Text style={[styles.resumoItens, { color: colors.cardText }]}>
							{getTotalItens()} ite{getTotalItens() > 1 ? 'ns' : 'm'}
						</Text>
						<Text style={[styles.resumoTotal, { color: colors.primary }]}>
							R$ {getTotal().toFixed(2)}
						</Text>
					</View>
					<PrimaryButton onPress={prosseguirPagamento} style={styles.prosseguirButton}>
						Ir para Pagamento
					</PrimaryButton>
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
		marginBottom: 20,
		textAlign: 'center'
	},
	scrollView: {
		flex: 1
	},
	content: {
		paddingBottom: 120,
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
	cpfContainer: {
		flexDirection: 'row',
		gap: 12
	},
	cpfInput: {
		flex: 1,
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderRadius: 8,
		borderWidth: 1,
		fontSize: 16
	},
	buscarButton: {
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center'
	},
	fotoContainer: {
		alignItems: 'center'
	},
	fotoWrapper: {
		position: 'relative'
	},
	fotoUsuario: {
		width: 120,
		height: 120,
		borderRadius: 60,
		backgroundColor: '#f0f0f0'
	},
	removerFotoButton: {
		position: 'absolute',
		top: -8,
		right: -8,
		width: 32,
		height: 32,
		borderRadius: 16,
		alignItems: 'center',
		justifyContent: 'center'
	},
	capturarFotoButton: {
		width: 120,
		height: 120,
		borderRadius: 60,
		borderWidth: 2,
		borderStyle: 'dashed',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8
	},
	capturarFotoText: {
		fontSize: 12,
		textAlign: 'center',
		fontWeight: '600'
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
	usuarioEncontradoInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		padding: 12,
		borderRadius: 8
	},
	usuarioEncontradoText: {
		fontSize: 14,
		fontWeight: '600'
	},
	resumoContainer: {
		position: 'absolute',
		bottom: 80,
		left: 24,
		right: 24,
		padding: 16,
		borderRadius: 12,
		borderTopWidth: 1,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 16
	},
	resumoInfo: {
		flex: 1
	},
	resumoItens: {
		fontSize: 14,
		fontWeight: '600'
	},
	resumoTotal: {
		fontSize: 20,
		fontWeight: '800'
	},
	prosseguirButton: {
		paddingHorizontal: 20
	},
	// Estilos da câmera simulada
	cameraContainer: {
		flex: 1,
		backgroundColor: 'black'
	},
	cameraSimulation: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#2a2a2a'
	},
	cameraText: {
		color: 'white',
		fontSize: 18,
		fontWeight: '600',
		marginBottom: 8
	},
	cameraSubtext: {
		color: '#ccc',
		fontSize: 14,
		textAlign: 'center'
	},
	cameraOverlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 50
	},
	closeButton: {
		alignSelf: 'flex-end',
		marginRight: 20,
		padding: 12,
		borderRadius: 24,
		backgroundColor: 'rgba(0,0,0,0.5)'
	},
	faceArea: {
		alignItems: 'center',
		gap: 20
	},
	faceFrame: {
		width: 200,
		height: 250,
		borderWidth: 2,
		borderColor: 'white',
		borderRadius: 100,
		borderStyle: 'dashed'
	},
	faceText: {
		color: 'white',
		fontSize: 16,
		fontWeight: '600'
	},
	captureButton: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: 'white',
		alignItems: 'center',
		justifyContent: 'center'
	},
	captureButtonInner: {
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: '#007AFF'
	}
}); 