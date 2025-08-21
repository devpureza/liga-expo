// Configurações do ambiente
const DEV_CONFIG = {
  BASE_URL: 'https://www.deualiga.com.br', // Para desenvolvimento local
  TIMEOUT: 10000, // 10 segundos
  DEBUG: true
};

const PROD_CONFIG = {
  BASE_URL: 'https://www.deualiga.com.br', // URL de produção (configurar depois)
  TIMEOUT: 15000, // 15 segundos
  DEBUG: false
};

// Função para detectar ambiente
function getEnvironment() {
  // No Expo, podemos usar __DEV__ para detectar desenvolvimento
  return __DEV__ ? 'development' : 'production';
}

// Exportar configuração baseada no ambiente
export const CONFIG = getEnvironment() === 'development' ? DEV_CONFIG : PROD_CONFIG;

// Função para atualizar base URL em runtime (útil para testes)
export function setBaseUrl(url: string) {
  if (getEnvironment() === 'development') {
    CONFIG.BASE_URL = url;
    console.log('Base URL atualizada para:', url);
  }
}

// URLs de exemplo para diferentes ambientes
export const EXAMPLE_URLS = {
  localhost: 'http://localhost',
  localNetwork: 'http://192.168.1.100', // IP da máquina local na rede
  staging: 'https://staging-api.liga.com',
  production: 'https://api.liga.com'
}; 