import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  title: {
    fontFamily: 'QuestrialRegular',
    marginLeft: 21,
    fontSize: 30,
    lineHeight: 31,
    color: '#2D2E2E',
    letterSpacing: 0.05,
    marginBottom: 30
  },

  placeholder: {
    fontFamily: 'QuestrialRegular',
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
    fontFamily: 'QuestrialRegular',
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

  label: {
    fontFamily: 'QuestrialRegular',
    fontWeight: 'normal',
    position: 'absolute',
    top: 7,
    left: 26,
    zIndex: 100,
    fontSize: 14,
    color: '#515252'
  }
});

export default styles;
