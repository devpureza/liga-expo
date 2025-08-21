import { ApiService, API_CONFIG } from './api';
import { LoginRequest, LoginResponse, Usuario, BuscarUsuariosRequest } from '../types/api';

export class AuthService {
  
  /**
   * Realizar login do usuário
   */
  static async login(credentials: LoginRequest): Promise<{ success: boolean; data?: LoginResponse; error?: string }> {
    try {
      const result = await ApiService.request<LoginResponse>(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        {
          method: 'POST',
          body: credentials,
          includeAuth: false // Login não precisa de token
        }
      );

      if (result.success && result.data) {
        // Priorizar api_token da resposta da API LIGA
        const authToken = result.data.api_token || 
                         result.data.data?.api_token || 
                         result.data.token || 
                         result.data.data?.token;

        if (authToken) {
          // Salvar token no storage
          await ApiService.saveAuthToken(authToken);
          console.log('🔑 Token salvo:', authToken.substring(0, 20) + '...');
        } else {
          console.error('❌ Nenhum token encontrado na resposta da API');
          return {
            success: false,
            error: 'Token não encontrado na resposta do servidor'
          };
        }
      }

      return result;
    } catch (error) {
      console.error('Erro no login:', error);
      return {
        success: false,
        error: 'Erro interno. Tente novamente.'
      };
    }
  }

  /**
   * Realizar logout do usuário
   */
  static async logout(): Promise<void> {
    try {
      // Remover token do storage
      await ApiService.removeAuthToken();
      console.log('Logout realizado com sucesso');
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  }

  /**
   * Verificar se usuário está autenticado
   */
  static async isAuthenticated(): Promise<boolean> {
    return await ApiService.isAuthenticated();
  }

  /**
   * Buscar dados do usuário logado (busca por email)
   */
  static async getCurrentUser(email: string): Promise<{ success: boolean; data?: Usuario; error?: string }> {
    try {
      const result = await ApiService.request<Usuario[]>(
        API_CONFIG.ENDPOINTS.USUARIOS.BUSCAR,
        {
          method: 'GET',
          queryParams: { email, limit: '1' }
        }
      );

      if (result.success && result.data && result.data.length > 0) {
        return {
          success: true,
          data: result.data[0] // Retorna o primeiro usuário encontrado
        };
      }

      return {
        success: false,
        error: 'Usuário não encontrado'
      };
    } catch (error) {
      console.error('Erro ao buscar usuário atual:', error);
      return {
        success: false,
        error: 'Erro ao buscar dados do usuário'
      };
    }
  }

  /**
   * Buscar usuários com filtros
   */
  static async searchUsers(filters: BuscarUsuariosRequest): Promise<{ success: boolean; data?: Usuario[]; error?: string }> {
    try {
      const queryParams: Record<string, string> = {};
      
      if (filters.nome) queryParams.nome = filters.nome;
      if (filters.email) queryParams.email = filters.email;
      if (filters.cpf) queryParams.cpf = filters.cpf;
      if (filters.limit) queryParams.limit = filters.limit.toString();

      const result = await ApiService.request<Usuario[]>(
        API_CONFIG.ENDPOINTS.USUARIOS.BUSCAR,
        {
          method: 'GET',
          queryParams
        }
      );

      return result;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return {
        success: false,
        error: 'Erro ao buscar usuários'
      };
    }
  }

  /**
   * Buscar usuário por CPF (para PDV)
   */
  static async findUserByCPF(cpf: string): Promise<{ success: boolean; data?: Usuario; error?: string }> {
    try {
      const result = await this.searchUsers({ cpf, limit: 1 });
      
      if (result.success && result.data && result.data.length > 0) {
        return {
          success: true,
          data: result.data[0]
        };
      }

      return {
        success: false,
        error: 'Usuário não encontrado com este CPF'
      };
    } catch (error) {
      console.error('Erro ao buscar usuário por CPF:', error);
      return {
        success: false,
        error: 'Erro ao buscar usuário'
      };
    }
  }
} 