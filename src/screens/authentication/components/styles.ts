import {StyleSheet, Platform} from 'react-native';
import {SCREEN_WIDTH, COLORS, SCREEN_HEIGHT, STATUS_BAR_HEIGHT} from '../../../constants';

const styles = StyleSheet.create({
  // Playing styles.
  playing_style_main: {
    marginTop: 16,
    width: SCREEN_WIDTH * 0.9,
  },
  playing_style_horizontal_view: {
    flexDirection: 'row',
    marginTop: 10,
    width: SCREEN_WIDTH * 0.9,
    height: 46,
    borderRadius: 30,
    backgroundColor: COLORS.dark_black,
  },
  left_handed: {
    height: 46,
    width: ((SCREEN_WIDTH * 0.9) / 2) - 4,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  right_handed: {
    height: 46,
    width: ((SCREEN_WIDTH * 0.9) / 2) - 4,
    marginLeft: 8,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  your_styles_text: {
    color: COLORS.full_black,
    fontSize: 16,
    lineHeight: 25,
    fontWeight: '600',
  }
});
export default styles;
