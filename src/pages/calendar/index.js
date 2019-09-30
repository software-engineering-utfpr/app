import React from 'react';
import { View } from 'react-native';

import { Layout } from '../../components';

import styles from './styles';

const Calendar = props => {
	const { navigate } = props.navigation;

	return (
		<Layout {...props} screen = "calendar">
			<View />
		</Layout>
	);
};

export default Calendar;