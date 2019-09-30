import React from 'react';
import { View, Text } from 'react-native';

import { Layout } from '../../components';

import styles from './styles';

const Primer = props => {
	const { navigate } = props.navigation;

	return (
		<Layout {...props} screen = "primer">
			<Text>dddddd</Text>
		</Layout>
	);
};

export default Primer;