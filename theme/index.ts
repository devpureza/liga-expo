import { DarkTheme as NavDark, DefaultTheme as NavLight, Theme } from '@react-navigation/native';
import { palette } from './palette';

export type AppTheme = Theme & {
	colors: Theme['colors'] & {
		backgroundElevated: string;
		cardBorder: string;
		mutedText: string;
		buttonTextOnPrimary: string;
		brandGradient: string[];
		inputBackground: string;
		inputText: string;
		inputBorder: string;
		inputPlaceholder: string;
		cardText: string;
		cardMuted: string;
	};
};

const NAVY = '#00051c';

export const lightTheme: AppTheme = {
	...NavLight,
	colors: {
		...NavLight.colors,
		primary: palette.blue.base,
		background: NAVY,
		backgroundElevated: NAVY,
		card: palette.grey.lightest,
		cardBorder: '#E5E7EB',
		text: '#ffffff',
		mutedText: '#E2E8F0',
		border: '#1F2637',
		notification: palette.pink.base,
		buttonTextOnPrimary: palette.white,
		brandGradient: palette.brandGradient,
		inputBackground: palette.white,
		inputText: '#101010',
		inputBorder: '#E5E7EB',
		inputPlaceholder: '#6B7280',
		cardText: '#101010',
		cardMuted: '#6B7280'
	}
};

export const darkTheme: AppTheme = {
	...NavDark,
	colors: {
		...NavDark.colors,
		primary: palette.blue.base,
		background: NAVY,
		backgroundElevated: NAVY,
		card: palette.grey.lightest,
		cardBorder: '#E5E7EB',
		text: '#ffffff',
		mutedText: '#A0AEC0',
		border: '#1F2637',
		notification: palette.pink.base,
		buttonTextOnPrimary: palette.white,
		brandGradient: palette.brandGradient,
		inputBackground: palette.white,
		inputText: '#101010',
		inputBorder: '#E5E7EB',
		inputPlaceholder: '#6B7280',
		cardText: '#101010',
		cardMuted: '#6B7280'
	}
}; 