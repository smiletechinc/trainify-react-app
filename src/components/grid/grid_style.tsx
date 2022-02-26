import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  gridView: {
    marginTop: 10,
    flex: 1,
  },  
  itemContainer: {
  borderStyle: "solid",
  justifyContent: 'flex-end',
  borderRadius: 8,
  marginLeft: 32,
  marginTop: 8,
  padding: 10,
  height: 300,
  width: 210
  },
  itemName: {
    width:80,
  fontSize: 16,
  color: '#0096FF',
  fontWeight: '600',
  },
  itemCode: {
    width:80,
    fontWeight: '600',
    fontSize: 12,
    color: 'black',
    textAlign:"right"
  }
});
export default styles  ;