import React from 'react';
import { View } from 'react-native';

import { Layout } from '../../components';

import styles from './styles';

const OcorrencyData = props => {
	const { navigate } = props.navigation;

	return (
		<Layout {...props} screen = "home">
			<View />
		</Layout>
	);
};

export default OcorrencyData;