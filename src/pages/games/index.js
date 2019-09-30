import React from 'react';
import { View } from 'react-native';

import { Layout } from '../../components';

import styles from './styles';

const Games = props => {
	const { navigate } = props.navigation;

	return (
		<Layout {...props} screen = "games">
			<View />
		</Layout>
	);
};

export default Games;