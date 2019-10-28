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
    fontSize: 18,
    color: '#515252',
    marginTop: 20,
    marginLeft: 16,
    marginBottom: 0,
    marginRight: 16
  },

  plusButtonContainer: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    height: 50,
    width: 50,
    borderRadius: 100
  },

  plusButton: {
    borderRadius: 100
  },

  fontButton: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'Raleway-SemiBold',
    fontSize: 35,
    lineHeight: 50
  },

  buttonGradientAbsolute: {
    height: 50,
    flex: 1,
    borderRadius: 15,
    display: 'flex'
  },

  fontButtonGradient: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'Raleway-SemiBold',
    fontSize: 18,
    lineHeight: 50
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
