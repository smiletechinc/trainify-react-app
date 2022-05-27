import {StyleSheet, Platform} from 'react-native';
import {SCREEN_WIDTH, COLORS} from '../../constants';

// Simple Button Stylesheet for flexbox.
const styles = StyleSheet.create({
  button_container: {
    width: SCREEN_WIDTH * 0.9,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    flexDirection: 'row',
  },
});
export default styles;
