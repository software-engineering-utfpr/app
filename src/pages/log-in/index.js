import React, { useState } from 'react';
import { ScrollView, TouchableHighlight, Text, Image } from 'react-native';
import { Icon, Input } from 'react-native-elements';

import { Layout } from '../../components';

import styles from './styles';

const Login = props => {
	const { navigation } = props;

	const [phone, setPhone] = useState('');
	const [password, setPassword] = useState('');
	const [passwordVisibility, setPasswordVisibility] = useState(false);

	const inputHandlerPhone = text => {
		text = text.replace(/\D/g, "").substring(0, 11);
		text = text.replace(/^(\d\d)(\d)/g, "($1) $2");
		text = text.replace(/(\d{4})(\d)/, "$1-$2");
		return text;
	}

	return (
		<Layout>
			<Image style = {{ position: 'absolute', top: 0 }} source = {require('../../images/upwave.png')} />
			<Image style = {{ position: 'absolute', bottom: 0 }} source = {require('../../images/downwave.png')} />
			<TouchableHighlight underlayColor = "#ffffff00" onPress = { () => navigation.goBack() }>
				<Image style = {{ position: 'absolute', top: 17, left: 11 }} source = {require('../../images/fonts/arrow-left-white.png')} />
			</TouchableHighlight>

			<ScrollView style = {{ marginTop: 140, marginBottom: 185 }}>
				<Text style = { styles.title }> Entre no sistema </Text>

				<Input
					inputStyle = { phone.length == 0 ? styles.placeholder : styles.input } inputContainerStyle = {{ borderBottomWidth: 0 }}
					placeholder = "Seu Telefone" keyboardType = "number-pad" textContentType = "telephoneNumber"
					label = { phone.length == 0 ? '' : 'Seu Telefone' } labelStyle = { styles.label }
					value = {phone} onChangeText = { value => setPhone(inputHandlerPhone(value)) }
				/>

				<Input
					inputStyle = { password.length == 0 ? styles.placeholder : styles.input } inputContainerStyle = {{ borderBottomWidth: 0 }} secureTextEntry = {!passwordVisibility} textContentType = "password"
					placeholder = "Sua Senha" autoCompleteType = "password" autoCapitalize = "none"
					value = { password } onChangeText = { value => setPassword(value) }
					label = { password.length == 0 ? '' : 'Sua Senha' } labelStyle = { styles.label }
					rightIconContainerStyle = {{ position: 'absolute', top: 7, right: 15 }}
					rightIcon = {<Icon name = { passwordVisibility ? 'visibility-off' : 'visibility' } onPress = { () => setPasswordVisibility(!passwordVisibility) } color = "#515252" size = {18} />}
				/>
			</ScrollView>
		</Layout>
	);
};

export default Login;
