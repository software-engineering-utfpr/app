import React, { useState, useEffect } from 'react';
import { ScrollView, View, TouchableHighlight, Text, Image, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Icon, Input } from 'react-native-elements';
import { Root, Popup } from 'popup-ui';

import axios from 'axios';

import { login, linkWithFacebook } from '../../database';

import styles from './styles';

const MinimalSignup = props => {
	const { navigation } = props;

	const [loadingPage, setLoadingPage] = useState(false);
	const [users, setUsers] = useState([]);
	const [name, setName] = useState({
		value: navigation.state.params.name,
		error: ''
	});
	const [cpf, setCPF] = useState({
		value: '',
		error: ''
	});
	const [phone, setPhone] = useState({
		value: '',
		error: ''
	});

	const facebookID = navigation.state.params.facebookId;

	useEffect(() => {
		axios.get('https://rio-campo-limpo.herokuapp.com/api/users').then(res => {
			setUsers(res.data.map(e => e.phone));
		});
	}, []);

	const handleSubmit = () => {
		let error = false;
		setName({ ...name, error: '' });
		setCPF({ ...cpf, error: '' });
		setPhone({ ...phone, error: '' });

		if(name.value.length == 0) {
			error = true;
			setName({ ...name, error: 'Digite seu nome' });
		}

		if(cpf.value.length != 14 || !verifyCPF(cpf.value)) {
			error = true;
			setCPF({ ...cpf, error: 'CPF inválido' });
		}

		if(users.includes(phone.value)) {
			error = true;
			setPhone({ ...phone, error: 'Telefone já cadastrado' });
		}

		if(phone.value.length != 15) {
			error = true;
			setPhone({ ...phone, error: 'Telefone inválido' });
		}

		if(!error) {
			setLoadingPage(true);
			axios.post('https://rio-campo-limpo.herokuapp.com/api/users', {
				phone: phone.value, cpf: cpf.value, name: name.value, facebookID
			}).then(res => {
				linkWithFacebook(res.data._id, (err) => {
					if(!err) navigation.navigate('App');
					else {
						Popup.show({
							type: 'Danger',
							title: 'Cadastro Falhou',
							timing: 0,
							textBody: 'Usuário não foi Cadastrado. ' + err,
							buttontext: 'Ok',
							callback: () => {
								Popup.hide();
								setLoadingPage(false);
							}
						});
					}
				});
			}).catch(err => {
				Popup.show({
					type: 'Danger',
					title: 'Cadastro Falhou',
					timing: 0,
					textBody: 'Usuário não foi Cadastrado.',
					buttontext: 'Ok',
					callback: () => {
						Popup.hide();
						setLoadingPage(false);
					}
				});
			});
		}
	}

	const inputHandlerPhone = text => {
		text = text.replace(/\D/g, '').substring(0, 11);
		text = text.replace(/^(\d\d)(\d)/g, '($1) $2');
		text = text.replace(/(\d{5})(\d)/, '$1-$2');
		return text;
	}

	const inputHandlerCPF = text => {
		text = text.replace(/\D/g, '').substring(0, 11);
		text = text.replace(/^(\d{3})(\d)/g, '$1.$2');
		text = text.replace(/(\d{3})(\d)/, '$1.$2');
		text = text.replace(/(\d{3})(\d)/, '$1-$2');
		return text;
	}

	const verifyCPF = strCPF => {
		strCPF = strCPF.replace(/\D/g, '').substring(0, 11);
		let sum = 0, rest;

		if(strCPF === '00000000000') return false;

		for(let i = 1; i <= 9; i++)
			sum = sum + parseInt(strCPF.substring(i - 1, i), 10) * (11 - i);
		rest = (sum * 10) % 11;

		if(rest === 10 || rest === 11) rest = 0;
		if(rest !== parseInt(strCPF.substring(9, 10), 10)) return false;

		sum = 0;
		for(let i = 1; i <= 10; i++)
			sum = sum + parseInt(strCPF.substring(i - 1, i), 10) * (12 - i);
		rest = (sum * 10) % 11;

		if(rest === 10 || rest === 11) rest = 0;
		if(rest !== parseInt(strCPF.substring(10, 11), 10)) return false;
		return true;
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
						<Image source = {require('../../images/fonts/close.png')} />
					</TouchableHighlight>

					<ScrollView style = {{ marginTop: 170, marginBottom: 20 }}>
						<Text style = { styles.title }> Complete seu cadastro </Text>

						<Input
							inputStyle = { name.value.length == 0 ? styles.placeholder : styles.input } inputContainerStyle = {{ borderBottomWidth: 0, marginBottom: 5 }}
							placeholder = 'Seu Nome' label = { name.value.length == 0 ? '' : 'Seu Nome' } labelStyle = { styles.label }
							value = {name.value} onChangeText = { value => setName({ ...name, value, error: '' }) }
							errorMessage = {name.error} errorStyle = { styles.fontError }
						/>

						<Input
							inputStyle = { cpf.value.length == 0 ? styles.placeholder : styles.input } inputContainerStyle = {{ borderBottomWidth: 0, marginBottom: 5 }}
							placeholder = 'Seu CPF' keyboardType = 'number-pad'
							label = { cpf.value.length == 0 ? '' : 'Seu CPF' } labelStyle = { styles.label }
							value = {cpf.value} onChangeText = { value => setCPF({ ...cpf, value: inputHandlerCPF(value), error: '' }) }
							errorMessage = {cpf.error} errorStyle = { styles.fontError }
						/>

						<Input
							inputStyle = { phone.value.length == 0 ? styles.placeholder : styles.input } inputContainerStyle = {{ borderBottomWidth: 0, marginBottom: 5 }}
							placeholder = 'Seu Telefone' keyboardType = 'number-pad' textContentType = 'telephoneNumber'
							label = { phone.value.length == 0 ? '' : 'Seu Telefone' } labelStyle = { styles.label }
							value = {phone.value} onChangeText = { value => setPhone({ ...phone, value: inputHandlerPhone(value), error: '' }) }
							errorMessage = {phone.error} errorStyle = { styles.fontError }
						/>

						<TouchableHighlight underlayColor = '#FFFFFF00' onPress = { handleSubmit }>
							<LinearGradient start = {{ x: 0, y: 0 }} end = {{ x: 1, y: 0 }} colors = {['#00AD45', '#5ECC62']} style = { styles.buttonGradient }>
								<Text style = { styles.fontButton }> FINALIZAR </Text>
							</LinearGradient>
						</TouchableHighlight>
					</ScrollView>
				</Root>
			</View>
		)
	);
};

export default MinimalSignup;
