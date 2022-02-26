import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({ 
  itemContainer: {
  justifyContent: 'center',
  alignItems: "center",     
  marginLeft: 32,
  marginRight: 32,
  display: "flex",  
  flex: 1,
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