import { createStackNavigator } from 'react-navigation';

import PrimerScreen from './primer';
import LeavingsScreen from './leavings';
import AnalysisScreen from './analisys';

const Primer = createStackNavigator({
	Primer: {
		screen: PrimerScreen
	},
	Leavings: {
		screen: LeavingsScreen
	},
	Analysis: {
		screen: AnalysisScreen
	}
}, {
	initialRouteName: 'Primer',
	defaultNavigationOptions: {
		header: null
	}
});

export default Primer;
