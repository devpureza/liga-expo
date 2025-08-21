// Tipos base para as respostas da API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Tipos de Autenticação
export interface LoginRequest {
  user: string; // email
  password: string;
}

export interface LoginResponse {
  token: string;
  api_token?: string; // Token específico da API LIGA
  user?: Usuario; // Dados completos do usuário
  usuario?: Usuario; // Algumas APIs retornam com esse nome
  name?: string; // Nome do usuário
  email?: string; // Email do usuário
  id?: string; // ID do usuário
  expires_at?: string;
  // Campos extras que a API pode retornar
  data?: {
    user?: Usuario;
    usuario?: Usuario;
    token?: string;
    api_token?: string;
    [key: string]: any;
  };
  [key: string]: any; // Para capturar outros campos não mapeados
}

// Tipos de Usuário
export interface Usuario {
  id: string;
  name: string;
  email: string;
  cpf?: string;
  path_avatar_aprovado?: string; // URL completa do avatar (formato antigo)
  path_avatar?: string; // URL do avatar (formato atual da API)
  avatar?: string; // Fallback para outras APIs
  created_at: string;
  status_aprovacao?: string;
  grupos_usuario?: string[]; // Array de grupos do usuário
  role?: string; // Role calculado baseado na hierarquia
}

// Hierarquia de roles (do maior para o menor)
export const ROLE_HIERARCHY = [
  'administradores',
  'produtor', 
  'atletica',
  'comissario',
  'pdv-local'
] as const;

// Mapeamento de nomes para exibição
export const ROLE_DISPLAY_NAMES = {
  'administradores': 'Administrador',
  'produtor': 'Produtor',
  'atletica': 'Atlética', 
  'comissario': 'Comissário',
  'pdv-local': 'PDV Local'
} as const;

export interface BuscarUsuariosRequest {
  nome?: string;
  email?: string;
  cpf?: string;
  limit?: number;
}

// Tipos de Evento
export interface Evento {
  id: string;
  nome: string;
  data_evento: string;
  status: string;
  nome_local: string;
  cidade: string;
  estado: string;
  descricao?: string;
  // Campos extras que a API pode retornar
  data_inicio?: string;
  data_fim?: string;
  horario_inicio?: string;
  horario_fim?: string;
  capacidade_maxima?: number;
  vendas_ativas?: boolean;
  imagem_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EditarEventoRequest {
  nome?: string;
  descricao?: string;
  data_evento?: string;
  nome_local?: string;
  cidade?: string;
  estado?: string;
}

// Tipos de Ingresso
export interface Ingresso {
  id: string;
  nome: string;
  valor: number;
  quantidade_disponivel: number;
  permitir_compra: boolean;
}

export interface EditarIngressoRequest {
  nome?: string;
  valor?: number;
  quantidade_disponivel?: number;
  permitir_compra?: boolean;
}

// Tipos de Lote
export interface Lote {
  id: string;
  nome: string;
  valor: number;
  quantidade_disponivel: number;
  status: 'ativo' | 'inativo';
  inicio_venda: string;
  termino_venda: string;
}

export interface EditarLoteRequest {
  nome?: string;
  valor?: number;
  quantidade_disponivel?: number;
  status?: 'ativo' | 'inativo';
  inicio_venda?: string;
  termino_venda?: string;
}

// Tipos de Cupom
export interface Cupom {
  id: string;
  codigo: string;
  valor: number | string; // API pode retornar como string
  tipo_desconto: 'percentual' | 'fixo';
  status: string | number; // API pode retornar 0/1 ou string
  data_expiracao: string;
  limite_uso_por_cupom: number;
  evento_id: string;
  evento_nome: string;
  // Campos extras que a API pode retornar
  descricao?: string;
  usos?: number; // Quantidade de vezes que foi usado
  ativo?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CriarCupomRequest {
  evento_id: string;
  codigo: string;
  valor: number;
  tipo_desconto: 'percentual' | 'fixo';
  data_expiracao: string;
  limite_uso_por_cupom: number;
  descricao: string;
}

// Tipos de Cortesia
export interface Cortesia {
  id: string;
  evento: any;
  ingresso: any;
  lote: any;
  usuario: any;
  data_criacao: string;
  // Campos extras que a API pode retornar
  evento_id?: string;
  ingresso_id?: string;
  usuario_id?: string;
  status?: string;
  data_utilizacao?: string;
  data_expiracao?: string;
  nome_usuario?: string;
  nome_ingresso?: string;
  quantidade?: number;
  observacoes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DispararCortesiaRequest {
  cortesia_id: string;
  quantidade: number;
  destinatarios: string[];
}

// Tipos de Validação
export interface LerQRCodeRequest {
  qr_code: string;
}

export interface ValidacaoFacialRequest {
  imagem_base64: string;
  usuario_id: string;
}

// Tipos de Relatório
export interface RelatorioVendasParams {
  data_inicio: string; // YYYY-MM-DD
  data_fim: string; // YYYY-MM-DD
}

// Tipos de erro
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
} 