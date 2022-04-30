import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  gridView: {
    marginTop: 10,
    flex: 1,
  },
  itemContainer: {
    borderStyle: 'solid',
    justifyContent: 'flex-end',
    borderRadius: 8,
    marginTop: 10,
    padding: 10,
    height: 200,
    backgroundColor: '#D3D3D3',
    borderWidth: 2,
    borderColor: 'grey',
    marginLeft: 10,
  },
  itemName: {
    fontSize: 16,
    color: '#0096FF',
    fontWeight: '600',
    textAlign: 'center',
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: 'black',
    textAlign: 'center',
  },
});
export default styles;
