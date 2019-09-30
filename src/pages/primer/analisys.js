import React from 'react';
import { View } from 'react-native';

import { Layout } from '../../components';

import styles from './styles';

const Analysis = props => {
	const { navigate } = props.navigation;

	return (
		<Layout {...props} screen = "primer">
			<View />
		</Layout>
	);
};

export default Analysis;