import {StyleSheet, Platform} from 'react-native';
import {SCREEN_WIDTH, COLORS, SCREEN_HEIGHT, STATUS_BAR_HEIGHT} from '../../constants';

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
  },
  login_forgot_view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 11,
    paddingRight: 24,
  },
  // Reset password styles.
  reset_password_text: {
    color: COLORS.medium_dark_blue,
    marginTop: 16,
  },
  reset_password_details: {
    color: COLORS.medium_grey,
    fontWeight: '600',
    marginTop: 7,
  }

});
export default styles;
