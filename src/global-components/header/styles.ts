import {StyleSheet} from 'react-native';
import { COLORS } from '../../constants';

const styles = StyleSheet.create({
  header_main_view: {
    justifyContent: 'center',
    backgroundColor: 'white',
    alignItems: 'flex-end',
  },
  header_profile_icon: {
    width: 29,
    height: 29,
    marginLeft: 5
  },

  // Header with text styles.
  header_with_text_main_view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  text: {
    fontWeight: '600',
    fontSize: 15,
    color: COLORS.dark_black,
    textAlign: 'center',
  },
});
export default styles;