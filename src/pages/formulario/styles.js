import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	header: {
		height: Platform.select({
			ios: 44,
			android: 56,
		}),
		paddingTop: 0,
	},
});

export default styles;
