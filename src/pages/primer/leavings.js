import React from 'react';
import { View } from 'react-native';

import { Layout } from '../../components';

import styles from './styles';

const Leavings = props => {
	const { navigate } = props.navigation;

	return (
		<Layout {...props} screen = "orimer">
			<View />
		</Layout>
	);
};

export default Leavings;