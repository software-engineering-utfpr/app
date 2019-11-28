import React, { useEffect, useState } from 'react';
import { ScrollView, View, Image, Text, TouchableHighlight, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Header } from 'react-native-elements';
import { Popup, Root } from 'popup-ui';

import axios from 'axios';
import moment from 'moment';

import { Layout } from '../../components';
import { query } from '../../database';

import styles from './styles';

const Home = props => {
	const { navigate } = props.navigation;

	const [user, setUser] = useState({});
	const [occurrences, setOccurences] = useState([]);
	const [loadingScreen, setLoadingScreen] = useState(false);

	useEffect(() => {
		setLoadingScreen(true);
		query('SELECT * FROM user').then(res => {
			const user = res.rows.item(0);

			if(user) {
				axios.get(`https://rio-campo-limpo.herokuapp.com/api/occurrences/user/${user.id}`).then((res) => {
					setOccurences(res.data);
					setLoadingScreen(false);
				}).catch((err) => {
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
			} else {
				setLoadingScreen(false);
			}

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
					setLoadingScreen(false);
				}
			});
		});
	}, []);

	const openMap = () => {
		if(!user) {
			Popup.show({
				type: 'Warning',
				title: 'ATENÇÃO',
				timing: 0,
				textBody: 'Você não está logado no sistema. Sua nova ocorrência será feita de forma anônima.',
				buttontext: 'Continuar',
				callback: () => {
					Popup.hide();
					navigate('Map');
				}
			});
		} else {
			navigate('Map');
		}
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
				<Header
					containerStyle = {{ backgroundColor: '#FFFFFF', marginTop: -30 }}
					centerComponent = {{ text: 'OCORÊNCIAS', style: { color: '#2D2E2E', fontFamily: 'Raleway-Regular', fontSize: 20, textAlignVertical: 'center' } }}
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

				{ occurrences.length === 0 ? (
					<ScrollView>
						<Text style = { styles.title }>Bem-vindo</Text>
						<Text style = { styles.subtitle }>
							Ocorrências anônimas registradas não serão apresentadas no aplicativo. Para poder consultar e acompanhar a denúncia, cadastre-se.
						</Text>

						<Text style = {[styles.subtitle, { fontFamily: 'Raleway-SemiBold' }]}>
							Clique em + para registrar uma ocorrência.
						</Text>
					</ScrollView>
				) : (
					<ScrollView>
						<Text style = { styles.title }>Bem-vindo</Text>
						<Text style = { styles.subtitle }>
							Aqui estão as suas ocorrências.
						</Text>
						<View style = {{ paddingTop: 20, paddingBottom: 10 }}>
							{ occurrences.map(item => (
								<View key = { item._id } style = { styles.containerItem }>
									<View style = {{ width: 20, height: 20, borderRadius: 50, marginRight: 10, backgroundColor: '#2F80ED' }} />
									<View style = {{ paddingRight: 30, paddingBottom: 50, width: '100%' }}>
										<Text style = {{ fontFamily: 'Raleway-Bold', fontSize: 18, color: '#2D2E2E' }}> { item._id.substring(6) } </Text>
										<Text style = {{ fontFamily: 'Raleway-Regular', fontSize: 14 }}> Realizada { moment(item.date).fromNow() } </Text>
									</View>
								</View>
							)) }
						</View>
					</ScrollView>
				) }

				<TouchableHighlight underlayColor = '#FFFFFF00' onPress = { () => openMap() } style = { styles.plusButtonContainer }>
					<LinearGradient start = {{ x: 0, y: 0 }} end = {{ x: 1, y: 0 }} colors = {['#00AD45', '#5ECC62']} style = { styles.plusButton }>
						<Text style = { styles.fontButton }> + </Text>
					</LinearGradient>
				</TouchableHighlight>
			</Layout>
		)
	);
};

export default Home;