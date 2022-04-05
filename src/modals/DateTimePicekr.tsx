import React, {FunctionComponent, useEffect, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View,
  Image,
  Platform,
  Alert,
  Button,
  Modal,
  Pressable,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from './styles';

type Props = {
  visible: boolean;
  setBirthday: any;
  close: any;
};
const DatePickerModal: FunctionComponent<Props> = props => {
  const {visible, setBirthday, close} = props;
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  var monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  var dayOfWeekNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  function formatDate(date, patternStr) {
    if (!patternStr) {
      patternStr = 'M/d/yyyy';
    }
    var day = date.getDate(),
      month = date.getMonth(),
      year = date.getFullYear(),
      hour = date.getHours(),
      minute = date.getMinutes(),
      second = date.getSeconds(),
      miliseconds = date.getMilliseconds(),
      h = hour % 12,
      hh = twoDigitPad(h),
      HH = twoDigitPad(hour),
      mm = twoDigitPad(minute),
      ss = twoDigitPad(second),
      aaa = hour < 12 ? 'AM' : 'PM',
      EEEE = dayOfWeekNames[date.getDay()],
      EEE = EEEE.substr(0, 3),
      dd = twoDigitPad(day),
      M = month + 1,
      MM = twoDigitPad(M),
      MMMM = monthNames[month],
      MMM = MMMM.substr(0, 3),
      yyyy = year + '',
      yy = yyyy.substr(2, 2);
    // checks to see if month name will be used
    patternStr = patternStr
      .replace('hh', hh)
      .replace('h', h)
      .replace('HH', HH)
      .replace('H', hour)
      .replace('mm', mm)
      .replace('m', minute)
      .replace('ss', ss)
      .replace('s', second)
      .replace('S', miliseconds)
      .replace('dd', dd)
      .replace('d', day)

      .replace('EEEE', EEEE)
      .replace('EEE', EEE)
      .replace('yyyy', yyyy)
      .replace('yy', yy)
      .replace('aaa', aaa);
    if (patternStr.indexOf('MMM') > -1) {
      patternStr = patternStr.replace('MMMM', MMMM).replace('MMM', MMM);
    } else {
      patternStr = patternStr.replace('MM', MM).replace('M', M);
    }
    return patternStr;
  }
  function twoDigitPad(num) {
    return num < 10 ? '0' + num : num;
  }
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
    setBirthday(formatDate(currentDate, 'dd/MM/yyyy'));
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        close();
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Select Date of Birth</Text>
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            is24Hour={true}
            style={{
              width: '100%',
              height: 200,
            }}
            display="spinner"
            onChange={onChange}
          />
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => close()}>
            <Text style={styles.textStyle1}>Select</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default DatePickerModal;
