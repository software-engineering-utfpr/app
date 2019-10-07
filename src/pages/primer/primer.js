import React, { useEffect, useState } from 'react';
import { View, ScrollView, Image, Text, TouchableHighlight, ActivityIndicator } from 'react-native';
import { Header, SearchBar } from 'react-native-elements';
import { Popup, Root } from 'popup-ui';

import { Layout } from '../../components';
import { query } from '../../database';

import axios from 'axios';

import styles from './styles';

const Primer = props => {
	const { navigate } = props.navigation;

	const [user, setUser] = useState({});
	const [loadingScreen, setLoadingScreen] = useState(false);
	const [leavings, setLeavings] = useState([]);

	useEffect(() => {
		setLoadingScreen(true);

		axios.get('https://rio-campo-limpo.herokuapp.com/api/leavings').then((res) => {
      setLoadingScreen(false);
			setLeavings(res.data);
    }).catch((err) => {
      setLoadingScreen(false);
			Popup.show({
				type: 'Danger',
				title: 'ERRO',
				timing: 0,
				textBody: 'Não foi possível obter os resíduos.',
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
			<Layout {...props} screen = "primer">
				<Header
					containerStyle = {{ backgroundColor: '#FFFFFF', marginTop: -30 }}
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

				{ leavings.length === 0 ? (
					<Text style = {{ fontFamily: 'Raleway-Regular', fontSize: 18, color: '#515252', textAlign: 'center', textAlignVertical: 'center', height: '90%' }}> Não há Exemplos na Cartilha </Text>
				) : (
					<ScrollView>
						<Text style = { styles.title }>Cartilha</Text>
						<Text style = { styles.subtitle }>
							Veja os principais locais de descarte de diferentes tipos de resíduos.
						</Text>

						<Text style = { styles.listTitle }> Resíduos </Text>
						<View style = {{ paddingBottom: 10 }}>
							{ leavings.map((item) => (
								<View key = { item._id } style = { styles.containerItem }>
									<Image source = {{ uri: item.image }} style = {{ width: 40, height: 40, borderRadius: 20, marginRight: 13 }} />
									<View style = {{flex: 1, flexDirection: 'column'}}>
										<Text style = {{ fontFamily: 'Raleway-Bold', color: '#2D2E2E', fontSize: 18, paddingRight: 100, width: '100%' }}> { item.name } </Text>
										<Text style = {{ fontFamily: 'Raleway-Regular', color: '#515252', fontSize: 16, paddingTop: 5, letterSpacing: 0.05, paddingRight: 10, width: '100%' }} numberOfLines = {1}> { item.description } </Text>

										<TouchableHighlight style = {{ position: 'absolute', width: 24, height: 24, right: -5, top: 10, alignItems: 'center' }} underlayColor = '#FFFFFF00' onPress = { () => navigate('Leavings', { id: item._id }) }>
											<Image source = {require('../../images/fonts/chevron-right.png')}  style = {{ width: 24, height: 24 }} />
										</TouchableHighlight>
									</View>
								</View>
							)) }
						</View>
					</ScrollView>
				) }
			</Layout>
		)
	);
};

export default Primer;