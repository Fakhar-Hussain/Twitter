import React, {useState, useEffect} from 'react'

import {
  StatusBar, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  Image, 
  TextInput,
  KeyboardAvoidingView, 
  Button,
  ActivityIndicator,
  Alert
} from 'react-native'


import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';



export default function Login({navigation}) {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [Images , setImages] = useState("https://logolook.net/wp-content/uploads/2021/06/Symbol-Twitter.png")

  


  
  
  const SubmitLogin = async () => {
    setLoading(true)
    if (email == '' || password == '') {
      setLoading(false)
      alert('Please Complete all Fields')
    }
    else{
      try {
        await auth().signInWithEmailAndPassword(email,password)
        setLoading(false)

      } catch (error) {
        setLoading(false)
        let err = (error.message).split("]")
        let Error = err[1].trim()
        Alert.alert(
          'Error',
          Error
        )
      }
    }
  }
  
  const Nav = ( ) => {
    navigation.navigate('SignUp')
  setEmail('')
  setPassword('')
}

useEffect( () => {
  setImages("https://logolook.net/wp-content/uploads/2021/06/Symbol-Twitter.png")
}, [])


  return (
    <View style={styles.container}  >
      <StatusBar translucent={false} backgroundColor={'#00a2f3'} />
      {
        loading == true 
          ?
          (
            <View style={{flex:1,width: '100%' ,height: '100%', justifyContent:'center',alignItems: 'center',backgroundColor: '#00a2f3'}}>
              <ActivityIndicator size={50} color={'#fff'} />
            </View>
          )
          :
          (

            <View style={styles.container}  >


                  {/* // LOGO & Login Text  */}
            <View style={{
              flex: 1.9, 
              alignItems: 'center'
            }} >
              <Image source={{uri: Images}} style={[styles.twitterLogo]} />
              <Text style={[styles.SignUpText]} >Login</Text>
            </View>
  
                {/* Email Password Login  */}
            
            <View style={{
              flex: 2.1, 
              alignItems: 'center',
              paddingBottom: 30,
              backgroundColor: '#00a2f3',
            }} >
                                                {/* Email Text & TextInput */}
                  <Text style={[styles.inputText]} >Email</Text>
                  <TextInput style={styles.inputField} placeholder={'Email.123@email.com'} autoCorrect={false} value={email} onChangeText={(text) => setEmail(text)}  />
                
                                                {/* Password Text & TextInput */}
                  <Text style={styles.inputText} >Password</Text>
                  <TextInput style={styles.inputField} placeholder={'Password'} autoCorrect={false} value={password} onChangeText={(text) => setPassword(text)} />
                                            
                                            {/* Login_Submit Button SubmitLogin   */}
                  <TouchableOpacity style={styles.submitBtn} onPress={() => SubmitLogin()} >
                    <Text style={styles.submitBtnTxt}>Login</Text>
                  </TouchableOpacity>
  
                  <TouchableOpacity style={[styles.BackBtn, {alignSelf: 'center', top: 16, left: 0 } ]} onPress={() => Nav() } >
                    <Text style={styles.submitBtnTxt}>I don't have an account..?</Text>
                  </TouchableOpacity>       
  
              </View>       
        </View>
      )
        
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00a2f3',
  },
  welcomeText: {
    fontSize: 18,
    fontFamily: 'Overpass-Medium',
    color: '#fff',
    // marginTop: -10
  },
  twitterLogo: {
    width: 180,
    height: 180,
    marginTop: 10,
  },
  SignUpText: {
    marginTop: 5,
    fontSize: 32,
    color: '#fff',
    fontFamily: 'Sono_Monospace-Bold',
  },
  inputText: {
    fontSize: 14,
    fontFamily: 'Ubuntu-Regular',
    alignSelf: 'flex-start',
    marginTop: 18,
    marginLeft: "10%",
    marginBottom: 4,
    color: '#fff',
  },
  inputField: {
    width: 320,
    height: 45,
    borderRadius: 5,
    fontSize: 16,
    paddingLeft: 15,
    backgroundColor: '#fafafa',
    elevation: 10,
    fontFamily: 'Ubuntu-Regular',
    color: '#000'
  },
  submitBtn: {
    width: 320,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    top: 20,
    borderColor: '#fff',
    borderWidth: 2,
    marginBottom: 20
  },  
  submitBtnTxt: {
    fontSize: 16,
    fontFamily: 'Sono_Monospace-Medium',
    color: '#fff',
  },
})