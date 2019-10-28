import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableHighlight, Image, ActivityIndicator, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Popup, Root } from 'popup-ui';

import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';

import { Layout } from '../../components';

import styles from './styles';

const GOOGLE_MAPS_APIKEY = 'AIzaSyBr2j26w3QZ77VoKhmfb4whjAGLlBhJ_0U';

const Map = props => {
	const { navigation } = props;

	const [region, setRegion] = useState({
		latitude: -24.044106,
		longitude: -52.378633,
		latitudeDelta: 0.005,
		longitudeDelta: 0.0121
	});
	const [visibleMap, setVisibleMap] = useState(true);
	const [loadingScreen, setLoadingScreen] = useState(false);

	useEffect(() => {
		setLoadingScreen(true);

		Geolocation.getCurrentPosition((position) => {
			Geocoder.init(GOOGLE_MAPS_APIKEY);
			Geocoder.from(position.coords.latitude, position.coords.longitude).then(json => {
				const city = json.results[0].address_components[3].long_name;
				const state = json.results[0].address_components[4].short_name;

				if(city === "Campo Mourão" && state === "PR") {
					setRegion({
						latitude: position.coords.latitude,
						longitude: position.coords.longitude
					});
				}

				setLoadingScreen(false);
			}).catch(error => {
				setLoadingScreen(false);
			});
		});
	}, []);

	console.log('ooooo');

	const confirmMap = () => {
		setLoadingScreen(true);

		Geocoder.init(GOOGLE_MAPS_APIKEY);
		Geocoder.from(region.latitude, region.longitude).then(json => {
			const city = json.results[0].address_components[3].long_name;
			const state = json.results[0].address_components[4].short_name;

			if(city !== "Campo Mourão" || state !== "PR") {
				Popup.show({
					type: 'Danger',
					title: 'ERRO',
					timing: 0,
					textBody: 'Coordenadas devem ser em Campo Mourão - PR.',
					buttontext: 'Ok',
					callback: () => {
						Popup.hide();
						setLoadingScreen(false);
					}
				});
			} else {
				setLoadingScreen(false);
				setVisibleMap(false);
				navigation.navigate('OcorrencyPlace', { region });
			}
		}).catch(error => {
			Popup.show({
				type: 'Danger',
				title: 'ERRO',
				timing: 0,
				textBody: 'Não foi possível obter as suas ocorrências.',
				buttontext: 'Ok',
				callback: () => {
					Popup.hide();
					setLoadingScreen(false);
				}
			});
		});
	};

	return (
		loadingScreen ? (
			<Root>
				<View style = {[styles.vertical, styles.horizontal, { backgroundColor: '#FFFFFF', minHeight: '100%' }]}>
					<ActivityIndicator size = 'large' color = '#00AD45' />
				</View>
			</Root>
		) : (
			<Layout {...props} screen = "home">
				<TouchableHighlight style = {{ position: 'absolute', top: 17, left: 11, zIndex: 99999 }} underlayColor = '#FFFFFF00' onPress = { () => navigation.goBack() }>
					<Image source = {require('../../images/fonts/arrow-left-black.png')} />
				</TouchableHighlight>

				{ visibleMap ? (
					<MapView
						style = {{ flex: 1, height: Dimensions.get('window').height }}
						onRegionChange = { (region) => setRegion(region) }
						initialRegion = {{
							latitude: region.latitude || -24.044106,
							longitude: region.longitude || -52.378633,
							latitudeDelta: 0.005,
							longitudeDelta: 0.0121
						}}
						regions = {region}
					>
						<Marker
							coordinate = {{
								latitude: region.latitude,
								longitude: region.longitude
							}}
						/>
					</MapView>
				) : (<View />) }

				<TouchableHighlight underlayColor = '#FFFFFF00' onPress = { confirmMap } style = {{ position: 'absolute', bottom: 20, width: Dimensions.get('window').width - 30, left: 15 }}>
					<LinearGradient start = {{ x: 0, y: 0 }} end = {{ x: 1, y: 0 }} colors = {['#00AD45', '#5ECC62']} style = { styles.buttonGradientAbsolute }>
						<Image source = {require('../../images/fonts/map-pin-white.png')} style = {{ position: 'absolute', height: 24, width: 24, top: 13, left: 12 }} />
						<Text style = { styles.fontButtonGradient }> Selecionar Localização </Text>
					</LinearGradient>
				</TouchableHighlight>
			</Layout>
		)
	);
};

export default Map;