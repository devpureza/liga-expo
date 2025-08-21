import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, TouchableOpacity, View, Image, Alert, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import TabBar from '../../../components/TabBar';
import PrimaryButton from '../../../components/PrimaryButton';

type UsuarioReconhecido = {
	id: string;
	nome: string;
	email: string;
	setor: string;
	statusIngresso: 'valido' | 'ja_usado' | 'expirado' | 'nao_encontrado';
	horaEntrada?: string;
	foto: any;
};

export default function FacialScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { colors } = useTheme() as any;
	const [mostrarCamera, setMostrarCamera] = useState(false);
	const [processandoReconhecimento, setProcessandoReconhecimento] = useState(false);
	const [usuarioReconhecido, setUsuarioReconhecido] = useState<UsuarioReconhecido | null>(null);
	const [tentativaReconhecimento, setTentativaReconhecimento] = useState(0);

	// Mock de usuários cadastrados
	const usuariosCadastrados: UsuarioReconhecido[] = [
		{
			id: '1',
			nome: 'Mateus Pureza',
			email: 'mateus@liga.com',
			setor: 'VIP',
			statusIngresso: 'valido',
			foto: require('../../../assets/profile/121321221.png')
		},
		{
			id: '2',
			nome: 'João Silva',
			email: 'joao@email.com',
			setor: 'Pista',
			statusIngresso: 'ja_usado',
			horaEntrada: '14:30',
			foto: require('../../../assets/profile/121321221.png') // Usando a mesma foto para demo
		}
	];

	function goBack() {
		router.push('/events');
	}

	function iniciarReconhecimento() {
		if (Platform.OS === 'web') {
			Alert.alert(
				'Funcionalidade não disponível na web',
				'O reconhecimento facial só funciona em dispositivos móveis. Use o app no seu celular para testar esta funcionalidade.',
				[{ text: 'OK' }]
			);
			return;
		}
		
		setUsuarioReconhecido(null);
		setMostrarCamera(true);
	}

	function fecharCamera() {
		setMostrarCamera(false);
		setProcessandoReconhecimento(false);
	}

	function simularReconhecimento() {
		setProcessandoReconhecimento(true);
		setTentativaReconhecimento(prev => prev + 1);
		
		// Simular processamento de reconhecimento
		setTimeout(() => {
			setProcessandoReconhecimento(false);
			setMostrarCamera(false);
			
			// Simular diferentes resultados baseado no número de tentativas
			if (tentativaReconhecimento === 0) {
				// Primeira tentativa: usuário válido
				const usuario = usuariosCadastrados[0];
				setUsuarioReconhecido(usuario);
				mostrarResultado(usuario);
			} else if (tentativaReconhecimento === 1) {
				// Segunda tentativa: usuário já usou o ingresso
				const usuario = usuariosCadastrados[1];
				setUsuarioReconhecido(usuario);
				mostrarResultado(usuario);
			} else {
				// Outras tentativas: não reconhecido
				setUsuarioReconhecido({
					id: '',
					nome: '',
					email: '',
					setor: '',
					statusIngresso: 'nao_encontrado',
					foto: null
				});
				mostrarResultadoNaoEncontrado();
			}
		}, 3000);
	}

	function mostrarResultado(usuario: UsuarioReconhecido) {
		switch (usuario.statusIngresso) {
			case 'valido':
				Alert.alert(
					'Acesso Liberado! ✅',
					`Usuário: ${usuario.nome}\nSetor: ${usuario.setor}\nStatus: Ingresso válido\n\nEntrada autorizada!`,
					[
						{ text: 'Registrar Entrada', onPress: () => registrarEntrada(usuario) },
						{ text: 'Nova Leitura', onPress: () => setUsuarioReconhecido(null) }
					]
				);
				break;
			case 'ja_usado':
				Alert.alert(
					'Acesso Negado ❌',
					`Usuário: ${usuario.nome}\nSetor: ${usuario.setor}\nStatus: Ingresso já utilizado\nHorário da entrada: ${usuario.horaEntrada}\n\nEntrada não autorizada.`,
					[
						{ text: 'Nova Leitura', onPress: () => setUsuarioReconhecido(null) }
					]
				);
				break;
			case 'expirado':
				Alert.alert(
					'Acesso Negado ❌',
					`Usuário: ${usuario.nome}\nSetor: ${usuario.setor}\nStatus: Ingresso expirado\n\nEntrada não autorizada.`,
					[
						{ text: 'Nova Leitura', onPress: () => setUsuarioReconhecido(null) }
					]
				);
				break;
		}
	}

	function mostrarResultadoNaoEncontrado() {
		Alert.alert(
			'Usuário Não Reconhecido ⚠️',
			'Face não reconhecida no sistema. Verifique se o usuário possui ingresso válido ou tente novamente.',
			[
				{ text: 'Tentar Novamente', onPress: () => setUsuarioReconhecido(null) },
				{ text: 'Verificação Manual', onPress: () => {} }
			]
		);
	}

	function registrarEntrada(usuario: UsuarioReconhecido) {
		// Simular registro de entrada
		const horaAtual = new Date().toLocaleTimeString('pt-BR', { 
			hour: '2-digit', 
			minute: '2-digit' 
		});
		
		Alert.alert(
			'Entrada Registrada! 🎉',
			`${usuario.nome} entrou no evento às ${horaAtual}\nSetor: ${usuario.setor}`,
			[
				{ text: 'Nova Leitura', onPress: () => setUsuarioReconhecido(null) }
			]
		);
	}

	function getStatusColor(status: string): string {
		switch (status) {
			case 'valido': return '#10B981';
			case 'ja_usado': return '#F59E0B';
			case 'expirado': return '#EF4444';
			case 'nao_encontrado': return '#6B7280';
			default: return colors.cardMuted;
		}
	}

	function getStatusText(status: string): string {
		switch (status) {
			case 'valido': return 'Válido';
			case 'ja_usado': return 'Já Utilizado';
			case 'expirado': return 'Expirado';
			case 'nao_encontrado': return 'Não Encontrado';
			default: return '';
		}
	}

	function getStatusIcon(status: string): string {
		switch (status) {
			case 'valido': return 'check-circle';
			case 'ja_usado': return 'schedule';
			case 'expirado': return 'cancel';
			case 'nao_encontrado': return 'help';
			default: return 'help';
		}
	}

	if (mostrarCamera && Platform.OS !== 'web') {
		return (
			<View style={styles.cameraContainer}>
				<View style={styles.cameraSimulation}>
					<Text style={styles.cameraText}>📷 Reconhecimento Facial</Text>
					<Text style={styles.cameraSubtext}>
						Sistema de reconhecimento ativo
					</Text>
				</View>
				<View style={styles.cameraOverlay}>
					<TouchableOpacity onPress={fecharCamera} style={styles.closeButton}>
						<MaterialIcons name="close" size={24} color="white" />
					</TouchableOpacity>
					
					<View style={styles.faceArea}>
						<View style={styles.faceFrame} />
						<Text style={styles.faceText}>Posicione o rosto na área</Text>
						{processandoReconhecimento && (
							<View style={styles.processingContainer}>
								<MaterialIcons name="face-retouching-natural" size={40} color="white" />
								<Text style={styles.processingText}>Reconhecendo...</Text>
							</View>
						)}
					</View>
					
					<TouchableOpacity 
						onPress={simularReconhecimento} 
						style={[styles.scanButton, processandoReconhecimento && styles.scanButtonDisabled]}
						disabled={processandoReconhecimento}
					>
						<View style={styles.scanButtonInner} />
						{processandoReconhecimento && (
							<View style={styles.scanningIndicator}>
								<MaterialIcons name="face-retouching-natural" size={20} color="white" />
							</View>
						)}
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

				<Text style={[styles.title, { color: colors.text }]}>Reconhecimento Facial - Evento #{id}</Text>

				<View style={styles.content}>
					{/* Info do sistema */}
					<View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }, styles.shadow]}>
						<MaterialIcons name="face-retouching-natural" size={48} color={colors.primary} />
						<Text style={[styles.infoTitle, { color: colors.cardText }]}>Controle de Acesso Facial</Text>
						<Text style={[styles.infoDesc, { color: colors.cardMuted }]}>
							{Platform.OS === 'web' 
								? 'Esta funcionalidade só está disponível em dispositivos móveis. Use o app no seu celular para testar o reconhecimento facial.'
								: 'Posicione o rosto na câmera para verificar o acesso ao evento'
							}
						</Text>
					</View>

					{/* Resultado do último reconhecimento */}
					{usuarioReconhecido && (
						<View style={[styles.resultCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }, styles.shadow]}>
							<Text style={[styles.resultTitle, { color: colors.cardText }]}>Último Resultado</Text>
							
							{usuarioReconhecido.statusIngresso !== 'nao_encontrado' ? (
								<View style={styles.userResult}>
									{usuarioReconhecido.foto && (
										<Image source={usuarioReconhecido.foto} style={styles.userPhoto} />
									)}
									<View style={styles.userInfo}>
										<Text style={[styles.userName, { color: colors.cardText }]}>
											{usuarioReconhecido.nome}
										</Text>
										<Text style={[styles.userEmail, { color: colors.cardMuted }]}>
											{usuarioReconhecido.email}
										</Text>
										<Text style={[styles.userSetor, { color: colors.cardText }]}>
											Setor: {usuarioReconhecido.setor}
										</Text>
									</View>
								</View>
							) : (
								<View style={styles.notFoundResult}>
									<MaterialIcons name="person-off" size={48} color={colors.cardMuted} />
									<Text style={[styles.notFoundText, { color: colors.cardMuted }]}>
										Usuário não reconhecido
									</Text>
								</View>
							)}

							<View style={[styles.statusBadge, { backgroundColor: getStatusColor(usuarioReconhecido.statusIngresso) }]}>
								<MaterialIcons 
									name={getStatusIcon(usuarioReconhecido.statusIngresso) as any} 
									size={16} 
									color="white" 
								/>
								<Text style={styles.statusText}>
									{getStatusText(usuarioReconhecido.statusIngresso)}
								</Text>
							</View>
						</View>
					)}

					{/* Estatísticas rápidas */}
					<View style={[styles.statsCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }, styles.shadow]}>
						<Text style={[styles.statsTitle, { color: colors.cardText }]}>Estatísticas do Dia</Text>
						<View style={styles.statsGrid}>
							<View style={styles.statItem}>
								<Text style={[styles.statNumber, { color: colors.primary }]}>847</Text>
								<Text style={[styles.statLabel, { color: colors.cardMuted }]}>Entradas hoje</Text>
							</View>
							<View style={styles.statItem}>
								<Text style={[styles.statNumber, { color: '#10B981' }]}>823</Text>
								<Text style={[styles.statLabel, { color: colors.cardMuted }]}>Reconhecidos</Text>
							</View>
							<View style={styles.statItem}>
								<Text style={[styles.statNumber, { color: '#EF4444' }]}>24</Text>
								<Text style={[styles.statLabel, { color: colors.cardMuted }]}>Negados</Text>
							</View>
						</View>
					</View>

					{/* Botão de iniciar */}
					<PrimaryButton 
						onPress={iniciarReconhecimento}
						style={Platform.OS === 'web' ? 
							{ ...styles.startButton, backgroundColor: colors.mutedText } : 
							styles.startButton
						}
					>
						<MaterialIcons 
							name={Platform.OS === 'web' ? "smartphone" : "face-retouching-natural"} 
							size={20} 
							color={colors.buttonTextOnPrimary} 
						/>
						<Text style={[styles.startButtonText, { color: colors.buttonTextOnPrimary }]}>
							{Platform.OS === 'web' ? 'Use no Celular' : 'Iniciar Reconhecimento'}
						</Text>
					</PrimaryButton>

					{Platform.OS === 'web' && (
						<View style={[styles.webInfo, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
							<MaterialIcons name="info" size={20} color={colors.cardMuted} />
							<Text style={[styles.webInfoText, { color: colors.cardMuted }]}>
								Para testar o reconhecimento facial, execute o app em um dispositivo móvel
							</Text>
						</View>
					)}

					{Platform.OS !== 'web' && (
						<View style={[styles.demoInfo, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
							<MaterialIcons name="info" size={20} color={colors.cardMuted} />
							<Text style={[styles.demoInfoText, { color: colors.cardMuted }]}>
								Demo: Simula reconhecimento facial - diferentes resultados a cada tentativa
							</Text>
						</View>
					)}
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
	content: {
		flex: 1,
		gap: 20
	},
	infoCard: {
		padding: 20,
		borderRadius: 12,
		borderWidth: 1,
		alignItems: 'center',
		gap: 12
	},
	infoTitle: {
		fontSize: 18,
		fontWeight: '700'
	},
	infoDesc: {
		fontSize: 14,
		textAlign: 'center',
		lineHeight: 20
	},
	resultCard: {
		padding: 16,
		borderRadius: 12,
		borderWidth: 1,
		gap: 16
	},
	resultTitle: {
		fontSize: 16,
		fontWeight: '700'
	},
	userResult: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 16
	},
	userPhoto: {
		width: 60,
		height: 60,
		borderRadius: 30
	},
	userInfo: {
		flex: 1,
		gap: 4
	},
	userName: {
		fontSize: 16,
		fontWeight: '700'
	},
	userEmail: {
		fontSize: 14
	},
	userSetor: {
		fontSize: 14,
		fontWeight: '600'
	},
	notFoundResult: {
		alignItems: 'center',
		gap: 12,
		paddingVertical: 20
	},
	notFoundText: {
		fontSize: 16,
		fontWeight: '600'
	},
	statusBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 8,
		alignSelf: 'center'
	},
	statusText: {
		color: 'white',
		fontSize: 14,
		fontWeight: '600'
	},
	statsCard: {
		padding: 16,
		borderRadius: 12,
		borderWidth: 1,
		gap: 16
	},
	statsTitle: {
		fontSize: 16,
		fontWeight: '700'
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
		fontWeight: '800',
		marginBottom: 4
	},
	statLabel: {
		fontSize: 12,
		textAlign: 'center'
	},
	startButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
		paddingVertical: 16
	},
	startButtonText: {
		fontSize: 16,
		fontWeight: '700'
	},
	webInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
		padding: 16,
		borderRadius: 12,
		borderWidth: 1
	},
	webInfoText: {
		flex: 1,
		fontSize: 14,
		lineHeight: 20
	},
	demoInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
		padding: 16,
		borderRadius: 12,
		borderWidth: 1
	},
	demoInfoText: {
		flex: 1,
		fontSize: 14,
		lineHeight: 20
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
		backgroundColor: '#1a1a1a'
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
		width: 220,
		height: 280,
		borderWidth: 3,
		borderColor: '#00FF88',
		borderRadius: 140,
		borderStyle: 'solid'
	},
	faceText: {
		color: 'white',
		fontSize: 16,
		fontWeight: '600'
	},
	processingContainer: {
		alignItems: 'center',
		gap: 12,
		paddingVertical: 20
	},
	processingText: {
		color: 'white',
		fontSize: 16,
		fontWeight: '600'
	},
	scanButton: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: '#00FF88',
		alignItems: 'center',
		justifyContent: 'center'
	},
	scanButtonDisabled: {
		backgroundColor: '#666'
	},
	scanButtonInner: {
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: '#00AA55'
	},
	scanningIndicator: {
		position: 'absolute',
		alignItems: 'center',
		justifyContent: 'center'
	},
	shadow: {
		shadowColor: '#000',
		shadowOpacity: 0.08,
		shadowRadius: 8,
		shadowOffset: { width: 0, height: 2 },
		elevation: 2
	}
}); 