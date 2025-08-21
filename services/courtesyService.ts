import { ApiService, API_CONFIG } from './api';
import { Cortesia, DispararCortesiaRequest } from '../types/api';

export class CourtesyService {
  
  /**
   * Listar todas as cortesias
   */
  static async getAllCourtesies(): Promise<{ success: boolean; data?: Cortesia[]; error?: string }> {
    try {
      const result = await ApiService.request<any>(
        API_CONFIG.ENDPOINTS.CORTESIAS.LISTAR,
        {
          method: 'GET'
        }
      );

      if (result.success && result.data) {
        console.log('🎁 Resposta completa da API (cortesias):', result.data);
        
        // Verificar se a API retornou erro
        if (result.data.erro === true) {
          return {
            success: false,
            error: result.data.mensagem || 'Erro ao carregar cortesias'
          };
        }

        // Extrair cortesias do formato da API LIGA
        let cortesias: Cortesia[] = [];
        
        if (result.data.dados) {
          // Formato API LIGA: { dados: [...] }
          cortesias = Array.isArray(result.data.dados) ? result.data.dados : [];
        } else if (result.data.cortesias) {
          // Formato: { cortesias: [...] }
          cortesias = result.data.cortesias;
        } else if (result.data.data) {
          // Formato: { data: [...] }
          cortesias = Array.isArray(result.data.data) ? result.data.data : [];
        } else if (Array.isArray(result.data)) {
          // Formato: [...]
          cortesias = result.data;
        } else {
          console.log('⚠️ Formato de resposta não reconhecido para cortesias');
          cortesias = [];
        }

        console.log('🎁 Cortesias extraídas:', cortesias);
        
        return {
          success: true,
          data: cortesias
        };
      }

      return {
        success: false,
        error: 'Resposta inválida da API'
      };
    } catch (error) {
      console.error('Erro ao buscar cortesias:', error);
      return {
        success: false,
        error: 'Erro ao carregar cortesias'
      };
    }
  }

  /**
   * Filtrar cortesias por evento
   */
  static async getCourtesiesByEvent(eventId: string): Promise<{ success: boolean; data?: Cortesia[]; error?: string }> {
    try {
      const result = await this.getAllCourtesies();
      
      if (result.success && result.data) {
        // Filtrar cortesias pelo evento (assumindo que há uma relação com evento)
        const eventCourtesies = result.data.filter(cortesia => 
          cortesia.evento?.id === eventId || 
          cortesia.evento_id === eventId
        );
        
        return {
          success: true,
          data: eventCourtesies
        };
      }

      return result;
    } catch (error) {
      console.error('Erro ao filtrar cortesias por evento:', error);
      return {
        success: false,
        error: 'Erro ao filtrar cortesias'
      };
    }
  }

  /**
   * Disparar cortesia
   */
  static async sendCourtesy(courtesyData: DispararCortesiaRequest): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const result = await ApiService.request<any>(
        API_CONFIG.ENDPOINTS.CORTESIAS.DISPARAR,
        {
          method: 'POST',
          body: courtesyData
        }
      );

      if (result.success && result.data) {
        console.log('🎁 Cortesia disparada:', result.data);
        
        // Verificar se a API retornou erro
        if (result.data.erro === true) {
          return {
            success: false,
            error: result.data.mensagem || 'Erro ao disparar cortesia'
          };
        }

        return {
          success: true,
          data: result.data
        };
      }

      return {
        success: false,
        error: 'Resposta inválida da API'
      };
    } catch (error) {
      console.error('Erro ao disparar cortesia:', error);
      return {
        success: false,
        error: 'Erro ao disparar cortesia'
      };
    }
  }

  /**
   * Formatar data de criação da cortesia
   */
  static formatCreationDate(dateString: string): string {
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
   * Get status da cortesia
   */
  static getCourtesyStatus(cortesia: Cortesia): 'ativa' | 'utilizada' | 'expirada' | 'pendente' {
    if (cortesia.status) {
      return cortesia.status.toLowerCase() as any;
    }
    
    // Status baseado em data se não especificado
    if (cortesia.data_utilizacao) {
      return 'utilizada';
    }
    
    if (cortesia.data_expiracao) {
      const now = new Date();
      const expiration = new Date(cortesia.data_expiracao);
      if (expiration < now) {
        return 'expirada';
      }
    }
    
    return 'ativa';
  }

  /**
   * Get cor do status da cortesia
   */
  static getCourtesyStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'ativa':
        return '#10B981'; // Verde
      case 'utilizada':
        return '#3B82F6'; // Azul
      case 'expirada':
        return '#EF4444'; // Vermelho
      case 'pendente':
        return '#F59E0B'; // Amarelo
      default:
        return '#6B7280'; // Cinza
    }
  }

  /**
   * Get nome do usuário da cortesia
   */
  static getUserName(cortesia: Cortesia): string {
    if (cortesia.usuario && typeof cortesia.usuario === 'object') {
      return cortesia.usuario.name || cortesia.usuario.nome || 'Usuário';
    }
    
    if (cortesia.nome_usuario) {
      return cortesia.nome_usuario;
    }
    
    return 'Usuário não identificado';
  }

  /**
   * Get nome do ingresso da cortesia
   */
  static getTicketName(cortesia: Cortesia): string {
    if (cortesia.ingresso && typeof cortesia.ingresso === 'object') {
      return cortesia.ingresso.nome || 'Ingresso';
    }
    
    if (cortesia.nome_ingresso) {
      return cortesia.nome_ingresso;
    }
    
    return 'Ingresso não especificado';
  }
} 