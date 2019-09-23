import { createStackNavigator } from 'react-navigation';

import HomeScreen from './home';
import IdentificacaoScreen from './identificacao';
import MapaScreen from './mapa';
import LocalOcorrenciaScreen from './local-ocorrencia';
import DadosOcorrenciaScreen from './dados-ocorrencia';

const Home = createStackNavigator({
	Home: {
		screen: HomeScreen
	},
	Identificacao: {
		screen: IdentificacaoScreen
	},
	Mapa: {
		screen: MapaScreen
	},
	LocalOcorrencia: {
		screen: LocalOcorrenciaScreen
	},
	DadosOcorrencia: {
		screen: DadosOcorrenciaScreen
	}
}, {
	initialRouteName: 'Home',
	defaultNavigationOptions: {
		header: null
	}
});

export default Home;
