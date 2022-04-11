import { StyleSheet, Platform } from 'react-native';
import { SCREEN_WIDTH, COLORS, SCREEN_HEIGHT, STATUS_BAR_HEIGHT } from '../../constants';

const styles = StyleSheet.create({
  main_view_container: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    paddingBottom: 70
  },
  landing_image_background: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  // Signin styles.
  login_main_container: {
    flex: 1,
    alignItems: 'flex-start',
    paddingTop: Platform.OS === 'ios' ? STATUS_BAR_HEIGHT + 24 : 24,
    backgroundColor: COLORS.white,
  },
  login_back_icon: {
    width: 32,
    height: 32,
    marginTop: 8
  },
  login_forgot_view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 11,
    paddingRight: 24,
  },
  optional_text: { color: 'red', marginTop: 8, marginLeft: 8 },
  // Reset password styles.
  reset_password_text: {
    color: COLORS.medium_dark_blue,
    marginTop: 16,
  },
  reset_password_details: {
    color: COLORS.medium_grey,
    fontWeight: '600',
    marginTop: 7,
  },
  recordButtonContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 1,
    flexDirection: 'row',
    margin: 0,
  },
  recordIconStyle: {
    width: 60,
    height: 60,
    position: 'absolute',
    bottom: 36,
    zIndex: 1000,
  },
  recordIcon: {
    width: 60,
    height: 60,
    position: 'absolute',
    bottom: 36,
    zIndex: 1000,
  },
  cameraContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    marginTop: 0,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'black',
    borderStyle: 'solid',
    padding: 0,
  },
  lottie: {
    width: 100,
    height: 100,
  },
  textStyle: {
    marginLeft: 8,
    fontSize: 13,
    fontWeight: 'bold',
  },
  boxStyle: {
    flexDirection: 'row',
    width: 120,
    justifyContent: 'space-around',
    borderStyle: 'solid',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 0,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    width: SCREEN_WIDTH * 0.85,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle1: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});
export default styles;
