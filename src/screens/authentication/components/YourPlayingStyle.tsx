import React, {FunctionComponent} from 'react';
import {Text, TouchableOpacity, View, Image} from 'react-native';
// Constants.
import {COLORS, SCREEN_WIDTH} from '../../../constants';
import {SimpleButton} from '../../../global-components/button';
// Custom Styles
import globalStyles from '../../../global-styles';
import styles from './styles';

type Props = {
  handStyle: any;
  setHandStyle: any;
};
const PlayingStyle: FunctionComponent<Props> = props => {
  const {handStyle, setHandStyle} = props;
  return (
    <View style={styles}>
      <Text style={[globalStyles.regular, styles.your_styles_text]}>
        Your Style
      </Text>
      <View style={styles.playing_style_horizontal_view}>
        <TouchableOpacity
          style={[
            styles.left_handed,
            {
              backgroundColor:
                handStyle === 0 ? COLORS.medium_dark_blue : COLORS.dark_black,
            },
          ]}
          onPress={() => {
            setHandStyle(0);
          }}>
          <Text
            style={[
              globalStyles.medium,
              {color: COLORS.white, fontWeight: '600'},
            ]}>
            Left Handed
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.right_handed,
            {
              backgroundColor:
                handStyle === 1 ? COLORS.medium_dark_blue : COLORS.dark_black,
            },
          ]}
          onPress={() => {
            setHandStyle(1);
          }}>
          <Text
            style={[
              globalStyles.medium,
              {color: COLORS.white, fontWeight: '600'},
            ]}>
            Right Handed
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PlayingStyle;
