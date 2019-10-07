import React, { useEffect, useState } from 'react';
import { View, ScrollView, Image, Text, TouchableHighlight, ActivityIndicator } from 'react-native';
import { Header, ButtonGroup } from 'react-native-elements';
import { Popup, Root } from 'popup-ui';

import { Layout } from '../../components';
import { query } from '../../database';

import axios from 'axios';
import moment from 'moment';

import styles from './styles';

const Calendar = props => {
	const { navigate } = props.navigation;

	const [user, setUser] = useState({});
	const [events, setEvents] = useState([]);
	const [eventsFiltered, setEventsFiltered] = useState([]);
	const [tab, setTab] = useState(0);
	const [loadingScreen, setLoadingScreen] = useState(false);

	useEffect(() => {
		setLoadingScreen(true);

    axios.get('https://rio-campo-limpo.herokuapp.com/api/events').then((res) => {
      setLoadingScreen(false);
			setEvents(res.data);
			setEventsFiltered(res.data.filter(e => moment(e.initialDate).isSameOrBefore(moment(), 'month') && moment(e.finalDate).isSameOrAfter(moment(), 'month')));
    }).catch((err) => {
      setLoadingScreen(false);
			Popup.show({
				type: 'Danger',
				title: 'ERRO',
				timing: 0,
				textBody: 'Não foi possível obter os jogos.',
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

	useEffect(() => {
		if(tab == 0) setEventsFiltered(events.filter(e => moment(e.initialDate).isSameOrBefore(moment(), 'month') && moment(e.finalDate).isSameOrAfter(moment(), 'month')));
		if(tab == 1) setEventsFiltered(events.filter(e => moment(e.initialDate).isSameOrBefore(moment(), 'week') && moment(e.finalDate).isSameOrAfter(moment(), 'week')));
		if(tab == 2) setEventsFiltered(events.filter(e => moment(e.initialDate).isSameOrBefore(moment(), 'day') && moment(e.finalDate).isSameOrAfter(moment(), 'day')));
	}, [tab]);

	return (
		loadingScreen ? (
			<Root>
				<View style = {[styles.vertical, styles.horizontal, { backgroundColor: '#FFFFFF', minHeight: '100%' }]}>
					<ActivityIndicator size = 'large' color = '#00AD45' />
				</View>
			</Root>
		) : (
			<Layout {...props} screen = "calendar">
				<Header
					containerStyle = {{ backgroundColor: '#FFFFFF', marginTop: -30 }}
					centerComponent = {{ text: 'EVENTOS', style: { color: '#2D2E2E', fontFamily: 'Raleway-Regular', fontSize: 20, textAlignVertical: 'center' } }}
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

				<ButtonGroup
					onPress = { (tab) => setTab(tab) }
					selectedIndex = {tab}
					containerStyle = {{ borderWidth: 0, height: 70 }} innerBorderStyle = {{ width: 0 }} buttonStyle = {{ borderBottomColor: '#6C7B8A14', borderBottomWidth: 1 }}
					selectedButtonStyle = {{ backgroundColor: 'transparent', borderBottomColor: '#00AD45', borderBottomWidth: 1 }}
					buttons = {[{ element: () => <Text style = { styles.fontTabBar }> ESTE MÊS </Text> }, { element: () => <Text style = { styles.fontTabBar }> ESTA SEMANA </Text> }, { element: () => <Text style = { styles.fontTabBar }> HOJE </Text> }]}
				/>

				{ eventsFiltered.length === 0 ? (
					<Text style = {{ fontFamily: 'Raleway-Regular', fontSize: 18, color: '#515252', textAlign: 'center', textAlignVertical: 'center', height: '90%' }}> Não há Eventos </Text>
				) : (
					<ScrollView>
						<View style = {{ paddingTop: 20, paddingBottom: 10 }}>
							{ eventsFiltered.map((item) => (
								<View key = { item._id } style = { styles.containerItem }>
									<View style = {{ width: 20, height: 20, borderRadius: 50, marginRight: 10, backgroundColor: item.color }} />
									<View style = {{ paddingRight: 30, paddingBottom: 50, width: '100%' }}>
										<Text style = {{ fontFamily: 'Raleway-Regular', fontSize: 18, color: '#2D2E2E' }}> { item.name } </Text>
										<Text style = {{ fontFamily: 'Raleway-Regular', fontSize: 14 }}> { (moment(item.finalDate).diff(moment(item.initialDate), 'days')) === 0 ? item.allDay ? moment(item.initialDate).format('dddd, D MMMM') : `${moment(item.initialDate).format('dddd, D MMMM')} ⠂${moment(item.initialDate).format('HH:mm')} - ${moment(item.finalDate).format('HH:mm')}` : item.allDay ? `${moment(item.initialDate).format('D')} - ${moment(item.finalDate).format('D')} de ${moment(item.finalDate).format('MMMM')} de ${moment(item.finalDate).format('YYYY')}` : `${moment(item.initialDate).format('D MMMM YYYY, HH:mm')} - ${moment(item.finalDate).format('D MMMM YYYY, HH:mm')}` } </Text>
									</View>
								</View>
							)) }
						</View>
					</ScrollView>
				) }
			</Layout>
		)
	);
};

export default Calendar;