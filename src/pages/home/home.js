import React from 'react';
import { View, Button } from 'react-native';

import { Layout } from '../../components';

import styles from './styles';

const Home = props => {
	const { navigate } = props.navigation;

	return (
		<Layout {...props} screen = "home">
			<View />
			<Button onPress = { () => navigate('Profile') } title = "Perfil" />
		</Layout>
	);
};

export default Home;