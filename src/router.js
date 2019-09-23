import {
	createStackNavigator,
	createDrawerNavigator,
	createSwitchNavigator,
	createAppContainer,
} from 'react-navigation';

import Splash from './pages/splash';
import Login from './pages/log-in';
import Signin from './pages/sign-in';

import Home from './pages/home';

const authentication = createStackNavigator({
	Login: {
		screen: Login,
		navigationOptions: {
			header: null
		}
	},
	Signin: {
		screen: Signin,
		navigationOptions: {
			header: null
		}
	}
}, {
	initialRouteName: 'Login',
});

const app = createDrawerNavigator({
	Home
}, {
	initialRouteName: 'Home',
	drawerBackgroundColor: 'rgba(255, 255, 255, .9)',
	overlayColor: 'rgba(255, 255, 255, .7)',
	contentOptions: {
		activeTintColor: 'rgb(255, 255, 255)',
		activeBackgroundColor: '#c0392b'
	}
});

const Router = createAppContainer(
	createSwitchNavigator({
		Loading: Splash,
		Auth: authentication,
		App: app
	}, {
		initialRouteName: 'Loading'
	})
);

export default Router;
