/**
 * A country picker modal.
 */

import React, {FunctionComponent, useEffect, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View,
  Image,
  PixelRatio,
  Platform,
  Alert,
  Button,
  Modal,
  Pressable,
} from 'react-native';
// import CountryPicker from 'rn-country-dropdown-picker';
import CountryPicker from 'react-native-country-picker-modal';
import ModalWrapper from '../components/wrappers/ModalWrapper';
import {CountryCode, Country} from './country';
import styles from './styles';

type Props = {
  visible: boolean;
  setNation: any;
  close: any;
};
const CountryPickerModal: FunctionComponent<Props> = props => {
  const {visible, setNation, close} = props;

  const [countryCode, setCountryCode] = useState<CountryCode>('FR');
  const [country, setCountry] = useState<Country>(null);
  const [withCountryNameButton, setWithCountryNameButton] =
    useState<boolean>(false);
  const [withFlag, setWithFlag] = useState<boolean>(true);
  const [withEmoji, setWithEmoji] = useState<boolean>(true);
  const [withFilter, setWithFilter] = useState<boolean>(true);
  const [withAlphaFilter, setWithAlphaFilter] = useState<boolean>(false);
  const [withCallingCode, setWithCallingCode] = useState<boolean>(false);
  const [visibleModal, setVisible] = useState<boolean>(false);
  const onSelect = (country: Country) => {
    setCountryCode(country.cca2);
    setNation(country.name);
    setCountry(country);
  };
  const switchVisible = () => setVisible(!visible);
  return (
    <View
      style={{
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <CountryPicker
        {...{
          countryCode,
          withFilter,
          withFlag,
          withCountryNameButton,
          withAlphaFilter,
          withCallingCode,
          withEmoji,
          onSelect,
        }}
      />
    </View>
  );
};

export default CountryPickerModal;
