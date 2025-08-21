import { Usuario, ROLE_HIERARCHY, ROLE_DISPLAY_NAMES } from '../types/api';

/**
 * Calcula o role de maior hierarquia do usuário baseado nos grupos
 */
export function calculateUserRole(grupos_usuario?: string[]): string {
  if (!grupos_usuario || grupos_usuario.length === 0) {
    return 'Usuário'; // Role padrão
  }

  // Encontrar o role de maior hierarquia
  for (const role of ROLE_HIERARCHY) {
    if (grupos_usuario.includes(role)) {
      return ROLE_DISPLAY_NAMES[role];
    }
  }

  // Se não encontrar nenhum role conhecido, usar o primeiro grupo
  return grupos_usuario[0];
}

/**
 * Verifica se o usuário tem um role específico
 */
export function hasRole(usuario: Usuario, role: string): boolean {
  return usuario.grupos_usuario?.includes(role) || false;
}

/**
 * Verifica se o usuário é administrador
 */
export function isAdmin(usuario: Usuario): boolean {
  return hasRole(usuario, 'administradores');
}

/**
 * Verifica se o usuário tem permissão de PDV
 */
export function canUsePDV(usuario: Usuario): boolean {
  return hasRole(usuario, 'pdv-local') || 
         hasRole(usuario, 'administradores') || 
         hasRole(usuario, 'produtor');
}

/**
 * Processa dados do usuário da API e calcula role
 */
export function processUserData(userData: any): Usuario {
  const grupos_usuario = userData.grupos_usuario || [];
  const role = calculateUserRole(grupos_usuario);

  return {
    id: userData.id || userData.user_id || 'unknown',
    name: userData.name || userData.nome || 'Usuário',
    email: userData.email || '',
    cpf: userData.cpf || '',
    path_avatar: userData.path_avatar,
    path_avatar_aprovado: userData.path_avatar_aprovado,
    avatar: userData.avatar,
    created_at: userData.created_at || new Date().toISOString(),
    status_aprovacao: userData.status_aprovacao || 'aprovado',
    grupos_usuario,
    role
  };
}

/**
 * Get cor do role para exibição
 */
export function getRoleColor(role: string): string {
  switch (role) {
    case 'Administrador':
      return '#EF4444'; // Vermelho
    case 'Produtor':
      return '#8B5CF6'; // Roxo
    case 'Atlética':
      return '#10B981'; // Verde
    case 'Comissário':
      return '#F59E0B'; // Amarelo
    case 'PDV Local':
      return '#3B82F6'; // Azul
    default:
      return '#6B7280'; // Cinza
  }
} 