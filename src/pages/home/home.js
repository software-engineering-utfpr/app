import React from 'react';
import { View, Text } from 'react-native';

import './styles';

const Home = props => {
	const { navigate } = props.navigation;

	return (
		<View>
			<Text> Home </Text>
		</View>
	);
};

export default Home;