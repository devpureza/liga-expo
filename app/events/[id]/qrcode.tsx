import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, TouchableOpacity, View, Image, Alert, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import TabBar from '../../../components/TabBar';

export default function QRCodeScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { colors } = useTheme() as any;
	const [showCamera, setShowCamera] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const isWeb = Platform.OS === 'web';

	function goBack() {
		router.push('/events');
	}

	function openCamera() {
		console.log('Abrindo simulação da câmera...');
		setShowCamera(true);
	}

	function closeCamera() {
		setShowCamera(false);
		setIsProcessing(false);
	}

	function simulateQRScan() {
		setIsProcessing(true);
		console.log('Simulando leitura de QR Code...');
		
		// Simular processamento
		setTimeout(() => {
			setIsProcessing(false);
			
			// Simular QR Code detectado
			const mockQRData = {
				type: 'QR_CODE',
				data: 'LIGA-EVENTO-' + id + '-INGRESSO-ABC123'
			};
			
			Alert.alert(
				'QR Code detectado! 🎉',
				`Tipo: ${mockQRData.type}\nDados: ${mockQRData.data}`,
				[
					{ text: 'Ler outro', onPress: () => {} },
					{ text: 'Fechar', onPress: closeCamera }
				]
			);
		}, 2000);
	}

	if (showCamera && !isWeb) {
		return (
			<View style={styles.cameraContainer}>
				<View style={styles.cameraSimulation}>
					<Text style={styles.cameraText}>📷 Simulação da Câmera</Text>
					<Text style={styles.cameraSubtext}>
						Em um dispositivo real, aqui seria exibida a câmera
					</Text>
				</View>
				<View style={styles.cameraOverlay}>
					<TouchableOpacity onPress={closeCamera} style={styles.closeButton}>
						<MaterialIcons name="close" size={24} color="white" />
					</TouchableOpacity>
					<View style={styles.scanArea}>
						<View style={styles.scanFrame} />
						<Text style={styles.scanText}>Posicione o QR Code na área</Text>
					</View>
					<TouchableOpacity 
						onPress={simulateQRScan} 
						style={[styles.captureButton, isProcessing && styles.captureButtonDisabled]}
						disabled={isProcessing}
					>
						<View style={styles.captureButtonInner} />
						{isProcessing && (
							<View style={styles.processingIndicator}>
								<MaterialIcons name="hourglass-empty" size={20} color="white" />
							</View>
						)}
					</TouchableOpacity>
					{isProcessing && (
						<Text style={styles.processingText}>Processando QR Code...</Text>
					)}
				</View>
			</View>
		);
	}

	return (
		<View style={{ flex: 1 }}>
			<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
				{/* Header com logo e botão voltar */}
				<View style={styles.header}>
					<TouchableOpacity onPress={goBack} style={styles.backButton}>
						<MaterialIcons name="arrow-back" size={24} color={colors.text} />
					</TouchableOpacity>
					<Image source={require('../../../assets/logo/Colorida-Offwhite.png')} style={styles.logo} resizeMode="contain" />
					<View style={styles.placeholder} />
				</View>

				<Text style={[styles.title, { color: colors.text }]}>QR Code - Evento #{id}</Text>

				<View style={styles.content}>
					<View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }, styles.shadow]}>
						<MaterialIcons name="qr-code-2" size={48} color={colors.cardText} />
						<Text style={[styles.infoTitle, { color: colors.cardText }]}>Leitor de QR Code</Text>
						<Text style={[styles.infoDesc, { color: colors.cardMuted }]}>
							{isWeb 
								? 'Esta funcionalidade só está disponível em dispositivos móveis. Use o app no seu celular para testar o leitor de QR Code.'
								: 'Clique no botão abaixo para abrir a câmera e ler QR codes de ingressos'
							}
						</Text>
					</View>

					<TouchableOpacity 
						style={[
							styles.scanButton, 
							{ backgroundColor: isWeb ? colors.mutedText : colors.primary }, 
							styles.shadow
						]} 
						onPress={openCamera}
					>
						<MaterialIcons 
							name={isWeb ? "smartphone" : "qr-code-scanner"} 
							size={24} 
							color={colors.buttonTextOnPrimary} 
						/>
						<Text style={[styles.scanButtonText, { color: colors.buttonTextOnPrimary }]}>
							{isWeb ? 'Use no Celular' : 'Ler QR Code'}
						</Text>
					</TouchableOpacity>

					{isWeb && (
						<View style={[styles.webInfo, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
							<MaterialIcons name="info" size={20} color={colors.cardMuted} />
							<Text style={[styles.webInfoText, { color: colors.cardMuted }]}>
								Para testar o leitor de QR Code, execute o app em um dispositivo móvel
							</Text>
						</View>
					)}

					{!isWeb && (
						<View style={[styles.demoInfo, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
							<MaterialIcons name="info" size={20} color={colors.cardMuted} />
							<Text style={[styles.demoInfoText, { color: colors.cardMuted }]}>
								Demo: Simula leitura de QR Code para demonstração da funcionalidade
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
		marginBottom: 24
	},
	content: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		gap: 32
	},
	infoCard: {
		alignItems: 'center',
		padding: 32,
		borderRadius: 16,
		borderWidth: 1,
		maxWidth: 300
	},
	infoTitle: {
		fontSize: 20,
		fontWeight: '700',
		marginTop: 16,
		marginBottom: 8,
		textAlign: 'center'
	},
	infoDesc: {
		fontSize: 14,
		textAlign: 'center',
		lineHeight: 20
	},
	scanButton: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
		paddingVertical: 16,
		paddingHorizontal: 32,
		borderRadius: 12
	},
	scanButtonText: {
		fontSize: 16,
		fontWeight: '600'
	},
	webInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		padding: 16,
		borderRadius: 12,
		borderWidth: 1,
		maxWidth: 300
	},
	webInfoText: {
		fontSize: 13,
		textAlign: 'center',
		flex: 1
	},
	demoInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		padding: 16,
		borderRadius: 12,
		borderWidth: 1,
		maxWidth: 300
	},
	demoInfoText: {
		fontSize: 13,
		textAlign: 'center',
		flex: 1
	},
	shadow: {
		shadowColor: '#000',
		shadowOpacity: 0.12,
		shadowRadius: 8,
		shadowOffset: { width: 0, height: 4 },
		elevation: 3
	},
	cameraContainer: {
		flex: 1,
		backgroundColor: 'black'
	},
	cameraSimulation: {
		flex: 1,
		backgroundColor: '#1a1a1a',
		justifyContent: 'center',
		alignItems: 'center'
	},
	cameraText: {
		fontSize: 24,
		color: 'white',
		marginBottom: 8
	},
	cameraSubtext: {
		fontSize: 14,
		color: '#ccc',
		textAlign: 'center',
		marginHorizontal: 32
	},
	cameraOverlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0
	},
	closeButton: {
		position: 'absolute',
		top: 50,
		right: 20,
		backgroundColor: 'rgba(0,0,0,0.5)',
		borderRadius: 20,
		padding: 8,
		zIndex: 10
	},
	scanArea: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	scanFrame: {
		width: 250,
		height: 250,
		borderWidth: 2,
		borderColor: 'white',
		borderRadius: 20,
		backgroundColor: 'transparent'
	},
	scanText: {
		position: 'absolute',
		bottom: 100,
		color: 'white',
		fontSize: 16,
		fontWeight: '600',
		textAlign: 'center'
	},
	captureButton: {
		position: 'absolute',
		bottom: 50,
		alignSelf: 'center',
		width: 70,
		height: 70,
		borderRadius: 35,
		backgroundColor: 'rgba(255,255,255,0.3)',
		justifyContent: 'center',
		alignItems: 'center'
	},
	captureButtonDisabled: {
		opacity: 0.5
	},
	captureButtonInner: {
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: 'white'
	},
	processingIndicator: {
		position: 'absolute',
		top: -5,
		right: -5,
		backgroundColor: 'rgba(0,0,0,0.7)',
		borderRadius: 15,
		padding: 5
	},
	processingText: {
		position: 'absolute',
		bottom: 20,
		alignSelf: 'center',
		color: 'white',
		fontSize: 14,
		fontWeight: '600',
		backgroundColor: 'rgba(0,0,0,0.7)',
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 15
	}
}); 