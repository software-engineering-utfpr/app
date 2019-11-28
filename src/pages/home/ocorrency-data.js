import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableHighlight, Image, ActivityIndicator, Picker } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import Video from 'react-native-video';
import MediaMeta from 'react-native-media-meta';
import { Root, Popup } from 'popup-ui';
import { Header, Input } from 'react-native-elements';
import { FilePicker } from 'react-native-file-chooser';

import Geocoder from 'react-native-geocoding';

import axios from 'axios';
import moment from 'moment';

import { Layout } from '../../components';

import { query } from '../../database';

import styles from './styles';

const GOOGLE_MAPS_APIKEY = 'AIzaSyBr2j26w3QZ77VoKhmfb4whjAGLlBhJ_0U';

const OcorrencyData = props => {
	const { navigate, state } = props.navigation;
	const { region } = state.params;

	const [loadingPage, setLoadingPage] = useState(false);
	const [user, setUser] = useState({});
	const [location, setLocation] = useState({
		address: '',
		number: '',
		cep: '',
		uf: 'PR',
		city: 'Campo Mourão',
		latitude: region.latitude,
		longitude: region.longitude,
		referencePoint: ''
	});
	
	const [categories, setCategories] = useState([]);

	const [photos, setPhotos] = useState({
		array: [],
		visible: true
	});
	const [video, setVideo] = useState('');

	const [mediaError, setMediaError] = useState('');

	const [description, setDescription] = useState({
		value: '',
		error: ''
	});
	const [referencePointError, setReferencePointError] = useState('');
	const [category, setCategory] = useState({
		value: '',
		error: ''
	});
	const [date, setDate] = useState({
		value: '',
		error: ''
	});
	const [time, setTime] = useState({
		value: '',
		error: ''
	});

	useEffect(() => {
		setLoadingPage(true);

		Geocoder.init(GOOGLE_MAPS_APIKEY);
		Geocoder.from(region.latitude, region.longitude).then(json => {
			const number = json.results[0].address_components.filter(e => e.types.includes('street_number'));
			const address = json.results[0].address_components.filter(e => e.types.includes('route'));
			const cep = json.results[0].address_components.filter(e => e.types.includes('postal_code'));

			setLocation({
				...location,
				address: address.length > 0 ? address[0].long_name : '',
				number: number.length > 0 ? number[0].long_name : '',
				cep: cep.length > 0 ? cep[0].long_name : ''
			});

			setDate({
				...date,
				value: moment().format('DD/MM/YYYY')
			});

			setTime({
				...time,
				value: moment().format('HH:mm')
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
						navigation.goBack();
					}
				});
			});

			axios.get('https://rio-campo-limpo.herokuapp.com/api/categories').then((res) => {
				setCategories(res.data);
				setLoadingPage(false);
			}).catch((err) => {
				setLoadingPage(false);
				Popup.show({
					type: 'Danger',
					title: 'ERRO',
					timing: 0,
					textBody: 'Não foi possível obter as categorias.',
					buttontext: 'Ok',
					callback: () => {
						Popup.hide();
						setLoadingPage(false);
						props.navigation.goBack();
					}
				});
			});
		}).catch(error => {
			setLoadingPage(false);
		});
	}, []);

	const inputHandlerDate = text => {
		text = text.replace(/\D/g, '').substring(0, 8);
		text = text.replace(/^(\d{2})(\d)/g, '$1/$2');
		text = text.replace(/(\d{2})(\d)/, '$1/$2');
		return text;
	}

	const inputHandlerTime = text => {
		text = text.replace(/\D/g, '').substring(0, 4);
		text = text.replace(/^(\d{2})(\d)/g, '$1:$2');
		return text;
	}

	const verifyDate = (date) => {
		if(parseInt(date.substring(0, 2)) > 31)
			return false;

		if(parseInt(date.substring(3, 5)) > 12)
			return false;

		if(date.substring(6) !== moment().format('YYYY'))
			return false;
		
		return true;
	};

	const verifyTime = (time) => {
		if(parseInt(time.substring(0, 2)) > 23)
			return false;

		if(parseInt(time.substring(3, 5)) > 59)
			return false;

		return true;
	};

	const uploadPhoto = (response) => {
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
			response.url = image;

			setPhotos({...photos, array: photos.array.concat([response]) });
			setLoadingPage(false);
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
	};

	const uploadVideo = (response, media) => {
		setLoadingPage(true);
		const formData = new FormData();
		formData.append('api_key', '584136724691346');
		formData.append('timestamp', (Date.now() / 1000));
		formData.append('upload_preset', 'p9jvf6ai');
		formData.append('file', { uri: response.uri, type: response.type || 'video/mp4', name: response.fileName || response.uri });
		
		axios.post('https://api.cloudinary.com/v1_1/dnnkqjrbi/video/upload', formData, {
			headers: { 'X-Requested-With': 'XMLHttpRequest' }
		}).then(res => {
			const video = res.data.secure_url;
			response.url = video;

			setVideo(response);
			setLoadingPage(false);
		}).catch(err => {
			Popup.show({
				type: 'Danger',
				title: 'ERRO',
				timing: 0,
				textBody: 'Não foi possível salvar seu vídeo.',
				buttontext: 'Ok',
				callback: () => {
					Popup.hide();
					setLoadingPage(false);
				}
			});
		});
	};

	const removePhoto = (index) => {
		setPhotos({...photos, visible: false});

		const newArray = photos.array;
		newArray.splice(index, 1);

		setPhotos({ visible: true, array: newArray });
	};

	const registerOccurrence = () => {
		let error = false;
		setDate({ ...date, error: '' });
		setTime({ ...time, error: '' });
		setMediaError('');

		if(date.value.length === 0) {
			error = true;
			setDate({ ...date, error: 'Digite uma data' });
		} else if(date.value.length !== 10 || !verifyDate(date.value)) {
			error = true;
			setDate({ ...date, error: 'Data inválida' });
		}

		if(time.value.length === 0) {
			error = true;
			setTime({ ...time, error: 'Digite um horário' });
		} else if(time.value.length !== 5 || !verifyTime(time.value)) {
			error = true;
			setTime({ ...time, error: 'Horário inválido' });
		}

		if(photos.array.length === 0 && !video) {
			error = true;
			setMediaError('Adicione pelo menos 1 media');
		}

		if(!error) {
			setLoadingPage(true);

			axios.post('https://rio-campo-limpo.herokuapp.com/api/occurrences', {
				category: category.value || categories[0]._id,
				user: user ? user.id : null,
				location,
				date: moment(`${date.value} ${time.value}`, 'DD/MM/YYYY HH:mm'),
				photos: photos.array.map(e => e.url),
				video: video.url,
				description: description.value
			}).then(res => {
				Popup.show({
					type: 'Success',
					title: 'Ocorrência Cadastrada.',
					timing: 0,
					textBody: 'Dados foram atualizados.',
					buttontext: 'Ok',
					callback: () => {
						Popup.hide();
						setLoadingPage(false);
						navigate('Home');
					}
				});
			}).catch(err => {
				Popup.show({
					type: 'Danger',
					title: 'Ocorrência não Cadastrada',
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
	};

	return (
		loadingPage ? (
			<Root>
				<View style = {[styles.vertical, styles.horizontal, { backgroundColor: '#FFFFFF', minHeight: '100%' }]}>
					<ActivityIndicator size = 'large' color = '#00AD45' />
				</View>
			</Root>
		) : (
			<Layout {...props} screen = "home">
				<Header
					containerStyle = {{ backgroundColor: '#FFFFFF', marginTop: -30 }}
					centerComponent = {{ text: 'NOVA OCORRÊNCIA', style: { color: '#2D2E2E', fontFamily: 'Raleway-Regular', fontSize: 20, textAlignVertical: 'center' } }}
					leftComponent = {
						<TouchableHighlight underlayColor = '#FFFFFF00' onPress = { () => props.navigation.goBack() }>
							<Image source = {require('../../images/fonts/arrow-left-black.png')} />
						</TouchableHighlight>
					}
				/>

				<ScrollView>
					<View style = {{ paddingTop: 20, paddingBottom: 10 }}>
						<Text style = {[ styles.title, { marginTop: 0 } ]}>Dados da Ocorrência</Text>
						<Text style = { styles.subtitle }>
							Selecione pelo menos uma evidência do fato denunciado.
						</Text>
						
						<Text style = {[ styles.subtitle, { fontFamily: 'Raleway-SemiBold', marginTop: 0, marginBottom: 20 }]}>
							Você pode adicionar:
							{"\n"}- 3 imagens;
							{"\n"}- 1 vídeo de até 30 segundos.
						</Text>

						<Text style = {{ fontFamily: 'Raleway-Regular', fontSize: 14, color: '#FF5154', textAlign: 'center', marginBottom: 8 }}> {mediaError} </Text>
						<View style = {{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15, marginHorizontal: 13 }}>
							<TouchableHighlight
								underlayColor = '#FFFFFF00'
								onPress = { () => {
									if(photos.array.length < 3) {
										ImagePicker.launchImageLibrary({}, response => {
											if(response.uri) {
												uploadPhoto(response);
											}
										});
									} else {
										Popup.show({
											type: 'Danger',
											title: 'Já exitem 3 imagens.',
											timing: 0,
											textBody: 'Apague uma para poder adicionar mais.',
											buttontext: 'Ok',
											callback: () => {
												Popup.hide();
												setLoadingPage(false);
											}
										});
									}
								}}
								style = {{ width: 60, height: 60 }}
							>
								<LinearGradient start = {{ x: 0, y: 0 }} end = {{ x: 1, y: 0 }} colors = {['#00AD45', '#5ECC62']} style = {{ borderRadius: 50, padding: 10 }}>
									<Image source = {require('../../images/fonts/instagram.png')} style = {{ width: 40, height: 40 }} />
								</LinearGradient>
							</TouchableHighlight>

							<TouchableHighlight
								underlayColor = '#FFFFFF00'
								onPress = { () => {
									if(!video) {
										ImagePicker.launchImageLibrary({ mediaType: 'video' }, response => {
											if(response.uri) {
												MediaMeta.get(response.path).then((metadata) => {
													if(metadata.duration <= 30000) {
														uploadVideo(response);
													} else {
														Popup.show({
															type: 'Danger',
															title: 'Vídeo inválido.',
															timing: 0,
															textBody: 'Este vídeo possui mais de 30 segundos.',
															buttontext: 'Ok',
															callback: () => {
																Popup.hide();
																setLoadingPage(false);
															}
														});
													}
												}).catch(err => console.error(err));
											}
										});
									} else {
										Popup.show({
											type: 'Danger',
											title: 'Já exite 1 vídeo.',
											timing: 0,
											textBody: 'Apague o vídeo para poder adicionar outro.',
											buttontext: 'Ok',
											callback: () => {
												Popup.hide();
												setLoadingPage(false);
											}
										});
									}
								}}
								style = {{ width: 60, height: 60 }}
							>
								<LinearGradient start = {{ x: 0, y: 0 }} end = {{ x: 1, y: 0 }} colors = {['#00AD45', '#5ECC62']} style = {{ borderRadius: 50, padding: 10 }}>
									<Image source = {require('../../images/fonts/video.png')} style = {{ width: 40, height: 40 }} />
								</LinearGradient>
							</TouchableHighlight>
						</View>

						<View style = {{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: 13 }}>
							{ photos.visible && photos.array.map((item, index) => (
								<View key = {item.uri} style = {{ width: 80, height: 80, marginHorizontal: 10, marginVertical: 15 }}>
									<Image source = {{ uri: item.uri }} style = {{ width: 80, height: 80, borderRadius: 4 }} />

									<TouchableHighlight onPress = { () => removePhoto(index) } underlayColor = '#FFFFFF00' style = {{ width: 30, height: 30, borderRadius: 50, backgroundColor: '#DDD', position: 'absolute', top: -15, right: -15 }}>
										<Text style = {{ textAlignVertical: 'center', textAlign: 'center', color: '#FFF', height: 30 }}>X</Text>
									</TouchableHighlight>
								</View>
							)) }

							{ video ? (
								<View key = {video.uri} style = {{ width: 80, height: 80, marginHorizontal: 10, marginVertical: 15 }}>
									<Video source = {{ uri: video.uri }} style = {{ width: 80, height: 80, borderRadius: 4 }} />

									<TouchableHighlight onPress = { () => setVideo('') } underlayColor = '#FFFFFF00' style = {{ width: 30, height: 30, borderRadius: 50, backgroundColor: '#DDD', position: 'absolute', top: -15, right: -15 }}>
										<Text style = {{ textAlignVertical: 'center', textAlign: 'center', color: '#FFF', height: 30 }}>X</Text>
									</TouchableHighlight>
								</View>
							) : null }
						</View>

						<View style = {{ flex: 1, flexDirection: 'row', marginBottom: 5, justifyContent: 'space-between', marginRight: 20, marginTop: 10 }}>
							<View style = {{ width: 200 }}>
								<Input
									inputStyle = {[{ margin: 0 }, date.value.length == 0 ? styles.placeholder : styles.input ]} inputContainerStyle = {{ borderBottomWidth: 0, margin: 0, width: 200 }}
									placeholder = 'Data' keyboardType = 'number-pad'
									label = { date.value.length == 0 ? '' : 'Data*' } labelStyle = { styles.label }
									value = {date.value} onChangeText = { value => setDate({ ...date, value: inputHandlerDate(value), error: '' }) }
									errorMessage = {date.error} errorStyle = {[ { left: 15 }, styles.fontError ]}
								/>
							</View>

							<View style = {{ width: 160, marginLeft: -30 }}>
								<Input
									inputStyle = {[{ margin: 0 }, time.value.length == 0 ? styles.placeholder : styles.input ]} inputContainerStyle = {{ borderBottomWidth: 0, margin: 0, width: 160 }}
									placeholder = 'Horário' keyboardType = 'number-pad'
									label = { time.value.length == 0 ? '' : 'Horário*' } labelStyle = { styles.label }
									value = {time.value} onChangeText = { value => setTime({ ...time, value: inputHandlerTime(value), error: '' }) }
									errorMessage = {time.error} errorStyle = {[ { left: 15 }, styles.fontError ]}
								/>
							</View>
						</View>

						<View style = {{ borderRadius: 15, overflow: 'hidden', marginHorizontal: 10, marginBottom: 10 }}>
							<Picker
								selectedValue = { category.value }
								style = {styles.input}
								onValueChange = { (itemValue, itemIndex) => setCategory({ ...category, value: itemValue }) }
							>
								{ categories && categories.map(item => (
									<Picker.Item key = { item._id } value = { item._id } label = { item.title } /> 
								))}
							</Picker>
						</View>
						
						<Input
							inputStyle = { description.value.length == 0 ? styles.placeholder : styles.input } inputContainerStyle = {{ borderBottomWidth: 0, marginBottom: 5 }}
							placeholder = 'Descrição do fato' label = { description.value.length == 0 ? '' : 'Descrição do fato' } labelStyle = { styles.label }
							value = {description.value} onChangeText = { value => setDescription({ ...description, value, error: '' }) }
							errorMessage = {description.error} errorStyle = { styles.fontError }
						/>

						<Input
							inputStyle = { location.referencePoint.length == 0 ? styles.placeholder : styles.input } inputContainerStyle = {{ borderBottomWidth: 0, marginBottom: 5 }}
							placeholder = 'Ponto de referência' label = { location.referencePoint.length == 0 ? '' : 'Ponto de referência' } labelStyle = { styles.label }
							value = {location.referencePoint} onChangeText = { value => { setLocation({ ...location, referencePoint: value }); setReferencePointError(''); } }
							errorMessage = {referencePointError} errorStyle = { styles.fontError }
						/>
					
						<Text style = {[ styles.subtitle, { marginTop: 0, fontSize: 14 }]}>
							Insira informações como ponto de referência, nome da empresa, área do dano, entre outros...
						</Text>

						<TouchableHighlight underlayColor = '#FFFFFF00' onPress = { registerOccurrence } style = {{ marginTop: 20, marginHorizontal: 13 }}>
							<LinearGradient start = {{ x: 0, y: 0 }} end = {{ x: 1, y: 0 }} colors = {['#00AD45', '#5ECC62']} style = { styles.buttonGradientAbsolute }>
								<Text style = { styles.fontButtonGradient }> Registrar Ocorrência </Text>
							</LinearGradient>
						</TouchableHighlight>
					</View>
				</ScrollView>
			</Layout>
		)
	);
};

export default OcorrencyData;