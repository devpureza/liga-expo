import { Stack } from 'expo-router';
import { ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme } from '../theme';
import { AuthProvider } from '../contexts/AuthContext';

export default function RootLayout() {
	const colorScheme = useColorScheme();
	return (
		<ThemeProvider value={colorScheme === 'dark' ? darkTheme : lightTheme}>
			<AuthProvider>
				<Stack 
					screenOptions={{ 
						headerShown: false,
						headerStyle: { backgroundColor: '#0B0D17' },
						headerShadowVisible: false,
						headerTintColor: '#ffffff'
					}} 
				/>
			</AuthProvider>
		</ThemeProvider>
	);
} 