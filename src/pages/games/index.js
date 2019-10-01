import React, { useEffect, useState } from 'react';
import { View, ScrollView, Image, Text, TouchableHighlight, Linking, ActivityIndicator } from 'react-native';
import { Header, Rating } from 'react-native-elements';
import { Popup, Root } from 'popup-ui';

import { Layout } from '../../components';
import { query } from '../../database';

import axios from 'axios';

import styles from './styles';

const Games = props => {
	const { navigate } = props.navigation;

	const [user, setUser] = useState({});
	const [games, setGames] = useState([]);
	const [loadingScreen, setLoadingScreen] = useState(false);

	useEffect(() => {
		setLoadingScreen(true);

    axios.get('https://rio-campo-limpo.herokuapp.com/api/games').then((res) => {
      setLoadingScreen(false);
      setGames(res.data);
    }).catch((err) => {
      setLoadingScreen(false);
			Popup.show({
				type: 'Danger',
				title: 'ERRO',
				timing: 0,
				textBody: 'Não foi possível obter os jogos.',
				buttontext: 'Ok',
				callback: () => {
					Popup.hide();
					setLoadingScreen(false);
					props.navigation.goBack();
				}
			});
    });

		query('SELECT * FROM user').then(res => {
			const user = res.rows.item(0);
			setUser(user);
		}).catch(err => {
			Popup.show({
				type: 'Danger',
				title: 'ERRO',
				timing: 0,
				textBody: 'Não foi possível obter suas informações.',
				buttontext: 'Ok',
				callback: () => {
					Popup.hide();
				}
			});
		});
	}, []);

	return (
		loadingScreen ? (
			<Root>
				<View style = {[styles.vertical, styles.horizontal, { backgroundColor: '#FFFFFF', minHeight: '100%' }]}>
					<ActivityIndicator size = 'large' color = '#00AD45' />
				</View>
			</Root>
		) : (
			<Layout {...props} screen = "games">
				<Header
					containerStyle = {{ backgroundColor: '#FFFFFF', marginTop: -30 }}
					centerComponent = {{ text: 'JOGOS', style: { color: '#2D2E2E', fontFamily: 'QuestrialRegular', fontSize: 20, textAlignVertical: 'center' } }}
					rightComponent = {
						user ? (
							<TouchableHighlight underlayColor = '#FFFFFF00' onPress = { () => navigate('Profile') }>
								<Image source = {{ uri: user.image }} style = { styles.image } />
							</TouchableHighlight>
						) : (
							<TouchableHighlight underlayColor = '#FFFFFF00' onPress = { () => navigate('Auth') }>
								<Image source = {require('../../images/fonts/login.png')} style = {{ width: 28, height: 28 }} />
							</TouchableHighlight>
						)
					}
				/>

				{ games.length === 0 ? (
					<Text> Não há Jogos </Text>
				) : (
					<ScrollView>
						<View style = {{ paddingTop: 20, paddingBottom: 10 }}>
							{ games.map((item) => (
								<View key = { item._id } style = { styles.containerItem }>
									<Image source = {{ uri: item.image }} style = {{ width: 70, height: 70, borderRadius: 15, marginRight: 10 }} />
									<Text style = {{ fontFamily: 'QuestrialRegular', fontSize: 18, paddingRight: 100, paddingBottom: 50, width: '100%' }}> { item.name } </Text>
									<TouchableHighlight style = {{ position: 'absolute', width: 23, height: 23, bottom: 10, right: 14 }} underlayColor = '#FFFFFF00' onPress = { () => Linking.openURL(item.link) }>
										<Image source = {require('../../images/fonts/download.png')}  style = {{ width: 22, height: 22 }} />
									</TouchableHighlight>

									<Rating style = {{ position: 'absolute', bottom: 10, left: 100 }} type = "custom" ratingBackgroundColor = "#FAFCFE" tintColor = "#FAFCFE" readonly fractions = {1} startingValue = { item.score } imageSize = {22} />
								</View>
							)) }
						</View>
					</ScrollView>
				) }

				<View />
			</Layout>
		)
	);
};

export default Games;