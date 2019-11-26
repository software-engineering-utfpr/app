import { createStackNavigator } from 'react-navigation';

import HomeScreen from './home';
import MapScreen from './map';
import OcorrencyDataScreen from './ocorrency-data';

const Home = createStackNavigator({
	Home: {
		screen: HomeScreen
	},
	Map: {
		screen: MapScreen
	},
	OcorrencyData: {
		screen: OcorrencyDataScreen
	}
}, {
	initialRouteName: 'OcorrencyData',
	defaultNavigationOptions: {
		header: null
	}
});

export default Home;
