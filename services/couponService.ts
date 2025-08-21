import { ApiService, API_CONFIG } from './api';
import { Cupom, CriarCupomRequest } from '../types/api';

export class CouponService {
  
  /**
   * Listar todos os cupons
   */
  static async getAllCoupons(): Promise<{ success: boolean; data?: Cupom[]; error?: string }> {
    try {
      const result = await ApiService.request<any>(
        API_CONFIG.ENDPOINTS.CUPONS.LISTAR,
        {
          method: 'GET'
        }
      );

      if (result.success && result.data) {
        console.log('🎫 Resposta completa da API (cupons):', result.data);
        
        // Verificar se a API retornou erro
        if (result.data.erro === true) {
          return {
            success: false,
            error: result.data.mensagem || 'Erro ao carregar cupons'
          };
        }

        // Extrair cupons do formato da API LIGA
        let cupons: Cupom[] = [];
        
        if (result.data.dados) {
          // Formato API LIGA: { dados: [...] }
          cupons = Array.isArray(result.data.dados) ? result.data.dados : [];
        } else if (result.data.cupons) {
          // Formato: { cupons: [...] }
          cupons = result.data.cupons;
        } else if (result.data.data) {
          // Formato: { data: [...] }
          cupons = Array.isArray(result.data.data) ? result.data.data : [];
        } else if (Array.isArray(result.data)) {
          // Formato: [...]
          cupons = result.data;
        } else {
          console.log('⚠️ Formato de resposta não reconhecido para cupons');
          cupons = [];
        }

        console.log('🎫 Cupons extraídos:', cupons);
        
        return {
          success: true,
          data: cupons
        };
      }

      return {
        success: false,
        error: 'Resposta inválida da API'
      };
    } catch (error) {
      console.error('Erro ao buscar cupons:', error);
      return {
        success: false,
        error: 'Erro ao carregar cupons'
      };
    }
  }

  /**
   * Filtrar cupons por evento
   */
  static async getCouponsByEvent(eventId: string): Promise<{ success: boolean; data?: Cupom[]; error?: string }> {
    try {
      const result = await this.getAllCoupons();
      
      if (result.success && result.data) {
        // Filtrar cupons pelo evento_id
        const eventCoupons = result.data.filter(cupom => cupom.evento_id === eventId);
        
        return {
          success: true,
          data: eventCoupons
        };
      }

      return result;
    } catch (error) {
      console.error('Erro ao filtrar cupons por evento:', error);
      return {
        success: false,
        error: 'Erro ao filtrar cupons'
      };
    }
  }

  /**
   * Criar novo cupom
   */
  static async createCoupon(couponData: CriarCupomRequest): Promise<{ success: boolean; data?: Cupom; error?: string }> {
    try {
      const result = await ApiService.request<any>(
        API_CONFIG.ENDPOINTS.CUPONS.CRIAR,
        {
          method: 'POST',
          body: couponData
        }
      );

      if (result.success && result.data) {
        console.log('🎫 Cupom criado:', result.data);
        
        // Verificar se a API retornou erro
        if (result.data.erro === true) {
          return {
            success: false,
            error: result.data.mensagem || 'Erro ao criar cupom'
          };
        }

        // Extrair cupom criado
        let cupom = null;
        if (result.data.dados) {
          cupom = result.data.dados;
        } else if (result.data.cupom) {
          cupom = result.data.cupom;
        } else if (result.data.data) {
          cupom = result.data.data;
        } else {
          cupom = result.data;
        }

        return {
          success: true,
          data: cupom
        };
      }

      return {
        success: false,
        error: 'Resposta inválida da API'
      };
    } catch (error) {
      console.error('Erro ao criar cupom:', error);
      return {
        success: false,
        error: 'Erro ao criar cupom'
      };
    }
  }

  /**
   * Formatar data de expiração do cupom
   */
  static formatExpirationDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch (error) {
      return dateString;
    }
  }

  /**
   * Verificar se cupom está expirado
   */
  static isCouponExpired(dateString: string): boolean {
    try {
      const expirationDate = new Date(dateString);
      const now = new Date();
      return expirationDate < now;
    } catch (error) {
      return false;
    }
  }

  /**
   * Calcular porcentagem de uso do cupom
   */
  static calculateUsagePercentage(usado: number, limite: number | null): number {
    if (!limite) return 0;
    return Math.min((usado / limite) * 100, 100);
  }

  /**
   * Get status do cupom baseado em uso e expiração
   */
  static getCouponStatus(cupom: Cupom): 'ativo' | 'expirado' | 'esgotado' | 'inativo' {
    // Verificar status da API (pode ser número ou string)
    const apiStatus = cupom.status;
    console.log('🎫 Processando status do cupom:', { 
      id: cupom.id, 
      codigo: cupom.codigo, 
      status: apiStatus, 
      tipo: typeof apiStatus 
    });
    
    // Se status é 0 ou "inativo", cupom está inativo
    if (apiStatus === 0 || apiStatus === '0' || 
        (typeof apiStatus === 'string' && apiStatus.toLowerCase() === 'inativo')) {
      return 'inativo';
    }
    
    // Verificar se está expirado pela data
    if (cupom.data_expiracao && this.isCouponExpired(cupom.data_expiracao)) {
      return 'expirado';
    }
    
    // Verificar se está esgotado pelo limite de uso
    if (cupom.limite_uso_por_cupom && cupom.limite_uso_por_cupom <= (cupom.usos || 0)) {
      return 'esgotado';
    }
    
    // Se status é 1 ou "ativo" e não está expirado nem esgotado, está ativo
    if (apiStatus === 1 || apiStatus === '1' || 
        (typeof apiStatus === 'string' && apiStatus.toLowerCase() === 'ativo')) {
      return 'ativo';
    }
    
    // Default para ativo se status não for reconhecido
    console.log('⚠️ Status não reconhecido, usando "ativo" como padrão');
    return 'ativo';
  }

  /**
   * Get cor do status do cupom
   */
  static getCouponStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'ativo':
        return '#10B981'; // Verde
      case 'expirado':
        return '#EF4444'; // Vermelho
      case 'esgotado':
        return '#F59E0B'; // Amarelo
      case 'inativo':
        return '#6B7280'; // Cinza
      default:
        return '#6B7280';
    }
  }
} 