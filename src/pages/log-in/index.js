import React, { useState } from 'react';
import { ScrollView, View, TouchableHighlight, Text, Image, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Icon, Input } from 'react-native-elements';
import { Root, Popup } from 'popup-ui';

import { login, facebookLogin } from '../../database';

import styles from './styles';

const Login = props => {
	const { navigation } = props;

	const [loadingPage, setLoadingPage] = useState(false);
	const [phone, setPhone] = useState({
		value: '',
		error: ''
	});
	const [password, setPassword] = useState({
		value: '',
		visibility: false,
		error: ''
	});

	const handleSubmit = () => {
		let error = false;
		setPhone({ ...phone, error: '' });
		setPassword({ ...password, error: '' });

		if(phone.value.length != 15) {
			error = true;
			setPhone({ ...phone, error: 'Telefone inválido' });
		}

		if(password.value.length == 0) {
			error = true;
			setPassword({ ...password, error: 'Digite uma senha' });
		}

		if(!error) {
			setLoadingPage(true);
			login(phone.value, password.value, (err) => {
				if(!err) navigation.navigate('App');
				else {
					Popup.show({
						type: 'Danger',
						title: 'Login Falhou',
						timing: 0,
						textBody: 'Usuário não Encontrado.',
						buttontext: 'Ok',
						callback: () => {
							Popup.hide();
							setLoadingPage(false);
						}
					});

					setPhone({ value: '',	error: '' });
					setPassword({ value: '', visibility: false, error: '' });
				}
			});
		}
	}

	const facebookLoginSubmit = () => {
		setLoadingPage(true);
		facebookLogin(navigation, setLoadingPage, (err) => {
			if(!err) navigation.navigate('App');
			else {
				Popup.show({
					type: 'Danger',
					title: 'Login Falhou',
					timing: 0,
					textBody: 'Falha ao fazer login com Facebook. ' + err,
					buttontext: 'Ok',
					callback: () => {
						Popup.hide();
						setLoadingPage(false);
					}
				});
			}
		});
	}

	const inputHandlerPhone = text => {
		text = text.replace(/\D/g, '').substring(0, 11);
		text = text.replace(/^(\d\d)(\d)/g, '($1) $2');
		text = text.replace(/(\d{5})(\d)/, '$1-$2');
		return text;
	}

	return (
		loadingPage ? (
			<Root>
				<View style = {[styles.vertical, styles.horizontal, { backgroundColor: '#FFFFFF', minHeight: '100%' }]}>
					<ActivityIndicator size = 'large' color = '#00AD45' />
				</View>
			</Root>
		) : (
			<View style = {{ backgroundColor: '#FFFFFF', minHeight: '100%' }}>
				<Root>
					<Image style = {{ position: 'absolute', top: 0 }} source = {require('../../images/upwave.png')} />
					<TouchableHighlight style = {{ position: 'absolute', top: 17, left: 11 }} underlayColor = '#FFFFFF00' onPress = { () => navigation.goBack() }>
						<Image source = {require('../../images/fonts/arrow-left-white.png')} />
					</TouchableHighlight>

					<ScrollView style = {{ marginTop: 170, marginBottom: 20 }}>
						<Text style = { styles.title }> Entre no sistema </Text>

						<Input
							inputStyle = { phone.value.length == 0 ? styles.placeholder : styles.input } inputContainerStyle = {{ borderBottomWidth: 0, marginBottom: 5 }}
							placeholder = 'Seu Telefone' keyboardType = 'number-pad' textContentType = 'telephoneNumber'
							label = { phone.value.length == 0 ? '' : 'Seu Telefone' } labelStyle = { styles.label }
							value = {phone.value} onChangeText = { value => setPhone({ ...phone, value: inputHandlerPhone(value), error: '' }) }
							errorMessage = {phone.error} errorStyle = { styles.fontError }
						/>

						<Input
							inputStyle = { password.value.length == 0 ? styles.placeholder : styles.input } inputContainerStyle = {{ borderBottomWidth: 0, marginBottom: 5 }} secureTextEntry = {!password.visibility} textContentType = 'password'
							placeholder = 'Sua Senha' autoCompleteType = 'password' autoCapitalize = 'none'
							value = {password.value} onChangeText = { value => setPassword({ ...password, value, error: '' }) }
							label = { password.value.length == 0 ? '' : 'Sua Senha' } labelStyle = { styles.label }
							rightIconContainerStyle = {{ position: 'absolute', top: 7, right: 15 }}
							rightIcon = {<Icon name = { password.visibility ? 'visibility-off' : 'visibility' } onPress = { () => setPassword({ ...password, visibility: !password.visibility }) } color = '#515252' size = {18} />}
							errorMessage = {password.error} errorStyle = { styles.fontError }
						/>

						<TouchableHighlight underlayColor = '#FFFFFF00' onPress = { handleSubmit }>
							<LinearGradient start = {{ x: 0, y: 0 }} end = {{ x: 1, y: 0 }} colors = {['#00AD45', '#5ECC62']} style = { styles.buttonGradient }>
								<Text style = { styles.fontButton }> ENTRAR </Text>
							</LinearGradient>
						</TouchableHighlight>

						<Text style = { styles.fontBlack }> ─────   OU   ───── </Text>

						<TouchableHighlight underlayColor = '#FFFFFF00' onPress = { facebookLoginSubmit }>
							<LinearGradient start = {{ x: 0, y: 0 }} end = {{ x: 1, y: 0 }} colors = {['#2F559E', '#50A1FF']} style = { styles.buttonGradient }>
								<Icon name = 'facebook' type = 'font-awesome' color = '#FFFFFF' iconStyle = {{ position: 'absolute', left: 25, top: 12 }} />
								<Text style = { styles.fontButton }> ENTRAR COM FACEBOOK </Text>
							</LinearGradient>
						</TouchableHighlight>

						<TouchableHighlight underlayColor = '#FFFFFF00' onPress = { () => navigation.navigate('Signup') }>
							<Text style = { styles.fontSecondary }> Crie sua Conta </Text>
						</TouchableHighlight>
					</ScrollView>
				</Root>
			</View>
		)
	);
};

export default Login;
