import { ApiService, API_CONFIG } from './api';

export interface VendasPorEvento {
	evento: string;
	quantidade: number;
	receita: number;
}

export interface RelatorioVendasResponse {
	vendas_por_evento: VendasPorEvento[];
	total_vendas: number;
	total_receita: number;
	periodo: {
		inicio: string;
		fim: string;
	};
}

export interface RelatorioVendasParams {
	data_inicio: string; // YYYY-MM-DD
	data_fim: string; // YYYY-MM-DD
}

export class ReportService {
	
	/**
	 * Buscar relatório de vendas por período
	 */
	static async getRelatorioVendas(params: RelatorioVendasParams): Promise<{ 
		success: boolean; 
		data?: RelatorioVendasResponse; 
		error?: string 
	}> {
		try {
			const queryParams = new URLSearchParams({
				data_inicio: params.data_inicio,
				data_fim: params.data_fim
			});

			const result = await ApiService.request<any>(
				`${API_CONFIG.ENDPOINTS.RELATORIOS.VENDAS}?${queryParams}`,
				{
					method: 'GET'
				}
			);

			if (result.success && result.data) {
				console.log('📊 Relatório de vendas carregado:', result.data);
				
				// Verificar se a API retornou erro
				if (result.data.erro === true) {
					return {
						success: false,
						error: result.data.mensagem || 'Erro ao carregar relatório de vendas'
					};
				}

				// A API já retorna no formato correto
				const relatorio: RelatorioVendasResponse = result.data;

				console.log('📊 Relatório extraído:', relatorio);
				
				return {
					success: true,
					data: relatorio
				};
			}

			return {
				success: false,
				error: 'Resposta inválida da API'
			};
		} catch (error) {
			console.error('Erro ao buscar relatório de vendas:', error);
			return {
				success: false,
				error: 'Erro ao carregar relatório de vendas'
			};
		}
	}

	/**
	 * Buscar relatório de vendas do evento atual
	 */
	static async getRelatorioVendasEvento(eventName: string, params: RelatorioVendasParams): Promise<{ 
		success: boolean; 
		data?: VendasPorEvento; 
		error?: string 
	}> {
		try {
			const result = await this.getRelatorioVendas(params);
			
			if (result.success && result.data) {
				// Buscar dados específicos do evento pelo nome
				const eventoVendas = result.data.vendas_por_evento.find(
					(venda: VendasPorEvento) => {
						// Comparar nomes (case insensitive)
						return venda.evento.toLowerCase() === eventName.toLowerCase();
					}
				);

				if (eventoVendas) {
					console.log('📊 Dados de vendas encontrados para o evento:', eventoVendas);
					return {
						success: true,
						data: eventoVendas
					};
				} else {
					console.log('⚠️ Dados de vendas não encontrados para o evento:', eventName);
					console.log('📊 Eventos disponíveis:', result.data.vendas_por_evento.map(v => v.evento));
					return {
						success: false,
						error: `Dados de vendas não encontrados para "${eventName}"`
					};
				}
			}

			return {
				success: false,
				error: 'Dados de vendas não encontrados para este evento'
			};
		} catch (error) {
			console.error('Erro ao buscar relatório de vendas do evento:', error);
			return {
				success: false,
				error: 'Erro ao carregar relatório de vendas do evento'
			};
		}
	}

	/**
	 * Formatar valor monetário
	 */
	static formatBRL(value: number): string {
		return new Intl.NumberFormat('pt-BR', { 
			style: 'currency', 
			currency: 'BRL' 
		}).format(value);
	}

	/**
	 * Calcular período padrão (últimos 30 dias)
	 */
	static getDefaultPeriod(): RelatorioVendasParams {
		const endDate = new Date();
		const startDate = new Date();
		startDate.setDate(startDate.getDate() - 30);

		return {
			data_inicio: startDate.toISOString().split('T')[0],
			data_fim: endDate.toISOString().split('T')[0]
		};
	}
}
