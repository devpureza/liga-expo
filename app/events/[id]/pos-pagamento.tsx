import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, Alert } from 'react-native';
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

type MetodoPagamento = 'pix' | 'cartao' | 'dinheiro';

export default function POSPagamentoScreen() {
	const { id, carrinho: carrinhoParam, usuario: usuarioParam } = useLocalSearchParams<{ 
		id: string; 
		carrinho: string; 
		usuario: string; 
	}>();
	const { colors } = useTheme() as any;
	const [metodoPagamento, setMetodoPagamento] = useState<MetodoPagamento | null>(null);
	const [processandoPagamento, setProcessandoPagamento] = useState(false);

	const carrinho: CarrinhoItem[] = carrinhoParam ? JSON.parse(carrinhoParam) : [];
	const usuario: Usuario = usuarioParam ? JSON.parse(usuarioParam) : {} as Usuario;

	function goBack() {
		router.back();
	}

	function getTotal(): number {
		return carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
	}

	function getTotalItens(): number {
		return carrinho.reduce((total, item) => total + item.quantidade, 0);
	}

	function getTaxa(): number {
		return getTotal() * 0.05; // 5% de taxa
	}

	function getTotalComTaxa(): number {
		return getTotal() + getTaxa();
	}

	function processarPagamento() {
		if (!metodoPagamento) {
			Alert.alert('Método de pagamento', 'Selecione um método de pagamento para continuar.');
			return;
		}

		setProcessandoPagamento(true);

		// Simular processamento
		setTimeout(() => {
			setProcessandoPagamento(false);
			
			const codigoVenda = 'LIGA' + Date.now().toString().slice(-6);
			
			Alert.alert(
				'Venda realizada com sucesso! 🎉',
				`Código da venda: ${codigoVenda}\nCliente: ${usuario.nome}\nTotal: R$ ${getTotalComTaxa().toFixed(2)}\nMétodo: ${getMetodoNome(metodoPagamento)}`,
				[
					{ text: 'Nova venda', onPress: () => router.push(`/events/${id}/pos`) },
					{ text: 'Voltar ao menu', onPress: () => router.push(`/events/${id}`) }
				]
			);
		}, 3000);
	}

	function getMetodoNome(metodo: MetodoPagamento): string {
		switch (metodo) {
			case 'pix': return 'PIX';
			case 'cartao': return 'Cartão de Crédito/Débito';
			case 'dinheiro': return 'Dinheiro';
			default: return '';
		}
	}

	function getMetodoIcon(metodo: MetodoPagamento): string {
		switch (metodo) {
			case 'pix': return 'pix';
			case 'cartao': return 'credit-card';
			case 'dinheiro': return 'payments';
			default: return '';
		}
	}

	function renderCarrinhoItem(item: CarrinhoItem, index: number) {
		return (
			<View key={index} style={styles.carrinhoItem}>
				<View style={styles.itemInfo}>
					<Text style={[styles.itemSetor, { color: colors.cardText }]}>{item.setor}</Text>
					<Text style={[styles.itemQuantidade, { color: colors.cardMuted }]}>
						{item.quantidade} unidade{item.quantidade > 1 ? 's' : ''}
					</Text>
				</View>
				<Text style={[styles.itemPreco, { color: colors.cardText }]}>
					R$ {(item.preco * item.quantidade).toFixed(2)}
				</Text>
			</View>
		);
	}

	function renderMetodoPagamento(metodo: MetodoPagamento, nome: string, descricao: string) {
		const isSelected = metodoPagamento === metodo;
		
		return (
			<TouchableOpacity
				key={metodo}
				style={[
					styles.metodoCard,
					{
						backgroundColor: isSelected ? colors.primary : colors.card,
						borderColor: isSelected ? colors.primary : colors.cardBorder
					}
				]}
				onPress={() => setMetodoPagamento(metodo)}
			>
				<MaterialIcons 
					name={getMetodoIcon(metodo) as any} 
					size={32} 
					color={isSelected ? colors.buttonTextOnPrimary : colors.cardText} 
				/>
				<View style={styles.metodoInfo}>
					<Text style={[styles.metodoNome, { color: isSelected ? colors.buttonTextOnPrimary : colors.cardText }]}>
						{nome}
					</Text>
					<Text style={[styles.metodoDescricao, { color: isSelected ? colors.buttonTextOnPrimary : colors.cardMuted }]}>
						{descricao}
					</Text>
				</View>
				{isSelected && (
					<MaterialIcons name="check-circle" size={24} color={colors.buttonTextOnPrimary} />
				)}
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

				<Text style={[styles.title, { color: colors.text }]}>Finalizar Pagamento</Text>

				<ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
					<View style={styles.content}>
						{/* Dados do cliente */}
						<View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
							<Text style={[styles.sectionTitle, { color: colors.cardText }]}>Cliente</Text>
							
							<View style={styles.clienteInfo}>
								{usuario.foto && (
									<Image 
										source={typeof usuario.foto === 'string' && usuario.foto.startsWith('data:') 
											? { uri: usuario.foto } as any
											: usuario.foto as any
										}
										style={styles.clienteFoto}
									/>
								)}
								<View style={styles.clienteDados}>
									<Text style={[styles.clienteNome, { color: colors.cardText }]}>{usuario.nome}</Text>
									<Text style={[styles.clienteEmail, { color: colors.cardMuted }]}>{usuario.email}</Text>
									<Text style={[styles.clienteTelefone, { color: colors.cardMuted }]}>{usuario.telefone}</Text>
								</View>
							</View>
						</View>

						{/* Resumo da compra */}
						<View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
							<Text style={[styles.sectionTitle, { color: colors.cardText }]}>Resumo da Compra</Text>
							
							<View style={styles.carrinhoList}>
								{carrinho.map(renderCarrinhoItem)}
							</View>

							<View style={styles.totaisContainer}>
								<View style={styles.totalItem}>
									<Text style={[styles.totalLabel, { color: colors.cardMuted }]}>Subtotal:</Text>
									<Text style={[styles.totalValue, { color: colors.cardText }]}>
										R$ {getTotal().toFixed(2)}
									</Text>
								</View>
								<View style={styles.totalItem}>
									<Text style={[styles.totalLabel, { color: colors.cardMuted }]}>Taxa de serviço (5%):</Text>
									<Text style={[styles.totalValue, { color: colors.cardText }]}>
										R$ {getTaxa().toFixed(2)}
									</Text>
								</View>
								<View style={[styles.totalItem, styles.totalFinal]}>
									<Text style={[styles.totalFinalLabel, { color: colors.cardText }]}>Total:</Text>
									<Text style={[styles.totalFinalValue, { color: colors.primary }]}>
										R$ {getTotalComTaxa().toFixed(2)}
									</Text>
								</View>
							</View>
						</View>

						{/* Métodos de pagamento */}
						<View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
							<Text style={[styles.sectionTitle, { color: colors.cardText }]}>Método de Pagamento</Text>
							
							<View style={styles.metodosContainer}>
								{renderMetodoPagamento('pix', 'PIX', 'Transferência instantânea')}
								{renderMetodoPagamento('cartao', 'Cartão', 'Crédito ou débito')}
								{renderMetodoPagamento('dinheiro', 'Dinheiro', 'Pagamento em espécie')}
							</View>
						</View>

						{/* Informações adicionais */}
						{metodoPagamento && (
							<View style={[styles.infoSection, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder }]}>
								<MaterialIcons name="info" size={20} color={colors.cardMuted} />
								<Text style={[styles.infoText, { color: colors.cardMuted }]}>
									{metodoPagamento === 'pix' && 'O código PIX será gerado após a confirmação.'}
									{metodoPagamento === 'cartao' && 'A máquina de cartão será acionada para o pagamento.'}
									{metodoPagamento === 'dinheiro' && 'Confirme o recebimento do valor em dinheiro.'}
								</Text>
							</View>
						)}
					</View>
				</ScrollView>

				{/* Botão de finalizar */}
				<View style={[styles.finalizarContainer, { backgroundColor: colors.card, borderTopColor: colors.cardBorder }]}>
					<View style={styles.finalizarInfo}>
						<Text style={[styles.finalizarTotal, { color: colors.primary }]}>
							R$ {getTotalComTaxa().toFixed(2)}
						</Text>
						<Text style={[styles.finalizarMetodo, { color: colors.cardMuted }]}>
							{metodoPagamento ? getMetodoNome(metodoPagamento) : 'Selecione o método'}
						</Text>
					</View>
					<PrimaryButton 
						onPress={processarPagamento} 
						style={styles.finalizarButton}
						loading={processandoPagamento}
						disabled={!metodoPagamento}
					>
						{processandoPagamento ? 'Processando...' : 'Finalizar Venda'}
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
	clienteInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 16
	},
	clienteFoto: {
		width: 60,
		height: 60,
		borderRadius: 30
	},
	clienteDados: {
		flex: 1,
		gap: 4
	},
	clienteNome: {
		fontSize: 16,
		fontWeight: '700'
	},
	clienteEmail: {
		fontSize: 14
	},
	clienteTelefone: {
		fontSize: 14
	},
	carrinhoList: {
		gap: 12
	},
	carrinhoItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 8
	},
	itemInfo: {
		flex: 1
	},
	itemSetor: {
		fontSize: 14,
		fontWeight: '600'
	},
	itemQuantidade: {
		fontSize: 12
	},
	itemPreco: {
		fontSize: 14,
		fontWeight: '700'
	},
	totaisContainer: {
		borderTopWidth: 1,
		borderTopColor: '#E2E8F0',
		paddingTop: 16,
		gap: 8
	},
	totalItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	totalFinal: {
		borderTopWidth: 1,
		borderTopColor: '#E2E8F0',
		paddingTop: 8,
		marginTop: 8
	},
	totalLabel: {
		fontSize: 14
	},
	totalValue: {
		fontSize: 14,
		fontWeight: '600'
	},
	totalFinalLabel: {
		fontSize: 16,
		fontWeight: '700'
	},
	totalFinalValue: {
		fontSize: 20,
		fontWeight: '800'
	},
	metodosContainer: {
		gap: 12
	},
	metodoCard: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
		borderRadius: 12,
		borderWidth: 2,
		gap: 16
	},
	metodoInfo: {
		flex: 1
	},
	metodoNome: {
		fontSize: 16,
		fontWeight: '700',
		marginBottom: 4
	},
	metodoDescricao: {
		fontSize: 14
	},
	infoSection: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
		padding: 16,
		borderRadius: 12,
		borderWidth: 1
	},
	infoText: {
		flex: 1,
		fontSize: 14,
		lineHeight: 20
	},
	finalizarContainer: {
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
	finalizarInfo: {
		flex: 1
	},
	finalizarTotal: {
		fontSize: 20,
		fontWeight: '800'
	},
	finalizarMetodo: {
		fontSize: 14,
		fontWeight: '600'
	},
	finalizarButton: {
		paddingHorizontal: 24
	}
}); 