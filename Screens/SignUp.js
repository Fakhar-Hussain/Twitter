import React, {useEffect, useState} from 'react'
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

import {launchImageLibrary} from "react-native-image-picker"

import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';


export default function SignUp({navigation}) {

  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [profileImage, setProfileImage] = useState('')
  
  
  const [condition, setCondition] = useState(true)
  const [enabled, setEnabled] = useState(false)
  const [next, setNext] = useState(false)

  const [loading, setLoading] = useState(false)

  const [logo, setLogo] = useState()
  const [Images , setImages] = useState("https://logolook.net/wp-content/uploads/2021/06/Symbol-Twitter.png")




  const ProfilePicture = () => {
    setLoading(true)
    launchImageLibrary({}, (item) => {
      if (item.didCancel) {
        setLoading(false)
        Alert.alert(
          'Profile Picture',
          'No Picture Selected'
        )
      }
      else{
      let imagePath = item.assets[0].uri
      const uploadTask = storage().ref().child(`/ProfilePicture/${'Picture'+'_'+Date.now()}`).putFile(imagePath)
      uploadTask.on('state_changed' , 

          (snapshot) => {
            var progress = ( snapshot.bytesTransferred / snapshot.totalBytes ) * 100;
            if (progress == 100) {
              Alert.alert(
                'Profile Picture',
                'Picture Uploaded Successfully'
                )
              setLoading(false)
            }
    
          },

          (error) => {
            setLoading(false)
            Alert.alert(
              'Profile Picture',
              'Sorry! Image not Uploaded'
            )
          },

          () => {
            uploadTask.snapshot.ref.getDownloadURL()
            .then( (downloadURL) => {
              setProfileImage(downloadURL)
            });
          }
        
        )
      }
      
    })
  }
 

  const Submit = async () => {
    setLoading(true)
    if (name == '') {
      setLoading(false)
      alert('Please Enter Your Profile Name...')
    } 
    else if (profileImage == '') {
      setLoading(false)
      alert('Please Select Your Profile Image...')
    }
    else{
      try {
        const result = await auth().createUserWithEmailAndPassword(email,password);

        firestore().collection('users').doc(result.user.uid).set({
          name: name,
          email: email,
          password: password,
          uid: result.user.uid,
          profileImage: profileImage,
          // status: "online",
        }).then(() => {
          Alert.alert(
            'Profile',
            'SignUp Completed Successfuly'
          )
          setLoading(false)
        })
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

  const Next = () => {
    if (email == '' || password == '') {
      alert('Please Complete all Fields')
    }
    else{
      setNext(true)
    }
  }

  const Nav = ( ) => {
    navigation.navigate('Login')
    setEmail('')
    setPassword('')
    setName('')
    setProfileImage('')
  }
      
  
  useEffect( () => {
    setImages("https://logolook.net/wp-content/uploads/2021/06/Symbol-Twitter.png")
  }, [])



  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={"#00a2f3"}/>
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
          <View style={styles.container}>

                              {/* LOGO & SignUp */}
              <View style={{
                flex: 1.9, 
                alignItems: 'center',
              }}>
                <Image source={{uri: Images}} style={styles.whatsappLogo} />
                <Text style={styles.SignUpText} >SignUp</Text>
              </View>

                              {/* Email & Password SignUp */}
              <View style={{
                flex: 2.1, 
                alignItems: 'center',
                paddingBottom: 30,
                backgroundColor: '#00a2f3',
              }}>

              {
                !next 
                
                ?
                <>           
                                                  {/* Email Text & TextInput */}
                    <Text style={[styles.inputText]} >Email</Text>
                    <TextInput style={styles.inputField} placeholder={'Email.123@email.com'} autoCorrect={false} value={email} onChangeText={(text) => setEmail(text)} onFocus={() => setEnabled(true)} />
                  
                                                 {/* Password Text & TextInput */}
                    <Text style={styles.inputText} >Password</Text>
                    <TextInput style={styles.inputField} placeholder={'Password'} autoCorrect={false} value={password} onChangeText={(text) => setPassword(text)} onFocus={() => setEnabled(true)} />
                                                        
                                                      {/* Submit Button */}
                    <TouchableOpacity style={styles.submitBtn} onPress={() => Next()}>
                      <Text style={styles.submitBtnTxt}>Next</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.BackBtn, {alignSelf: 'center', top: 16, left: 0 } ]} onPress={() => Nav()} >
                      <Text style={styles.submitBtnTxt}>I already have an account..?</Text>
                    </TouchableOpacity>
                </>
                :
                <> 
                                            {/* NAME Text & TextInput */}
                  <Text style={styles.inputText} >Name</Text>
                  <TextInput style={styles.inputField} placeholder={'Profile-Name'} autoCorrect={false} value={name} onChangeText={(text) => setName(text)} onFocus={() => setEnabled(true)} />
                    
                    <View style={{marginTop: 16}} >
                                            
                                            {/* Upload Image */}

                      <TouchableOpacity style={[styles.submitBtn, {height: 50} ]} onPress={() => ProfilePicture()} >
                        <Text style={[styles.submitBtnTxt]}>Upload Profile Image</Text>
                      </TouchableOpacity>
                                          {/* SignUp Button */}

                      <TouchableOpacity style={styles.submitBtn} onPress={() => Submit()} >
                        <Text style={styles.submitBtnTxt}>SignUp</Text>
                      </TouchableOpacity>
                                      
                                            {/* Back Button */}

                      <TouchableOpacity style={styles.BackBtn} onPress={() => setNext(false)} >
                        <Text style={styles.submitBtnTxt}>Back</Text>
                      </TouchableOpacity>

                    </View>          
                </>
              }                  
              
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
  whatsappLogo: {
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
    // marginLeft: 50,
    marginLeft: "10%",
    marginBottom: 4,
    color: '#fff'
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
    color: '#fff'
  },
  BackBtn: {
    top: 10,
    alignSelf: 'flex-end',
    right: 14,
    color: '#fff'
  },

})


