import { ApiService, API_CONFIG } from './api';
import { Evento, EditarEventoRequest } from '../types/api';

export class EventService {
  
  /**
   * Listar eventos ativos
   */
  static async getActiveEvents(): Promise<{ success: boolean; data?: Evento[]; error?: string }> {
    try {
      const result = await ApiService.request<any>(
        API_CONFIG.ENDPOINTS.EVENTOS.ATIVOS,
        {
          method: 'GET'
        }
      );

      if (result.success && result.data) {
        console.log('📅 Resposta completa da API:', result.data);
        
        // Verificar se a API retornou erro
        if (result.data.erro === true) {
          return {
            success: false,
            error: result.data.mensagem || 'Erro ao carregar eventos'
          };
        }

        // Extrair eventos do formato da API LIGA
        let eventos: Evento[] = [];
        
        if (result.data.dados) {
          // Formato API LIGA: { dados: [...] }
          eventos = Array.isArray(result.data.dados) ? result.data.dados : [];
        } else if (result.data.eventos) {
          // Formato: { eventos: [...] }
          eventos = result.data.eventos;
        } else if (result.data.data) {
          // Formato: { data: [...] }
          eventos = Array.isArray(result.data.data) ? result.data.data : [];
        } else if (Array.isArray(result.data)) {
          // Formato: [...]
          eventos = result.data;
        } else {
          // Se não encontrar eventos, retornar array vazio
          console.log('⚠️ Formato de resposta não reconhecido, retornando array vazio');
          eventos = [];
        }

        console.log('📅 Eventos extraídos:', eventos);
        
        return {
          success: true,
          data: eventos
        };
      }

      return {
        success: false,
        error: 'Resposta inválida da API'
      };
    } catch (error) {
      console.error('Erro ao buscar eventos ativos:', error);
      return {
        success: false,
        error: 'Erro ao carregar eventos'
      };
    }
  }

  /**
   * Visualizar detalhes de um evento específico
   */
  static async getEventDetails(eventId: string): Promise<{ success: boolean; data?: Evento; error?: string }> {
    try {
      const result = await ApiService.request<any>(
        `${API_CONFIG.ENDPOINTS.EVENTOS.DETALHES}/${eventId}`,
        {
          method: 'GET'
        }
      );

      if (result.success && result.data) {
        console.log('📅 Resposta completa da API (detalhes):', result.data);
        
        // Verificar se a API retornou erro
        if (result.data.erro === true) {
          return {
            success: false,
            error: result.data.mensagem || 'Erro ao carregar detalhes do evento'
          };
        }

        // Extrair evento do formato da API LIGA
        let evento: Evento | null = null;
        
        if (result.data.dados) {
          // Formato API LIGA: { dados: {...} } ou { dados: [{...}] }
          evento = Array.isArray(result.data.dados) ? result.data.dados[0] : result.data.dados;
        } else if (result.data.evento) {
          // Formato: { evento: {...} }
          evento = result.data.evento;
        } else if (result.data.data) {
          // Formato: { data: {...} }
          evento = Array.isArray(result.data.data) ? result.data.data[0] : result.data.data;
        } else if (result.data.id && result.data.nome) {
          // Formato direto: { id, nome, ... }
          evento = result.data;
        } else {
          console.log('⚠️ Formato de resposta não reconhecido para detalhes do evento');
          return {
            success: false,
            error: 'Formato de resposta inválido'
          };
        }

        if (!evento) {
          return {
            success: false,
            error: 'Evento não encontrado'
          };
        }

        console.log('📅 Evento extraído:', evento);
        
        return {
          success: true,
          data: evento
        };
      }

      return {
        success: false,
        error: 'Resposta inválida da API'
      };
    } catch (error) {
      console.error('Erro ao buscar detalhes do evento:', error);
      return {
        success: false,
        error: 'Erro ao carregar detalhes do evento'
      };
    }
  }

  /**
   * Editar evento
   */
  static async updateEvent(eventId: string, eventData: EditarEventoRequest): Promise<{ success: boolean; data?: Evento; error?: string }> {
    try {
      const result = await ApiService.request<Evento>(
        `${API_CONFIG.ENDPOINTS.EVENTOS.DETALHES}/${eventId}`,
        {
          method: 'PUT',
          body: eventData
        }
      );

      if (result.success) {
        console.log('📅 Evento atualizado:', result.data);
      }

      return result;
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
      return {
        success: false,
        error: 'Erro ao atualizar evento'
      };
    }
  }

  /**
   * Formatar data do evento para exibição
   */
  static formatEventDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  }

  /**
   * Formatar data do evento para exibição curta
   */
  static formatEventDateShort(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  }

  /**
   * Verificar se evento é hoje
   */
  static isEventToday(dateString: string): boolean {
    try {
      const eventDate = new Date(dateString);
      const today = new Date();
      
      return eventDate.toDateString() === today.toDateString();
    } catch (error) {
      return false;
    }
  }

  /**
   * Verificar se evento já passou
   */
  static isEventPast(dateString: string): boolean {
    try {
      const eventDate = new Date(dateString);
      const now = new Date();
      
      return eventDate < now;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get cor do status do evento
   */
  static getEventStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'ativo':
      case 'publicado':
        return '#10B981'; // Verde
      case 'vendendo':
        return '#3B82F6'; // Azul
      case 'esgotado':
        return '#F59E0B'; // Amarelo
      case 'cancelado':
        return '#EF4444'; // Vermelho
      case 'finalizado':
        return '#6B7280'; // Cinza
      default:
        return '#6B7280'; // Cinza padrão
    }
  }

	/**
	 * Buscar totalizadores de controle de entrada
	 */
	static async getControleEntradaTotalizadores(eventoId: string): Promise<{
		success: boolean;
		data?: {
			total_bilhetes: number;
			bilhetes_restantes: number;
			bilhetes_usuados: number;
		};
		error?: string;
	}> {
		try {
			const result = await ApiService.request<any>(
				`${API_CONFIG.ENDPOINTS.CONTROLE_ENTRADA.TOTALIZADORES}/${eventoId}/totalizadores`,
				{
					method: 'GET'
				}
			);

			if (result.success && result.data) {
				console.log('🎫 Totalizadores de controle de entrada carregados:', result.data);

				// Verificar se a API retornou erro
				if (result.data.erro === true) {
					return {
						success: false,
						error: result.data.mensagem || 'Erro ao carregar totalizadores'
					};
				}

				// Extrair dados do formato da API LIGA
				const totalizadores = result.data.dados;

				if (totalizadores) {
					return {
						success: true,
						data: totalizadores
					};
				} else {
					return {
						success: false,
						error: 'Dados de totalizadores não encontrados'
					};
				}
			}

			return {
				success: false,
				error: 'Resposta inválida da API'
			};
		} catch (error) {
			console.error('Erro ao buscar totalizadores de controle de entrada:', error);
			return {
				success: false,
				error: 'Erro ao carregar totalizadores de controle de entrada'
			};
		}
	}
} 