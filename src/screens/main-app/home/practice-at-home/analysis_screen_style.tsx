import { Platform, StyleSheet } from 'react-native';
import { SCREEN_WIDTH } from '../../../../constants';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        paddingTop: Platform.OS === 'ios' ? 15 : 15,
        paddingHorizontal: SCREEN_WIDTH * 0.05,
    },
    main_view: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: 'white',
        paddingTop: Platform.OS === 'ios' ? 15 : 15,
        paddingHorizontal: SCREEN_WIDTH * 0.05,
      },
    flatcontainer: {
        paddingTop: 50,
        backgroundColor: '#ffff',
        flex: 2,
    },
    activityIndicator: {
        alignItems: 'center',
        height: 80,
    },
    splashText: {
        color:'#000000', marginTop:8, marginLeft:8, fontSize:16
    },
    loginContainer: {
        flex: 1, backgroundColor: "#31A8A8", 
    },
    loginText: {
        fontSize: 16, marginTop:4, paddingBottom: 0, marginLeft: 12
    },
    addColorcontainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#31A8A8',
    },
    slidertext: {
        marginTop: 10,
        fontSize: 20,
    },
    sliderview: {
        alignItems: 'center', justifyContent: 'center',
    },
    listContainer: {
        width: '100%',
        // paddingleft: 64,
      }
});

export default styles;