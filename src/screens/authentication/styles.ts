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
  paddingTop: Platform.OS === 'ios' ?STATUS_BAR_HEIGHT + 24 : 24,
 },
 login_back_icon: {
  width: 18,
  height: 18,
  borderRadius: 18 / 2,
  borderWidth: 1,
  borderColor: COLORS.medium_dark_blue,
}
});
export default styles;
