import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import { TabBar } from '@ant-design/react-native';
import { Root } from 'popup-ui';

const styles = StyleSheet.create({
	containerFull: {
		minHeight: '100%',
		flex: 1,
		backgroundColor: '#FFFFFF'
	},

	text: {
		fontFamily: 'QuestrialRegular'
	}
});

const Layout = props => {
	const { navigate } = props.navigation;

	const [pageHeight, setHeight] = useState(0);
	const [heightStatus, setHeightStatus] = useState(false);

	return (
    <SafeAreaView>
      <View style = { styles.containerFull } onLayout = { (event) => { if(!heightStatus) { setHeight(event.nativeEvent.layout.height); setHeightStatus(true); } } }>
				<Root style = {{ height: pageHeight - 50 }}>
					{ props.children }
				</Root>

				<TabBar unselectedTintColor = "#2D2E2E" tintColor = "#00AD45" barTintColor = "#FAFCFE">
					<TabBar.Item
						title = {<Text style = { styles.text }> Cartilha </Text>} icon = {<Image style = {{ width: 20, height: 20 }} source = {require('../images/fonts/question-black.png')} />}
						selected = { props.screen === 'primer' } selectedIcon = {<Image style = {{ width: 20, height: 20 }} source = {require('../images/fonts/question-tint.png')} />}
						onPress = { () => navigate('Primer') }
					/>

					<TabBar.Item
						title = {<Text style = { styles.text }> Calendário </Text>} icon = {<Image style = {{ width: 20, height: 20 }} source = {require('../images/fonts/calendar-black.png')} />}
						selected = { props.screen === 'calendar' } selectedIcon = {<Image style = {{ width: 20, height: 20 }} source = {require('../images/fonts/calendar-tint.png')} />}
						onPress = { () => navigate('Calendar') }
					/>

					<TabBar.Item
						title = {<Text style = { styles.text }> Home </Text>} icon = {<Image style = {{ width: 20, height: 20 }} source = {require('../images/fonts/home-black.png')} />}
						selected = { props.screen === 'home' }selectedIcon = {<Image style = {{ width: 20, height: 20 }} source = {require('../images/fonts/home-tint.png')} />}
						onPress = { () => navigate('Home') }
					/>

					<TabBar.Item
						title = {<Text style = { styles.text }> Formulários </Text>} icon = {<Image style = {{ width: 20, height: 20 }} source = {require('../images/fonts/forms-black.png')} />}
						selected = { props.screen === 'forms' } selectedIcon = {<Image style = {{ width: 20, height: 20 }} source = {require('../images/fonts/forms-tint.png')} />}
						onPress = { () => navigate('Forms') }
					/>

					<TabBar.Item
						title = {<Text style = { styles.text }> Jogos </Text>} icon = {<Image style = {{ width: 20, height: 20 }} source = {require('../images/fonts/games-black.png')} />}
						selected = { props.screen === 'games' } selectedIcon = {<Image style = {{ width: 20, height: 20 }} source = {require('../images/fonts/games-tint.png')} />}
						onPress = { () => navigate('Games') }
					/>
				</TabBar>
      </View>
    </SafeAreaView>
	);
};

export default Layout;