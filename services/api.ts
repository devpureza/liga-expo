import AsyncStorage from '@react-native-async-storage/async-storage';
import { CONFIG } from './config';

// Configuração base da API
export const API_CONFIG = {
  BASE_URL: CONFIG.BASE_URL, // Usa configuração baseada no ambiente
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/appadmin/auth/login',
    },
    USUARIOS: {
      BUSCAR: '/api/appadmin/usuarios',
    },
    EVENTOS: {
      ATIVOS: '/api/appadmin/eventos/ativos',
      DETALHES: '/api/appadmin/eventos',
    },
    INGRESSOS: {
      LISTAR: '/api/appadmin/eventos',
      EDITAR: '/api/appadmin/ingressos',
    },
    LOTES: {
      LISTAR: '/api/appadmin/eventos',
      EDITAR: '/api/appadmin/lotes',
    },
    CUPONS: {
      LISTAR: '/api/appadmin/cupons',
      CRIAR: '/api/appadmin/cupons',
    },
    CORTESIAS: {
      LISTAR: '/api/appadmin/cortesias',
      DISPARAR: '/api/appadmin/cortesias/disparar',
    },
    VALIDACAO: {
      QR_CODE: '/api/appadmin/qrcode/ler',
      FACIAL: '/api/appadmin/validacao/facial',
    }
  }
};

// Função helper para fazer requisições HTTP
export class ApiService {
  private static async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('auth_token');
    } catch (error) {
      console.error('Erro ao buscar token:', error);
      return null;
    }
  }

  private static async getHeaders(includeAuth: boolean = true) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = await this.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  static async request<T>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
      body?: any;
      includeAuth?: boolean;
      queryParams?: Record<string, string>;
    } = {}
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    try {
      const { method = 'GET', body, includeAuth = true, queryParams } = options;
      
      // Construir URL com query params
      let url = `${API_CONFIG.BASE_URL}${endpoint}`;
      if (queryParams) {
        const params = new URLSearchParams(queryParams);
        url += `?${params.toString()}`;
      }

      const headers = await this.getHeaders(includeAuth);

      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      const responseData = await response.json();

      // Debug: logar resposta da API
      if (CONFIG.DEBUG) {
        console.log('🔍 API Request:', { 
          url, 
          method, 
          headers: {
            ...headers,
            'Authorization': headers['Authorization'] ? `${headers['Authorization'].substring(0, 20)}...` : 'NENHUM'
          }, 
          body 
        });
        console.log('📥 API Response:', { status: response.status, data: responseData });
      }

      if (!response.ok) {
        return {
          success: false,
          error: responseData.message || `Erro ${response.status}`
        };
      }

      return {
        success: true,
        data: responseData
      };

    } catch (error) {
      console.error('Erro na requisição:', error);
      return {
        success: false,
        error: 'Erro de conexão. Verifique sua internet.'
      };
    }
  }

  // Salvar token no storage
  static async saveAuthToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem('auth_token', token);
    } catch (error) {
      console.error('Erro ao salvar token:', error);
    }
  }

  // Remover token do storage
  static async removeAuthToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_data'); // Remover dados do usuário também
    } catch (error) {
      console.error('Erro ao remover token:', error);
    }
  }

  // Salvar dados do usuário no storage
  static async saveUserData(userData: any): Promise<void> {
    try {
      await AsyncStorage.setItem('user_data', JSON.stringify(userData));
    } catch (error) {
      console.error('Erro ao salvar dados do usuário:', error);
    }
  }

  // Recuperar dados do usuário do storage
  static async getUserData(): Promise<any | null> {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Erro ao recuperar dados do usuário:', error);
      return null;
    }
  }

  // Verificar se usuário está logado
  static async isAuthenticated(): Promise<boolean> {
    const token = await this.getAuthToken();
    return !!token;
  }
} 