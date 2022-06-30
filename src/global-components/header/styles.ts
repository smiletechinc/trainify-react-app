import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants';

const styles = StyleSheet.create({
  header_main_view: {
    justifyContent: 'center',
    backgroundColor: 'white',
    alignItems: 'flex-end',
  },
  header_profile_icon: {
    width: 29,
    height: 29,
    marginLeft: 5,
  },

  header_profile_logout_icon: {
    width: 24,
    height: 24,
    // marginLeft: 5,
    resizeMode: 'contain',
  },

  // Header with text styles.
  header_with_text_main_view: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  text: {
    fontWeight: '600',
    fontSize: 15,
    color: COLORS.dark_black,
    textAlign: 'center',
  },
});
export default styles;
