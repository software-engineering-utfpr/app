import React from 'react';
import { View } from 'react-native';

const Splash = props => {
	const { navigate } = props.navigation;

	setTimeout(() => {
		navigate('Auth');
	}, 500);

	return <View />;
};

export default Splash;
