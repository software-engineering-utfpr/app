import React from 'react';
import { View } from 'react-native';

import { checkUser } from './stories';

const Splash = props => {
	const { navigate } = props.navigation;

	checkUser(() => {
		setTimeout(() => navigate('Auth'), 500);
	});

	return <View />;
};

export default Splash;
