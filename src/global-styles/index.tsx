import {StyleSheet, Platform} from 'react-native';
import {COLORS, FONT_STYLES, SCREEN_WIDTH} from '../constants';

const styles = StyleSheet.create({
  title: {
    fontSize: FONT_STYLES.font_size_35,
    lineHeight: FONT_STYLES.line_height_42,
    fontWeight: 'normal',
    fontFamily: FONT_STYLES.font,
    color: COLORS.white,
  },
  h1: {
    fontSize: FONT_STYLES.font_size_20,
    lineHeight: FONT_STYLES.line_height_24,
    fontWeight: 'normal',
    fontFamily: FONT_STYLES.font,
    color: COLORS.white,
  },
  regular: {
    fontSize: FONT_STYLES.font_size_18,
    lineHeight: FONT_STYLES.line_height_22,
    fontWeight: 'normal',
    fontFamily: FONT_STYLES.font,
    color: COLORS.white,
  },
});
export default styles;
