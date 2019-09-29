import {
	createStackNavigator,
	createDrawerNavigator,
	createSwitchNavigator,
	createAppContainer,
} from 'react-navigation';

import Splash from './pages/splash';
import Login from './pages/log-in';
import Signup from './pages/sign-up';
import MinimalSignup from './pages/minimal-sign-up';

import Home from './pages/home';
import Profile from './pages/profile';

import Calendar from './pages/calendar';
import Forms from './pages/forms';
import Games from './pages/games';
import Primer from './pages/primer';

const authentication = createDrawerNavigator({
	Login, Signup, MinimalSignup
}, {
	initialRouteName: 'Login'
});

const app = createDrawerNavigator({
	Home, Profile, Calendar, Forms, Games, Primer
}, {
	initialRouteName: 'Home'
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
