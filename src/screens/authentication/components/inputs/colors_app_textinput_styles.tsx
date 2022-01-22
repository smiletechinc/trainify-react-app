import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start', justifyContent: 'center',
        marginHorizontal: 48,
      },
      inputView: {
        backgroundColor: "#98d3d3",
        borderRadius: 32,
        borderWidth: 1,
        //borderColor: 'grey',
        width: "100%",
        height: 45,
        marginBottom: 20,
        justifyContent:'center',

      },
      errorText: {
        marginLeft:16, marginTop:-16, color:'red', marginBottom:16,
      },
    
      TextInput: {
        height: 50,
        flex: 1,
        padding: 10,
        marginLeft: 20,
      },
});
export default styles  ;