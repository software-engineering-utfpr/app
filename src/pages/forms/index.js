import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Image, TouchableHighlight, ActivityIndicator, Linking } from 'react-native';
import { Header } from 'react-native-elements';
import { Popup, Root } from 'popup-ui';

import moment from 'moment';
import axios from 'axios';

import { Layout } from '../../components';
import { query } from '../../database';

import styles from './styles';

const Forms = props => {
	const { navigate } = props.navigation;

	const [user, setUser] = useState({});
	const [forms, setForms] = useState([]);
	const [loadingScreen, setLoadingScreen] = useState(false);
  const [pageUpdate, setPageUpdate] = useState(false);

	useEffect(() => {
		setLoadingScreen(true);

    axios.get('https://rio-campo-limpo.herokuapp.com/api/forms').then((res) => {
      setLoadingScreen(false);
			setForms(res.data.sort((a, b) => moment(a.expireDate).isBefore(moment(b.expireDate)) ? -1 : moment(a.expireDate).isAfter(moment(b.expireDate)) ? 1 : 0));
    }).catch((err) => {
      setLoadingScreen(false);
			Popup.show({
				type: 'Danger',
				title: 'ERRO',
				timing: 0,
				textBody: 'Não foi possível obter os formulários.',
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

			if(user) {
				axios.get(`https://rio-campo-limpo.herokuapp.com/api/users/${user.id}`).then((res) => {
					setUser(res.data);
				}).catch((err) => {
					setUser(user);

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
			} else {
				setUser(user);
			}
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
	}, [pageUpdate]);

	const handleForm = (form) => {
		setLoadingScreen(true);

		if(user) {
			axios.put('https://rio-campo-limpo.herokuapp.com/api/users/forms', {
				id: user._id, forms: user.forms.concat([{ form: form._id }])
			}).then((res) => {
				setPageUpdate(!pageUpdate);
				Linking.openURL(form.link);
			}).catch((err) => {
				setLoadingScreen(false);
				Popup.show({
					type: 'Danger',
					title: 'ERRO',
					timing: 0,
					textBody: 'Não foi possível verificar formulário.',
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
	};

	return (
		loadingScreen ? (
			<Root>
				<View style = {[styles.vertical, styles.horizontal, { backgroundColor: '#FFFFFF', minHeight: '100%' }]}>
					<ActivityIndicator size = 'large' color = '#00AD45' />
				</View>
			</Root>
		) : (
			<Layout {...props} screen = "forms">
				<Header
					containerStyle = {{ backgroundColor: '#FFFFFF', marginTop: -30 }}
					centerComponent = {{ text: 'FORMULÁRIOS', style: { color: '#2D2E2E', fontFamily: 'Raleway-Regular', fontSize: 20, textAlignVertical: 'center' } }}
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

				{ forms.length === 0 ? (
					<Text style = {{ fontFamily: 'Raleway-Regular', fontSize: 18, color: '#515252', textAlign: 'center', textAlignVertical: 'center', height: '90%' }}> Não há Formulários </Text>
				) : (
					<ScrollView>
						<View style = {{ paddingTop: 20, paddingBottom: 10 }}>
							{ forms.map((item) => (
								user && user.forms && user.forms.map(e => e.form).includes(item._id) ? (
									<View key = { item._id } style = { styles.containerItem }>
										<View style = {{ width: 20, height: 20, borderRadius: 50, marginRight: 10, backgroundColor: '#00AD45' }} />
										<View style = {{ paddingRight: 30, paddingBottom: 50, width: '100%' }}>
											<Text style = {{ fontFamily: 'Raleway-Bold', fontSize: 18, color: '#2D2E2E' }}> Pesquisa já Respondida </Text>
											<Text style = {{ fontFamily: 'Raleway-Regular', fontSize: 14 }}> Respondida { moment(user.forms[user.forms.map(e => e.form).indexOf(item._id)].visitedAt).fromNow() } </Text>
										</View>
									</View>
								) : moment().isBefore(moment(item.expireDate)) ? (
									<TouchableHighlight underlayColor = '#FFFFFF00' onPress = { () => handleForm(item) } key = { item._id } style = { styles.containerItem }>
										<>
											<View style = {{ width: 20, height: 20, borderRadius: 50, marginRight: 10, backgroundColor: '#FFF460' }} />
											<View style = {{ paddingRight: 30, paddingBottom: 50, width: '100%' }}>
												<Text style = {{ fontFamily: 'Raleway-Bold', fontSize: 18, color: '#2D2E2E' }}> NOVA Pesquisa </Text>
												<Text style = {{ fontFamily: 'Raleway-Regular', fontSize: 14 }}> Aberta até { moment(item.expireDate).fromNow() } </Text>
											</View>
										</>
									</TouchableHighlight>
								) : (
									<View key = { item._id } style = { styles.containerItem }>
										<View style = {{ width: 20, height: 20, borderRadius: 50, marginRight: 10, backgroundColor: '#FF5154' }} />
										<View style = {{ paddingRight: 30, paddingBottom: 50, width: '100%' }}>
											<Text style = {{ fontFamily: 'Raleway-Bold', fontSize: 18, color: '#2D2E2E' }}> Pesquisa não Respondida </Text>
											<Text style = {{ fontFamily: 'Raleway-Regular', fontSize: 14 }}> Expirou { moment(item.expireDate).fromNow() } </Text>
										</View>
									</View>
								)
							)) }
						</View>
					</ScrollView>
				) }
			</Layout>
		)
	);
};

export default Forms;