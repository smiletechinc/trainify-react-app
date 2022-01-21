import {StyleSheet, Platform} from 'react-native';
import {COLORS, FONT_STYLES, SCREEN_WIDTH} from '../constants';

const styles = StyleSheet.create({
  title: {
    fontSize: FONT_STYLES.font_size_30,
    lineHeight: FONT_STYLES.line_height_46,
    fontWeight: 'normal',
    fontFamily: FONT_STYLES.font,
    color: COLORS.white,
  },
  medium: {
    fontSize: FONT_STYLES.font_size_13,
    lineHeight: FONT_STYLES.line_height_20,
    fontWeight: 'normal',
    fontFamily: FONT_STYLES.font,
    color: COLORS.dark_black,
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
    color: COLORS.dark_black,
  },
  small: {
    fontSize: FONT_STYLES.font_size_11,
    lineHeight: FONT_STYLES.line_height_17,
    fontWeight: 'normal',
    fontFamily: FONT_STYLES.font,
    color: COLORS.dark_black,
  },
  bold: {
    fontWeight: 'bold',
  }
});
export default styles;
