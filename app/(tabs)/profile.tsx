import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, TouchableOpacity, View, Image, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import TabBar from '../../components/TabBar';
import PrimaryButton from '../../components/PrimaryButton';
import { useAuth } from '../../contexts/AuthContext';
import { getRoleColor } from '../../services/userUtils';

export default function ProfileScreen() {
	const { colors } = useTheme() as any;
	const { user, loading, logout } = useAuth();

	async function handleLogout() {
		Alert.alert(
			'Confirmar Logout',
			'Tem certeza que deseja sair?',
			[
				{
					text: 'Cancelar',
					style: 'cancel'
				},
				{
					text: 'Sair',
					style: 'destructive',
					onPress: async () => {
						try {
							await logout();
							router.replace('/login');
						} catch (error) {
							console.error('Erro no logout:', error);
							Alert.alert('Erro', 'Erro ao fazer logout. Tente novamente.');
						}
					}
				}
			]
		);
	}

	function handleRefresh() {
		// Implementar refresh dos dados do usuário se necessário
		Alert.alert('Atualizar', 'Funcionalidade de atualização será implementada.');
	}

	if (loading) {
		return (
			<View style={{ flex: 1 }}>
				<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
					{/* Header */}
					<View style={styles.header}>
						<View style={styles.placeholder} />
						<Image source={require('../../assets/logo/Colorida-Offwhite.png')} style={styles.logo} resizeMode="contain" />
						<View style={styles.placeholder} />
					</View>

					<View style={styles.loadingContainer}>
						<ActivityIndicator size="large" color={colors.primary} />
						<Text style={[styles.loadingText, { color: colors.mutedText }]}>
							Carregando perfil...
						</Text>
					</View>
				</SafeAreaView>
				<TabBar />
			</View>
		);
	}

	if (!user) {
		return (
			<View style={{ flex: 1 }}>
				<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
					{/* Header */}
					<View style={styles.header}>
						<View style={styles.placeholder} />
						<Image source={require('../../assets/logo/Colorida-Offwhite.png')} style={styles.logo} resizeMode="contain" />
						<View style={styles.placeholder} />
					</View>

					<View style={styles.errorContainer}>
						<MaterialIcons name="error-outline" size={48} color={colors.mutedText} />
						<Text style={[styles.errorText, { color: colors.mutedText }]}>
							Erro ao carregar perfil
						</Text>
						<TouchableOpacity onPress={handleRefresh} style={[styles.retryButton, { backgroundColor: colors.primary }]}>
							<Text style={[styles.retryButtonText, { color: colors.buttonTextOnPrimary }]}>
								Tentar novamente
							</Text>
						</TouchableOpacity>
					</View>
				</SafeAreaView>
				<TabBar />
			</View>
		);
	}

	return (
		<View style={{ flex: 1 }}>
			<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
				{/* Header */}
				<View style={styles.header}>
					<View style={styles.placeholder} />
					<Image source={require('../../assets/logo/Colorida-Offwhite.png')} style={styles.logo} resizeMode="contain" />
					<TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
						<MaterialIcons name="refresh" size={24} color={colors.text} />
					</TouchableOpacity>
				</View>

				<ScrollView contentContainerStyle={styles.content}>
					{/* Foto do perfil */}
					<View style={styles.profileSection}>
						<View style={[styles.photoContainer, { borderColor: colors.cardBorder }]}>
							<Image 
								source={
									// Prioridade: path_avatar > path_avatar_aprovado > avatar > imagem padrão
									user.path_avatar ? { uri: user.path_avatar } :
									user.path_avatar_aprovado && typeof user.path_avatar_aprovado === 'string' && user.path_avatar_aprovado.startsWith('http') ? { uri: user.path_avatar_aprovado } :
									user.avatar ? { uri: user.avatar } :
									(typeof user.path_avatar_aprovado === 'object' ? user.path_avatar_aprovado : require('../../assets/profile/121321221.png'))
								}
								style={styles.profilePhoto} 
							/>
						</View>
						
						<Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
						
						<View style={[styles.roleChip, { backgroundColor: getRoleColor(user.role || 'Usuário') }]}>
							<Text style={[styles.roleText, { color: colors.buttonTextOnPrimary }]}>
								{user.role || 'Usuário'}
							</Text>
						</View>
					</View>

					{/* Informações do usuário */}
					<View style={styles.infoSection}>
						<View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
							<Text style={[styles.infoLabel, { color: colors.cardMuted }]}>E-mail</Text>
							<Text style={[styles.infoValue, { color: colors.cardText }]}>{user.email}</Text>
						</View>

						{user.cpf && (
							<View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
								<Text style={[styles.infoLabel, { color: colors.cardMuted }]}>CPF</Text>
								<Text style={[styles.infoValue, { color: colors.cardText }]}>{user.cpf}</Text>
							</View>
						)}

						<View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
							<Text style={[styles.infoLabel, { color: colors.cardMuted }]}>Status foto perfil</Text>
							<View style={styles.statusContainer}>
								<MaterialIcons 
									name="check-circle" 
									size={16} 
									color="#10B981" 
								/>
								<Text style={[styles.statusText, { color: '#10B981' }]}>
									{user.status_aprovacao === 'aprovado' ? 'Aprovado' : 'Pendente'}
								</Text>
							</View>
						</View>

						<View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
							<Text style={[styles.infoLabel, { color: colors.cardMuted }]}>ID do Usuário</Text>
							<Text style={[styles.infoValue, { color: colors.cardText }]}>{user.id}</Text>
						</View>

						<View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
							<Text style={[styles.infoLabel, { color: colors.cardMuted }]}>Membro desde</Text>
							<Text style={[styles.infoValue, { color: colors.cardText }]}>
								{new Date(user.created_at).toLocaleDateString('pt-BR')}
							</Text>
						</View>

						{/* Grupos do usuário */}
						{user.grupos_usuario && user.grupos_usuario.length > 0 && (
							<View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
								<Text style={[styles.infoLabel, { color: colors.cardMuted }]}>Grupos</Text>
								<View style={styles.groupsContainer}>
									{user.grupos_usuario.map((grupo, index) => (
										<View key={index} style={[styles.groupChip, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder }]}>
											<Text style={[styles.groupText, { color: colors.cardText }]}>
												{grupo}
											</Text>
										</View>
									))}
								</View>
							</View>
						)}
					</View>

					{/* Botão de logout */}
					<PrimaryButton 
						onPress={handleLogout} 
						loading={loading}
						style={styles.logoutButton}
						variant="solid"
					>
						{loading ? 'Saindo...' : 'Sair'}
					</PrimaryButton>
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
		marginBottom: 32
	},
	logo: {
		width: 120,
		height: 48
	},
	placeholder: {
		width: 40
	},
	refreshButton: {
		width: 40,
		height: 40,
		alignItems: 'center',
		justifyContent: 'center'
	},
	content: {
		flexGrow: 1,
		alignItems: 'center',
		gap: 32,
		paddingBottom: 32 // Espaço extra no final para o botão de logout
	},
	loadingContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		gap: 16
	},
	loadingText: {
		fontSize: 16,
		fontWeight: '500'
	},
	errorContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		gap: 16
	},
	errorText: {
		fontSize: 16,
		fontWeight: '500'
	},
	retryButton: {
		paddingHorizontal: 24,
		paddingVertical: 12,
		borderRadius: 8
	},
	retryButtonText: {
		fontSize: 14,
		fontWeight: '600'
	},
	profileSection: {
		alignItems: 'center',
		gap: 16
	},
	photoContainer: {
		width: 120,
		height: 120,
		borderRadius: 60,
		borderWidth: 3,
		overflow: 'hidden',
		alignItems: 'center',
		justifyContent: 'center'
	},
	profilePhoto: {
		width: '100%',
		height: '100%'
	},
	userName: {
		fontSize: 24,
		fontWeight: '700',
		textAlign: 'center'
	},
	roleChip: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 16
	},
	roleText: {
		fontSize: 14,
		fontWeight: '600'
	},
	infoSection: {
		width: '100%',
		gap: 16
	},
	infoCard: {
		padding: 16,
		borderRadius: 12,
		borderWidth: 1,
		gap: 8
	},
	infoLabel: {
		fontSize: 12,
		fontWeight: '600',
		textTransform: 'uppercase'
	},
	infoValue: {
		fontSize: 16,
		fontWeight: '500'
	},
	statusContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8
	},
	statusText: {
		fontSize: 16,
		fontWeight: '600'
	},
	logoutButton: {
		width: '100%',
		paddingVertical: 16,
		backgroundColor: '#EF4444',
		borderRadius: 12,
		borderWidth: 0,
		shadowColor: '#000',
		shadowOpacity: 0.1,
		shadowRadius: 4,
		shadowOffset: { width: 0, height: 2 },
		elevation: 3
	},
	groupsContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 8,
		marginTop: 8
	},
	groupChip: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 16,
		borderWidth: 1
	},
	groupText: {
		fontSize: 12,
		fontWeight: '600'
	}
}); 