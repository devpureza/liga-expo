import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, View, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen() {
	const [email, setEmail] = useState(__DEV__ ? '' : ''); // Email pré-preenchido em dev
	const [password, setPassword] = useState(__DEV__ ? '' : ''); // Senha pré-preenchida em dev
	const { colors } = useTheme() as any;
	const { login, loading } = useAuth();

	async function handleLogin() {
		if (!email || !password) {
			Alert.alert('Atenção', 'Informe e-mail e senha.');
			return;
		}

		try {
			const result = await login(email, password);

			if (result.success) {
				// Login realizado com sucesso
				Alert.alert(
					'Login realizado! ✅', 
					'Bem-vindo ao LIGA Admin!',
					[{ 
						text: 'Continuar', 
						onPress: () => router.replace('/events') 
					}]
				);
			} else {
				// Erro no login
				Alert.alert(
					'Erro no login ❌', 
					result.error || 'Credenciais inválidas. Verifique seu e-mail e senha.'
				);
			}
		} catch (error) {
			console.error('Erro no login:', error);
			Alert.alert(
				'Erro de conexão ⚠️', 
				'Não foi possível conectar com o servidor. Verifique sua conexão com a internet.'
			);
		}
	}

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
			{/* Logo fixa no topo */}
			<View style={styles.topSection}>
				<Image source={require('../assets/logo/Colorida-Offwhite.png')} style={styles.logo} resizeMode="contain" />
			</View>

			<KeyboardAvoidingView 
				style={styles.keyboardView}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
			>
				<ScrollView 
					contentContainerStyle={styles.scrollContainer}
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps="handled"
				>
					<View style={styles.centerContainer}>
						<View style={styles.header}> 
							<Text style={[styles.title, { color: colors.text }]}>Login</Text>
							<Text style={[styles.subtitle, { color: colors.mutedText }]}>Acesse sua conta para gerenciar eventos</Text>
						</View>
						
						<View style={styles.form}>
							<TextInput
								placeholder="E-mail"
								placeholderTextColor={colors.inputPlaceholder}
								autoCapitalize="none"
								keyboardType="email-address"
								style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
								value={email}
								onChangeText={setEmail}
								editable={!loading}
								autoComplete="email"
								textContentType="emailAddress"
							/>
							<TextInput
								placeholder="Senha"
								placeholderTextColor={colors.inputPlaceholder}
								secureTextEntry
								style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.inputBorder }]}
								value={password}
								onChangeText={setPassword}
								editable={!loading}
								autoComplete="password"
								textContentType="password"
							/>
							<PrimaryButton onPress={handleLogin} loading={loading} style={styles.loginButton}>
								{loading ? 'Entrando...' : 'Entrar'}
							</PrimaryButton>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	topSection: {
		alignItems: 'center',
		paddingTop: 20,
		paddingBottom: 10
	},
	keyboardView: {
		flex: 1
	},
	scrollContainer: {
		flexGrow: 1,
		paddingHorizontal: 24,
		paddingVertical: 20
	},
	centerContainer: {
		flex: 1,
		justifyContent: 'center',
		minHeight: '100%'
	},
	header: {
		alignItems: 'center',
		marginBottom: 40
	},
	logo: {
		width: 160,
		height: 64
	},
	title: {
		fontSize: 28,
		fontWeight: '700',
		marginBottom: 8
	},
	subtitle: {
		fontSize: 16,
		textAlign: 'center'
	},
	form: {
		gap: 16,
		width: '100%'
	},
	input: {
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 16,
		borderWidth: 1,
		fontSize: 16
	},
	loginButton: {
		marginTop: 8,
		paddingVertical: 16
	}
}); 