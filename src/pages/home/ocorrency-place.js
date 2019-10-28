import React from 'react';
import { View } from 'react-native';

import { Layout } from '../../components';

import styles from './styles';

const OcorrencyPlace = props => {
	const { navigate } = props.navigation;

	console.log('pppppppppppppppp')

	return (
		<Layout {...props} screen = "home">
			<View />
		</Layout>
	);
};

export default OcorrencyPlace;