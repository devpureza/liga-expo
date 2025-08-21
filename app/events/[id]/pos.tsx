import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import TabBar from '../../../components/TabBar';
import PrimaryButton from '../../../components/PrimaryButton';

type Ingresso = {
	id: string;
	setor: string;
	descricao: string;
	preco: number;
	disponivel: number;
	total: number;
};

type CarrinhoItem = {
	ingressoId: string;
	setor: string;
	preco: number;
	quantidade: number;
};

export default function POSScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { colors } = useTheme() as any;
	const [carrinho, setCarrinho] = useState<CarrinhoItem[]>([]);

	// Mock de ingressos disponíveis
	const ingressos: Ingresso[] = [
		{
			id: '1',
			setor: 'Pista',
			descricao: 'Área geral do evento',
			preco: 80.00,
			disponivel: 1247,
			total: 2000
		},
		{
			id: '2',
			setor: 'VIP',
			descricao: 'Área VIP com bar exclusivo',
			preco: 150.00,
			disponivel: 89,
			total: 200
		},
		{
			id: '3',
			setor: 'Camarote',
			descricao: 'Camarote premium com open bar',
			preco: 250.00,
			disponivel: 23,
			total: 50
		},
		{
			id: '4',
			setor: 'Backstage',
			descricao: 'Acesso aos bastidores',
			preco: 400.00,
			disponivel: 5,
			total: 10
		}
	];

	function goBack() {
		router.push('/events');
	}

	function getQuantidadeCarrinho(ingressoId: string): number {
		const item = carrinho.find(item => item.ingressoId === ingressoId);
		return item?.quantidade || 0;
	}

	function adicionarIngresso(ingresso: Ingresso) {
		const quantidadeAtual = getQuantidadeCarrinho(ingresso.id);
		
		if (quantidadeAtual >= ingresso.disponivel) {
			Alert.alert('Limite atingido', 'Não há mais ingressos disponíveis neste setor.');
			return;
		}

		setCarrinho(prev => {
			const itemExistente = prev.find(item => item.ingressoId === ingresso.id);
			
			if (itemExistente) {
				return prev.map(item =>
					item.ingressoId === ingresso.id
						? { ...item, quantidade: item.quantidade + 1 }
						: item
				);
			} else {
				return [...prev, {
					ingressoId: ingresso.id,
					setor: ingresso.setor,
					preco: ingresso.preco,
					quantidade: 1
				}];
			}
		});
	}

	function removerIngresso(ingressoId: string) {
		setCarrinho(prev => {
			const itemExistente = prev.find(item => item.ingressoId === ingressoId);
			
			if (itemExistente && itemExistente.quantidade > 1) {
				return prev.map(item =>
					item.ingressoId === ingressoId
						? { ...item, quantidade: item.quantidade - 1 }
						: item
				);
			} else {
				return prev.filter(item => item.ingressoId !== ingressoId);
			}
		});
	}

	function getTotal(): number {
		return carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
	}

	function getTotalItens(): number {
		return carrinho.reduce((total, item) => total + item.quantidade, 0);
	}

	function prosseguirVenda() {
		if (carrinho.length === 0) {
			Alert.alert('Carrinho vazio', 'Selecione pelo menos um ingresso para prosseguir.');
			return;
		}

		// Navegar para tela de vinculação do usuário
		router.push({
			pathname: `/events/${id}/pos-vinculacao`,
			params: { carrinho: JSON.stringify(carrinho) }
		});
	}

	function renderIngressoCard(ingresso: Ingresso) {
		const quantidade = getQuantidadeCarrinho(ingresso.id);
		const ocupacao = ((ingresso.total - ingresso.disponivel) / ingresso.total) * 100;
		
		return (
			<View key={ingresso.id} style={[styles.ingressoCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }, styles.shadow]}>
				<View style={styles.ingressoInfo}>
					<Text style={[styles.ingressoSetor, { color: colors.cardText }]}>{ingresso.setor}</Text>
					<Text style={[styles.ingressoDescricao, { color: colors.cardMuted }]}>{ingresso.descricao}</Text>
					
					<View style={styles.ingressoStats}>
						<Text style={[styles.ingressoPreco, { color: colors.primary }]}>
							R$ {ingresso.preco.toFixed(2)}
						</Text>
						<Text style={[styles.ingressoDisponivel, { color: ingresso.disponivel < 50 ? '#EF4444' : colors.cardMuted }]}>
							{ingresso.disponivel} disponíveis
						</Text>
					</View>

					<View style={styles.ocupacaoContainer}>
						<View style={[styles.ocupacaoBar, { backgroundColor: colors.cardBorder }]}>
							<View 
								style={[
									styles.ocupacaoFill, 
									{ 
										backgroundColor: ocupacao > 80 ? '#EF4444' : ocupacao > 60 ? '#F59E0B' : '#10B981',
										width: `${ocupacao}%` 
									}
								]} 
							/>
						</View>
						<Text style={[styles.ocupacaoText, { color: colors.cardMuted }]}>
							{ocupacao.toFixed(0)}% vendidos
						</Text>
					</View>
				</View>

				<View style={styles.quantidadeControls}>
					<TouchableOpacity
						style={[styles.quantidadeButton, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder }]}
						onPress={() => removerIngresso(ingresso.id)}
						disabled={quantidade === 0}
					>
						<MaterialIcons 
							name="remove" 
							size={20} 
							color={quantidade === 0 ? colors.cardMuted : colors.cardText} 
						/>
					</TouchableOpacity>
					
					<Text style={[styles.quantidadeText, { color: colors.cardText }]}>
						{quantidade}
					</Text>
					
					<TouchableOpacity
						style={[styles.quantidadeButton, { backgroundColor: colors.primary, borderColor: colors.primary }]}
						onPress={() => adicionarIngresso(ingresso)}
						disabled={quantidade >= ingresso.disponivel}
					>
						<MaterialIcons 
							name="add" 
							size={20} 
							color={quantidade >= ingresso.disponivel ? colors.cardMuted : colors.buttonTextOnPrimary} 
						/>
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

				<Text style={[styles.title, { color: colors.text }]}>PDV - Evento #{id}</Text>

				<ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
					<View style={styles.content}>
						{/* Info do PDV */}
						<View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }, styles.shadow]}>
							<MaterialIcons name="point-of-sale" size={32} color={colors.primary} />
							<Text style={[styles.infoTitle, { color: colors.cardText }]}>Ponto de Venda</Text>
							<Text style={[styles.infoDesc, { color: colors.cardMuted }]}>
								Selecione os ingressos e quantidades para iniciar a venda
							</Text>
						</View>

						{/* Lista de ingressos */}
						<Text style={[styles.sectionTitle, { color: colors.text }]}>Ingressos Disponíveis</Text>
						<View style={styles.ingressosList}>
							{ingressos.map(renderIngressoCard)}
						</View>
					</View>
				</ScrollView>

				{/* Carrinho fixo no bottom */}
				{carrinho.length > 0 && (
					<View style={[styles.carrinhoContainer, { backgroundColor: colors.card, borderTopColor: colors.cardBorder }]}>
						<View style={styles.carrinhoInfo}>
							<Text style={[styles.carrinhoItens, { color: colors.cardText }]}>
								{getTotalItens()} ite{getTotalItens() > 1 ? 'ns' : 'm'}
							</Text>
							<Text style={[styles.carrinhoTotal, { color: colors.primary }]}>
								R$ {getTotal().toFixed(2)}
							</Text>
						</View>
						<PrimaryButton onPress={prosseguirVenda} style={styles.prosseguirButton}>
							Prosseguir
						</PrimaryButton>
					</View>
				)}
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
		paddingBottom: 120
	},
	infoCard: {
		padding: 20,
		borderRadius: 12,
		borderWidth: 1,
		alignItems: 'center',
		gap: 12,
		marginBottom: 24
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
	sectionTitle: {
		fontSize: 18,
		fontWeight: '700',
		marginBottom: 16
	},
	ingressosList: {
		gap: 16
	},
	ingressoCard: {
		padding: 16,
		borderRadius: 12,
		borderWidth: 1,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 16
	},
	ingressoInfo: {
		flex: 1,
		gap: 8
	},
	ingressoSetor: {
		fontSize: 16,
		fontWeight: '700'
	},
	ingressoDescricao: {
		fontSize: 14,
		lineHeight: 20
	},
	ingressoStats: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	ingressoPreco: {
		fontSize: 18,
		fontWeight: '800'
	},
	ingressoDisponivel: {
		fontSize: 12,
		fontWeight: '600'
	},
	ocupacaoContainer: {
		gap: 4
	},
	ocupacaoBar: {
		height: 4,
		borderRadius: 2,
		overflow: 'hidden'
	},
	ocupacaoFill: {
		height: '100%',
		borderRadius: 2
	},
	ocupacaoText: {
		fontSize: 11,
		textAlign: 'center'
	},
	quantidadeControls: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12
	},
	quantidadeButton: {
		width: 36,
		height: 36,
		borderRadius: 18,
		borderWidth: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	quantidadeText: {
		fontSize: 16,
		fontWeight: '700',
		minWidth: 24,
		textAlign: 'center'
	},
	carrinhoContainer: {
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
	carrinhoInfo: {
		flex: 1
	},
	carrinhoItens: {
		fontSize: 14,
		fontWeight: '600'
	},
	carrinhoTotal: {
		fontSize: 20,
		fontWeight: '800'
	},
	prosseguirButton: {
		paddingHorizontal: 24
	},
	shadow: {
		shadowColor: '#000',
		shadowOpacity: 0.08,
		shadowRadius: 8,
		shadowOffset: { width: 0, height: 2 },
		elevation: 2
	}
}); 