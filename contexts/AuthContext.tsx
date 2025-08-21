import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthService } from '../services/authService';
import { Usuario } from '../types/api';
import { processUserData } from '../services/userUtils';
import { ApiService } from '../services/api';

interface AuthContextType {
  user: Usuario | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  async function checkAuthStatus() {
    try {
      setLoading(true);
      const isAuthenticated = await AuthService.isAuthenticated();
      
      if (isAuthenticated) {
        // Tentar recuperar dados salvos do usuário
        console.log('Token encontrado, tentando recuperar dados do usuário...');
        const savedUserData = await ApiService.getUserData();
        
        if (savedUserData) {
          console.log('Dados do usuário recuperados:', savedUserData);
          setUser(savedUserData);
        } else {
          console.log('Nenhum dado de usuário salvo. Redirecionando para login.');
          setUser(null);
          await AuthService.logout(); // Limpar token se não há dados do usuário
        }
        
        // TODO: Quando tivermos endpoint GET /me ou similar, buscar dados reais aqui
        // const userProfile = await AuthService.getCurrentProfile();
        // if (userProfile.success) setUser(userProfile.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Erro ao verificar status de autenticação:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      setLoading(true);
      
      const result = await AuthService.login({
        user: email.trim(),
        password: password
      });

      if (result.success && result.data) {
        // Login realizado com sucesso
        console.log('Resposta completa da API:', result.data);
        console.log('🔑 Tokens disponíveis:', {
          api_token: result.data.api_token ? `${result.data.api_token.substring(0, 20)}...` : 'não encontrado',
          token: result.data.token ? `${result.data.token.substring(0, 20)}...` : 'não encontrado',
          data_api_token: result.data.data?.api_token ? `${result.data.data.api_token.substring(0, 20)}...` : 'não encontrado',
          data_token: result.data.data?.token ? `${result.data.data.token.substring(0, 20)}...` : 'não encontrado'
        });
        
        // Extrair dados do usuário da resposta da API
        let userData: Usuario | null = null;
        
        // Verificar diferentes formatos que a API pode retornar
        if (result.data.user) {
          // Formato: { token: "...", user: { id, name, email, ... } }
          userData = result.data.user;
        } else if (result.data.usuario) {
          // Formato: { token: "...", usuario: { id, name, email, ... } }
          userData = result.data.usuario;
        } else if (result.data.data?.user) {
          // Formato: { token: "...", data: { user: { id, name, email, ... } } }
          userData = result.data.data.user;
        } else if (result.data.data?.usuario) {
          // Formato: { token: "...", data: { usuario: { id, name, email, ... } } }
          userData = result.data.data.usuario;
        } else {
          // Construir usuário com dados diretos da resposta
          userData = processUserData({
            ...result.data,
            email: result.data.email || email.trim() // Garantir que tenha email
          });
        }

        // Se conseguiu extrair dados do usuário, usar eles
        if (userData) {
          console.log('Dados do usuário extraídos:', userData);
          console.log('🖼️ Avatar extraído:', {
            path_avatar: userData.path_avatar,
            path_avatar_aprovado: userData.path_avatar_aprovado,
            avatar: userData.avatar
          });
          console.log('👥 Grupos e role:', {
            grupos_usuario: userData.grupos_usuario,
            role: userData.role
          });
          
          // Salvar dados do usuário no storage
          await ApiService.saveUserData(userData);
          setUser(userData);
        } else {
          // Fallback: tentar buscar dados do usuário com o email
          console.log('Tentando buscar dados do usuário por email...');
          const userResult = await AuthService.getCurrentUser(email.trim());
          
          if (userResult.success && userResult.data) {
            await ApiService.saveUserData(userResult.data);
            setUser(userResult.data);
          } else {
            // Último fallback: dados básicos
            const fallbackUser = {
              id: 'unknown',
              name: email.split('@')[0], // Usar parte do email como nome
              email: email.trim(),
              cpf: '',
              path_avatar: undefined,
              path_avatar_aprovado: require('../assets/profile/121321221.png'),
              avatar: undefined,
              created_at: new Date().toISOString(),
              status_aprovacao: 'aprovado',
              grupos_usuario: [],
              role: 'Usuário'
            };
            
            await ApiService.saveUserData(fallbackUser);
            setUser(fallbackUser);
          }
        }
        
        return { success: true };
      } else {
        setUser(null);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setUser(null);
      return { success: false, error: 'Erro interno. Tente novamente.' };
    } finally {
      setLoading(false);
    }
  }

  async function logout(): Promise<void> {
    try {
      setLoading(true);
      await AuthService.logout();
      // Dados do usuário já são removidos no AuthService.logout() -> ApiService.removeAuthToken()
      setUser(null);
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      setLoading(false);
    }
  }

  async function refreshUser(): Promise<void> {
    if (user?.email) {
      try {
        const userResult = await AuthService.getCurrentUser(user.email);
        if (userResult.success && userResult.data) {
          setUser(userResult.data);
        }
      } catch (error) {
        console.error('Erro ao atualizar dados do usuário:', error);
      }
    }
  }

  const value = {
    user,
    loading,
    login,
    logout,
    refreshUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
} 