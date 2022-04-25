import {StyleSheet, Platform} from 'react-native';
import {
  COLORS,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  STATUS_BAR_HEIGHT,
} from '../../constants';

const styles = StyleSheet.create({
  home_main_view: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'ios' ? 10 : 10,
    paddingHorizontal: SCREEN_WIDTH * 0.05,
  },
  navigationBar: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'ios' ? 10 : 10,
    minHeight: SCREEN_HEIGHT - 764,
    paddingHorizontal: SCREEN_WIDTH * 0.03,
  },
  practice_text: {
    position: 'absolute',
    top: 80,
    right: 10,
    lineHeight: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    width: SCREEN_WIDTH * 0.6,
    textAlign: 'center',
    fontSize: 14,
  },
  // Service Practice styles.
  main_view: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'ios' ? 15 : 15,
    paddingHorizontal: SCREEN_WIDTH * 0.03,
  },
  record_and_upload_text: {
    position: 'absolute',
    bottom: 20,
    right: 8,
    lineHeight: 27,
    fontWeight: 'bold',
    color: COLORS.white,
    width: SCREEN_WIDTH * 0.6,
    textAlign: 'center',
    fontSize: 16,
  },
  video_duration_text: {
    marginTop: 5 + STATUS_BAR_HEIGHT,
    textAlign: 'center',
    color: COLORS.white,
    fontSize: 20,
  },

  // Upload Service styles
  upload_icon_view: {
    width: 144,
    height: 144,
    borderRadius: 144 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.dark_grey,
  },
  upload_icon: {
    width: 50,
    height: 50,
  },
  upload_serve_scroll_view: {
    paddingBottom: 20,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default styles;
