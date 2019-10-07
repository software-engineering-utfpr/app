import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, Image, Linking, TouchableHighlight, ActivityIndicator } from 'react-native';
import { Header } from 'react-native-elements';
import { Popup, Root } from 'popup-ui';

import MapView, { Marker } from 'react-native-maps';

import { Layout } from '../../components';
import { query } from '../../database';

import axios from 'axios';

import styles from './styles';

const Leavings = props => {
	const { navigate, state, goBack } = props.navigation;
	const { params } = state;

	const [user, setUser] = useState({});
	const [loadingScreen, setLoadingScreen] = useState(false);
	const [leaving, setLeaving] = useState('');

	useEffect(() => {
		setLoadingScreen(true);

		axios.get(`https://rio-campo-limpo.herokuapp.com/api/leavings/${params.id}`).then((res) => {
      setLoadingScreen(false);
			setLeaving(res.data);
    }).catch((err) => {
      setLoadingScreen(false);
			Popup.show({
				type: 'Danger',
				title: 'ERRO',
				timing: 0,
				textBody: 'Não foi possível obter os dados.',
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
					leftComponent = {
						<TouchableHighlight underlayColor = '#FFFFFF00' onPress = { () => goBack() }>
							<Image source = {require('../../images/fonts/arrow-left-black.png')} />
						</TouchableHighlight>
					}
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

				<ScrollView>
					<Text style = { styles.leavingTitle }> { leaving.name } </Text>
					<Text style = { styles.leavingSubtitle }> { leaving.description } </Text>

					<Text style = { styles.mapTitle }> Onde Descartar? </Text>
					<MapView
						style = {{ flex: 1, height: 250 }}
						region = {{
							latitude: leaving.latitude || -24.044106,
							longitude: leaving.longitude || -52.378633,
							latitudeDelta: 0.005,
							longitudeDelta: 0.0121,
						}}
					>
						<Marker
							title = "Local de Descarte"
							description = { leaving.name }
							onPress = { (e) => Linking.openURL(`http://maps.google.com/maps?q=${leaving.latitude},${leaving.longitude}`) }
							coordinate = {{
								latitude: leaving.latitude || -24.044106,
								longitude: leaving.longitude || -52.378633,
							}}
						/>
					</MapView>
				</ScrollView>
			</Layout>
		)
	);
};

export default Leavings;