import { Image } from 'react-native';

export default function HeaderLogo() {
	return (
		<Image source={require('../assets/logo/Colorida-Offwhite.png')} style={{ width: 120, height: 32 }} resizeMode="contain" />
	);
} 