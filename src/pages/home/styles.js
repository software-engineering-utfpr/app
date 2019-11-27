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

  placeholder: {
    fontFamily: 'Raleway-Regular',
    height: 57,
    borderBottomWidth: 0,
    fontSize: 16,
    lineHeight: 19,
    color: '#515252',
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 15,
    backgroundColor: '#F3F5F9',
    marginBottom: 20
  },

  input: {
    borderRadius: 15,
    fontFamily: 'Raleway-Regular',
    height: 57,
    borderBottomWidth: 0,
    fontSize: 19,
    lineHeight: 22,
    position: 'relative',
    paddingTop: 24,
    color: '#2D2E2E',
    paddingLeft: 16,
    paddingRight: 40,
    backgroundColor: '#F3F5F9',
    marginBottom: 10
  },

  error: {
    backgroundColor: '#FF8A8C'
  },

  label: {
    fontFamily: 'Raleway-Regular',
    fontWeight: 'normal',
    position: 'absolute',
    top: 7,
    left: 26,
    zIndex: 100,
    fontSize: 14,
    color: '#515252'
  },

  fontError: {
    fontFamily: 'Raleway-Regular',
    fontWeight: 'normal',
    position: 'absolute',
    top: -20,
    right: 15,
    zIndex: 100,
    fontSize: 14,
    color: '#FF5154'
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
