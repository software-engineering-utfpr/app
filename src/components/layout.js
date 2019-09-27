import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Root } from 'popup-ui';

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
				<Root>
					{ props.children }
				</Root>
      </View>
    </SafeAreaView>
	);
};

export default Layout;