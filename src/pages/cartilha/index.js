import { createStackNavigator } from 'react-navigation';

import CartilhaScreen from './cartilha';
import ResiduosScreen from './cartilha-residuo';
import AnaliseScreen from './cartilha-analise';

const Cartilha = createStackNavigator({
	Cartilha: {
		screen: CartilhaScreen
	},
	Residuos: {
		screen: ResiduosScreen
	},
	Analise: {
		screen: AnaliseScreen
	}
}, {
	initialRouteName: 'Cartilha',
	defaultNavigationOptions: {
		header: null
	}
});

export default Cartilha;
