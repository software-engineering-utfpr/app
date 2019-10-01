import React from 'react';
import { View, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import moment from 'moment';
import 'moment/locale/pt-br';

import Router from './router';

moment.locale('pt-BR');

const App = () => {
	const StatusBarHeight = StatusBar.currentHeight;

	return (
		<>
			<View style = {{ height: StatusBarHeight, width: '100%' }}>
				<LinearGradient start = {{ x: 0, y: 0 }} end = {{ x: 1, y: 0 }} colors = {["#5ECC62", "#00AD45"]} style = {{ flex: 1 }}>
					<StatusBar barStyle = "light-content" translucent = {true} backgroundColor = {'transparent'} />
				</LinearGradient>
			</View>
			
			<Router />
		</>
	);
};

export default App;
