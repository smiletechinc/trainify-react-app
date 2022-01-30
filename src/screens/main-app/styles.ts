import {StyleSheet, Platform} from 'react-native';
import {COLORS, SCREEN_WIDTH, STATUS_BAR_HEIGHT} from '../../constants';

const styles = StyleSheet.create({
  home_main_view: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'ios' ? STATUS_BAR_HEIGHT + 15 : 15,
    paddingHorizontal: SCREEN_WIDTH * 0.05,
  },
  practice_text: {
    position: 'absolute',
    top: 50,
    right: 43,
    lineHeight: 27,
    fontWeight: 'bold',
    color: COLORS.white,
    width: SCREEN_WIDTH * 0.5,
    textAlign: 'right',
  },
  // Service Practice styles.
  main_view: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'ios' ? 15 : 15,
    paddingHorizontal: SCREEN_WIDTH * 0.05,
  },
  record_and_upload_text: {
    position: 'absolute',
    bottom: 7,
    left: 6,
    lineHeight: 27,
    fontWeight: '600',
    color: COLORS.white,
    width: (SCREEN_WIDTH * 0.9 / 2) - 43,
    textAlign: 'center',
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
  upload_serve_scroll_view : {
    paddingBottom: 20,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default styles;
