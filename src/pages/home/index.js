import { createStackNavigator } from 'react-navigation';

import HomeScreen from './home';
import MapScreen from './map';
import OcorrencyPlaceScreen from './ocorrency-place';
import OcorrencyDataScreen from './ocorrency-data';

const Home = createStackNavigator({
	Home: {
		screen: HomeScreen
	},
	Map: {
		screen: MapScreen
	},
	OcorrencyPlace: {
		screen: OcorrencyPlaceScreen
	},
	OcorrencyData: {
		screen: OcorrencyDataScreen
	}
}, {
	initialRouteName: 'Home',
	defaultNavigationOptions: {
		header: null
	}
});

export default Home;
