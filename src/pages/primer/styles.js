import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	header: {
		height: Platform.select({
			ios: 44,
			android: 56
		}),
		paddingTop: 0
	},

  image: {
    width: 38,
    height: 38,
    borderRadius: 150,
		borderWidth: 2,
		padding: 1,
    borderColor: '#2D2E2E'
  },
  
  title: {
    fontFamily: 'Raleway-SemiBold',
    fontSize: 30,
    color: '#2F80ED',
    letterSpacing: 0.05,
    marginTop: 30,
    marginBottom: 10,
    marginLeft: 16,
    marginRight: 16
  },
  
  subtitle: {
    fontFamily: 'Raleway-Regular',
    fontSize: 22,
    color: '#515252',
    marginLeft: 16,
    marginBottom: 0,
    marginRight: 16
  },

  listTitle: {
    fontFamily: 'Raleway-Bold',
    fontSize: 22,
    color: '#2D2E2E',
    marginTop: 30,
    marginBottom: 6,
    marginLeft: 16,
    marginRight: 16
  },
	
	containerItem: {
		display: 'flex',
		flexDirection: 'row',
		marginBottom: 10,
		marginHorizontal: 16,
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
