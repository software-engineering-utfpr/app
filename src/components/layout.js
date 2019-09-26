import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';

const styles = StyleSheet.create({
	containerFull: {
		minHeight: '100%',
		backgroundColor: '#FFFFFF'
	}
});

const Layout = props => {
	return (
    <SafeAreaView>
      <View style = { styles.containerFull }>
        { props.children }
      </View>
    </SafeAreaView>
	);
};

export default Layout;