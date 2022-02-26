import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  gridView: {
    marginTop: 10,
    flex: 1,
  },  
  itemContainer: {
  borderStyle: "solid",
  justifyContent: 'flex-end',
  borderRadius: 5,
  marginLeft: 32,
  marginTop: 8,
  padding: 10,
  height: 150,
  width: 150
  },
  itemName: {
  fontSize: 16,
  color: '#fff',
  fontWeight: '600',
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: '#fff',
  }
});
export default styles  ;