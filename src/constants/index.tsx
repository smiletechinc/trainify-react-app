import {Dimensions, Platform} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;
export const SMALL_DEVICE = SCREEN_WIDTH <= 420 && SCREEN_HEIGHT <= 695;

export const STATUS_BAR_HEIGHT = getStatusBarHeight();
export const COLORS = {
  white: '#ffffff',
  full_black: '#000000',
  dark_black: '#424347',
  medium_dark_blue: '#008EC1',
  dark_grey: '#707070',
  medium_grey: '#ADADAD',
  black_25: '#252525',
  light_blue: '#64C1DC',
};
export const FONT_STYLES = {
  font: Platform.OS === 'ios' ? 'System' : 'Poppins',
  line_height_16: 16,
  line_height_19: 19,
  line_height_20: 20,
  line_height_22: 22,
  line_height_24: 24,
  line_height_26: 26,
  line_height_29: 29,
  line_height_18: 18,
  line_height_17: 17,
  line_height_41: 41,
  line_height_42: 42,
  line_height_46: 46,
  line_height_53: 53,
  line_height_36: 36,
  line_height_14: 14,
  line_height_12: 12,
  font_size_44: 44,
  font_size_10: 10,
  font_size_11: 11,
  font_size_14: 14,
  font_size_16: 16,
  font_size_18: 18,
  font_size_20: 20,
  font_size_22: 22,
  font_size_24: 24,
  font_size_34: 34,
  font_size_35: 35,
  font_size_30: 30,
  font_size_12: 12,
  font_size_13: 13,
  font_weight_400: '400',
  font_weight_500: '500',
  font_weight_700: '700',
};
