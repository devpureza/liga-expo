export const palette = {
	black: '#000000',
	white: '#ffffff',
	// Brand gradient (aproximação baseada no material enviado)
	brandGradient: ['#F9637F', '#0f1758'],
	purple: {
		lightest: '#6F00F5',
		light: '#5100B3',
		base: '#360077',
		dark: '#2C0061',
		darkest: '#100041'
	},
	pink: {
		light: '#F9637F',
		base: '#F2385A',
		dark: '#DB1FA1',
		darkest: '#C02446'
	},
	orange: {
		lightest: '#FF5C39',
		light: '#F7856D',
		base: '#F23E17',
		dark: '#DB3916',
		darkest: '#B12F13'
	},
	blue: {
		lightest: '#E2E2F3',
		light: '#A4B8FF',
		base: '#0f1758',
		dark: '#0f1758',
		base50: 'rgba(15, 23, 88, 0.5)'
	},
	grey: {
		lightest: '#f4f4f4',
		light: '#e6e6e6',
		base: '#d0d0d0',
		dark: '#b7b7b7',
		darkest: '#282828'
	},
	green: {
		lightest: '#F7D774',
		light: '#4C0B4B',
		base: '#1DC24A',
		dark: '#15C5A3'
	}
};

export type Palette = typeof palette; 