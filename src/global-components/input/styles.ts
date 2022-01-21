import {Platform, StyleSheet} from 'react-native';
import {SCREEN_WIDTH, COLORS} from '../../constants';

const styles = StyleSheet.create({
  input_parent_container: {
    width: SCREEN_WIDTH * 0.9,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: COLORS.black_25,
    height: 46,
    paddingLeft: 21,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input_container: {
    color: COLORS.dark_black,
  },
});
export default styles;
