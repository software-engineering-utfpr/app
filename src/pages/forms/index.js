import React from 'react';
import { View } from 'react-native';

import { Layout } from '../../components';

import styles from './styles';

const Forms = props => {
	const { navigate } = props.navigation;

	return (
		<Layout {...props} screen = "forms">
			<View />
		</Layout>
	);
};

export default Forms;