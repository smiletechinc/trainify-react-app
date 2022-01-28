import {StyleSheet, Platform} from 'react-native';
import {SCREEN_WIDTH, STATUS_BAR_HEIGHT} from '../../constants';

const styles = StyleSheet.create({
  home_main_view: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'ios' ? STATUS_BAR_HEIGHT + 15 : 15,
    paddingHorizontal: SCREEN_WIDTH * 0.05,
  },
});
export default styles;
