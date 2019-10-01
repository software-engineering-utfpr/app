import React, { useEffect, useState } from 'react';
import { View, Image, TouchableHighlight, ActivityIndicator } from 'react-native';
import { Header } from 'react-native-elements';
import { Popup, Root } from 'popup-ui';

import { Layout } from '../../components';
import { query } from '../../database';

import styles from './styles';

const Analysis = props => {
	const { navigate } = props.navigation;

	const [user, setUser] = useState({});
	const [loadingScreen, setLoadingScreen] = useState(false);

	useEffect(() => {
		setLoadingScreen(true);

		setLoadingScreen(false);

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
					leftComponent = {<Image source = {require('../../images/fonts/arrow-left-black.png')} />}
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
			</Layout>
		)
	);
};

export default Analysis;