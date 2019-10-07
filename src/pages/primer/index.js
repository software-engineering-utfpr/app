import { createStackNavigator } from 'react-navigation';

import PrimerScreen from './primer';
import LeavingsScreen from './leavings';

const Primer = createStackNavigator({
	Primer: {
		screen: PrimerScreen
	},
	Leavings: {
		screen: LeavingsScreen
	}
}, {
	initialRouteName: 'Primer',
	defaultNavigationOptions: {
		header: null
	}
});

export default Primer;
