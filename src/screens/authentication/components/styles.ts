import {StyleSheet, Platform} from 'react-native';
import {SCREEN_WIDTH, COLORS, SCREEN_HEIGHT, STATUS_BAR_HEIGHT} from '../../../constants';

const styles = StyleSheet.create({
  // Subscription Item Styles
  subscription_item_main: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    height: 46,
    width: SCREEN_WIDTH * 0.9,
    borderRadius: 25,
    marginTop: 13,
    paddingLeft: 21,
    paddingRight: 22,
  },
  price_selected: {
    color: COLORS.white,
    fontWeight: '600',
  },
  price_unselected: {
    color: COLORS.full_black,
    fontWeight: '600',
  },
  // App User Item Styles.
  app_user_item_main: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.dark_grey,
    height: 46,
    width: SCREEN_WIDTH * 0.9,
    borderRadius: 25,
    marginTop: 13,
    paddingLeft: 21,
    paddingRight: 14,
  },
  left_text: {
    color: COLORS.full_black,
    fontWeight: '600',
  },
  right_check_box: {
    width: 24,
    height: 24,
    borderRadius: 24 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: isSelected ? COLORS.medium_dark_blue : 'transparent',
  },
  // Playing styles.
  playing_style_main: {
    marginTop: 20,
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
