import {StyleSheet, Platform} from 'react-native';
import {SCREEN_WIDTH, COLORS} from '../../constants';

const styles = StyleSheet.create({
  button_container: {
    width: SCREEN_WIDTH * 0.9,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    flexDirection: 'row',
  },
  // button_shadow: {
  //   shadowColor: COLORS.light_purple,
  //   shadowOpacity: 0.22,
  //   shadowRadius: 10,
  //   shadowOffset: {
  //     height: 5,
  //     width: 0,
  //   },
  //   elevation: Platform.OS === 'android' ? 5 : 0,
  // },
});
export default styles;
