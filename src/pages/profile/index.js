import React, { useState, useEffect } from 'react';
import { ScrollView, View, TouchableHighlight, Text, Image, ActivityIndicator } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import { Icon, Input } from 'react-native-elements';
import { Root, Popup } from 'popup-ui';

import axios from 'axios';

import { updateUserLocal, logout, query } from '../../database';

import styles from './styles';

const Profile = props => {
	const { navigation } = props;

	const [loadingPage, setLoadingPage] = useState(false);
	const [users, setUsers] = useState([]);
	const [user, setUser] = useState({});
	const [profilePhoto, setProfilePhoto] = useState('');
	const [name, setName] = useState({
		value: '',
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
	const [password, setPassword] = useState({
		value: '',
		visibility: false,
		error: ''
	});

	useEffect(() => {
		setLoadingPage(true);
		axios.get('https://rio-campo-limpo.herokuapp.com/api/users').then(res => {
			setUsers(res.data);
		});

		query('SELECT * FROM user').then(res => {
			const user = res.rows.item(0);
			setName({ ...name, value: user.name });
			setCPF({ ...cpf, value: user.cpf });
			setPhone({ ...phone, value: user.phone });
			setProfilePhoto(user.image);
			setUser(user);
			setLoadingPage(false);
		}).catch(err => {
			Popup.show({
				type: 'Danger',
				title: 'ERRO',
				timing: 0,
				textBody: 'Não foi possível obter suas informações.',
				buttontext: 'Ok',
				callback: () => {
					Popup.hide();
					navigation.goBack();
				}
			});
		});
	}, []);

	const handleSubmit = () => {
		let error = false;
		setName({ ...name, error: '' });
		setCPF({ ...cpf, error: '' });
		setPhone({ ...phone, error: '' });
		setPassword({ ...password, error: '' });

		if(name.value.length == 0) {
			error = true;
			setName({ ...name, error: 'Digite seu nome' });
		}

		if(cpf.value.length != 14 || !verifyCPF(cpf.value)) {
			error = true;
			setCPF({ ...cpf, error: 'CPF inválido' });
		}

		if(users.map(e => e.phone).includes(phone.value) && users[users.map(e => e.phone).indexOf(phone.value)]._id != id) {
			error = true;
			setPhone({ ...phone, error: 'Telefone já cadastrado' });
		}

		if(phone.value.length != 15) {
			error = true;
			setPhone({ ...phone, error: 'Telefone inválido' });
		}

		if(!error) {
			setLoadingPage(true);
			axios.put('https://rio-campo-limpo.herokuapp.com/api/users', {
				id: user.id, name: name.value, cpf: cpf.value, phone: phone.value, password: password.value
			}).then(res => {
				updateUserLocal(user.id, phone.value, cpf.value, name.value, profilePhoto, () => {
					Popup.show({
						type: 'Success',
						title: 'Edição Realizada com Sucesso',
						timing: 0,
						textBody: 'Dados foram atualizados.',
						buttontext: 'Ok',
						callback: () => {
							Popup.hide();
							setLoadingPage(false);
						}
					});
				});
			}).catch(err => {
				Popup.show({
					type: 'Danger',
					title: 'Edição não Realizada',
					timing: 0,
					textBody: 'Verifique a internet e tente novamente mais tarde.',
					buttontext: 'Ok',
					callback: () => {
						Popup.hide();
						setLoadingPage(false);
					}
				});
			});
		}
	}

	const changePhotoProfile = () => {
    ImagePicker.launchImageLibrary({}, response => {
      if(response.uri) {
				setLoadingPage(true);

				const formData = new FormData();
    		formData.append('api_key', '584136724691346');
    		formData.append('timestamp', (Date.now() / 1000));
				formData.append('upload_preset', 'p9jvf6ai');
				formData.append('file', { uri: response.uri, type: response.type || 'image/jpeg', name: response.fileName });
				
				axios.post('https://api.cloudinary.com/v1_1/dnnkqjrbi/image/upload', formData, {
					headers: { 'X-Requested-With': 'XMLHttpRequest' }
				}).then(res => {
					const image = res.data.secure_url;
					axios.put('https://rio-campo-limpo.herokuapp.com/api/users', {
						id: user.id, image
					}).then(resUser => {
						setProfilePhoto(image);
						updateUserLocal(user.id, user.phone, user.cpf, user.name, image, () => {
							Popup.show({
								type: 'Success',
								title: 'Edição Realizada com Sucesso',
								timing: 0,
								textBody: 'Foto de Perfil foi atualizada.',
								buttontext: 'Ok',
								callback: () => {
									Popup.hide();
									setLoadingPage(false);
								}
							});
						});
					}).catch(err => {
						Popup.show({
							type: 'Danger',
							title: 'Edição não Realizada',
							timing: 0,
							textBody: 'Verifique a internet e tente novamente mais tarde.',
							buttontext: 'Ok',
							callback: () => {
								Popup.hide();
								setLoadingPage(false);
							}
						});
					});
				}).catch(err => {
					Popup.show({
						type: 'Danger',
						title: 'ERRO',
						timing: 0,
						textBody: 'Não foi possível salvar sua nova foto.',
						buttontext: 'Ok',
						callback: () => {
							Popup.hide();
							setLoadingPage(false);
						}
					});
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
					<TouchableHighlight style = {{ position: 'absolute', top: 17, left: 11 }} underlayColor = '#FFFFFF00' onPress = { () => navigation.goBack() }>
						<Image source = {require('../../images/fonts/arrow-left-black.png')} />
					</TouchableHighlight>

					<ScrollView style = {{ marginTop: 50, marginBottom: 20 }}>
						<Text style = { styles.title }> Seus dados </Text>

						{ profilePhoto ? (
							<View style = {{ justifyContent: 'center', alignItems: 'center', marginBottom: 30 }}>
								<Image source = {{ uri: profilePhoto }} style = { styles.image } />

								<TouchableHighlight style = { styles.fontImagePosition } underlayColor = '#FFFFFF00' onPress = { changePhotoProfile }>
									<Text style = { styles.fontImage }> Editar </Text>
								</TouchableHighlight>
							</View>
						) : (<View />) }

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

						{ !user.facebookID ? (
							<Input
								inputStyle = { password.value.length == 0 ? styles.placeholder : styles.input } inputContainerStyle = {{ borderBottomWidth: 0, marginBottom: 5 }} secureTextEntry = {!password.visibility} textContentType = 'password'
								placeholder = 'Nova Senha' autoCompleteType = 'password' autoCapitalize = 'none'
								value = {password.value} onChangeText = { value => setPassword({ ...password, value, error: '' }) }
								label = { password.value.length == 0 ? '' : 'Nova Senha' } labelStyle = { styles.label }
								rightIconContainerStyle = {{ position: 'absolute', top: 7, right: 15 }}
								rightIcon = {<Icon name = { password.visibility ? 'visibility-off' : 'visibility' } onPress = { () => setPassword({ ...password, visibility: !password.visibility }) } color = '#515252' size = {18} />}
								errorMessage = {password.error} errorStyle = { styles.fontError }
							/>
						) : null }

						<TouchableHighlight underlayColor = '#FFFFFF00' onPress = { handleSubmit }>
							<LinearGradient start = {{ x: 0, y: 0 }} end = {{ x: 1, y: 0 }} colors = {['#00AD45', '#5ECC62']} style = { styles.buttonGradient }>
								<Text style = { styles.fontButton }> SALVAR </Text>
							</LinearGradient>
						</TouchableHighlight>

						<TouchableHighlight underlayColor = '#FFFFFF00' onPress = { () => logout(() => navigation.navigate('Home')) }>
							<LinearGradient start = {{ x: 0, y: 0 }} end = {{ x: 1, y: 0 }} colors = {['#2D2E2E', '#515252']} style = {[styles.buttonGradient, { marginTop: 20 }]}>
								<Icon name = 'sign-out' type = 'font-awesome' color = '#FFFFFF' iconStyle = {{ position: 'absolute', left: 25, top: 12 }} />
								<Text style = { styles.fontButton }> SAIR </Text>
							</LinearGradient>
						</TouchableHighlight>
					</ScrollView>
				</Root>
			</View>
		)
	);
};

export default Profile;