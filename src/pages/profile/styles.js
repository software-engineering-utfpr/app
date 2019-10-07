import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Raleway-Regular',
    marginLeft: 21,
    fontSize: 30,
    lineHeight: 31,
    color: '#2D2E2E',
    letterSpacing: 0.05,
    marginTop: 70,
    marginBottom: 30
  },

  image: {
    width: 125,
    height: 125,
    borderRadius: 150,
    borderWidth: 3,
    borderColor: '#2D2E2E'
  },

  fontImagePosition: {
    position: 'absolute',
    top: 67
  },

  fontImage: {
    fontFamily: 'Raleway-Regular',
    fontSize: 15,
    letterSpacing: 0.05,
    backgroundColor: '#515252C8',
    color: '#FFFFFF',
    textAlign: 'center',
    paddingTop: 10,
    width: 121,
    height: 55,
    borderBottomLeftRadius: 400,
    borderBottomRightRadius: 400,
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
    borderRadius: 15,
    backgroundColor: '#F3F5F9',
    marginBottom: 20
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

  buttonGradient: {
    height: 50,
    marginLeft: 15,
    marginRight: 15,
    flex: 1,
    borderRadius: 50,
    display: 'flex'
  },

  fontButton: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'Raleway-Regular',
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
