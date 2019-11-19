import React, { useState, useEffect } from 'react';
import { View, Text, TouchableHighlight, Image, ActivityIndicator, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Popup, Root } from 'popup-ui';

import MapView from 'react-native-maps';
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
	const [loadingScreen, setLoadingScreen] = useState(false);

	useEffect(() => {
		setLoadingScreen(true);

		Geolocation.getCurrentPosition((position) => {
			Geocoder.init(GOOGLE_MAPS_APIKEY);
			Geocoder.from(position.coords.latitude, position.coords.longitude).then(json => {
				const city = json.results[0].address_components[3].long_name;
				const state = json.results[0].address_components[4].short_name;

				if(city === "Campo Mourão" && state === "PR") {
					setRegion({...region,
						latitude: position.coords.latitude,
						longitude: position.coords.longitude,
						latitudeDelta: 0.005,
						longitudeDelta: 0.0121
					});
				}

				setLoadingScreen(false);
			}).catch(error => {
				setLoadingScreen(false);
			});
		});
	}, []);

	const confirmMap = () => {
		setLoadingScreen(true);

		Geocoder.init(GOOGLE_MAPS_APIKEY);
		Geocoder.from(region.latitude, region.longitude).then(json => {
			const state = json.results[0].address_components.filter(e => e.types.includes('administrative_area_level_1'))[0].long_name;
			const city = json.results[0].address_components.filter(e => e.types.includes('administrative_area_level_2'))[0].short_name;

			if(city !== "Campo Mourão" || (state !== "PR" && state !== "Paraná")) {
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
				navigation.navigate('OcorrencyData', { region });
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

				<Image source = {require('../../images/fonts/pin-maps.png')} style = {{ height: 36, width: 20.3773585, position: 'absolute', left: (Dimensions.get('window').width/2) - 10, bottom: (Dimensions.get('window').height/2) - 25, zIndex: 99999 }} />

				<MapView
					style = {{ flex: 1, height: Dimensions.get('window').height || 400, width: Dimensions.get('window').width || 200 }}
					onRegionChange = { (region) => setRegion(region) }
					initialRegion = {{
						latitude: region.latitude || -24.044106,
						longitude: region.longitude || -52.378633,
						latitudeDelta: region.latitudeDelta || 0.005,
						longitudeDelta: region.longitudeDelta || 0.0121
					}}
					regions = {region}
				/>

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