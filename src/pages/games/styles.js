import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	header: {
		height: Platform.select({
			ios: 44,
			android: 56,
		}),
		paddingTop: 0,
	},

  image: {
    width: 38,
    height: 38,
    borderRadius: 150,
		borderWidth: 2,
		padding: 1,
    borderColor: '#2D2E2E'
	},
	
	containerItem: {
		display: 'flex',
		flexDirection: 'row',
		marginBottom: 10,
		marginHorizontal: 20,
		padding: 15,
		borderRadius: 15,
		backgroundColor: '#FAFCFE'
	},
  
  vertical: {
    flex: 1,
    justifyContent: 'center'
  },

  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  }
});

export default styles;
