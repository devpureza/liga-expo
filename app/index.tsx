import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

export default function Index() {
  const { user, loading } = useAuth();
  const { colors } = useTheme() as any;

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Usuário está logado, redirecionar para events
        router.replace('/events');
      } else {
        // Usuário não está logado, redirecionar para login
        router.replace('/login');
      }
    }
  }, [user, loading]);

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Retorna null para não renderizar nada após redirecionamento
  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
}); 