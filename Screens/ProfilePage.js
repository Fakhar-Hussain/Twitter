import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Image , ImageBackground, StatusBar } from 'react-native'

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function ProfilePage({user , route}) {
  
  const [profile , setProfile] = useState('')
  const [Images , setImages] = useState("https://iphoneswallpapers.com/wp-content/uploads/2017/09/Bluesteel-Screen-Geometric-iPhone-Wallpaper-iphoneswallpapers_com.jpg")
  


  const SignOut = () => {
      auth().signOut()
  }

  const User = async () => {
    const snapshots = await firestore().collection('users').where('uid','==',user.uid).get()
    snapshots.docs.map( (item) => {
        // console.log(item.data());
        setProfile(item.data())
    })
  }


  useEffect( () => {
    User()
    setImages("https://iphoneswallpapers.com/wp-content/uploads/2017/09/Bluesteel-Screen-Geometric-iPhone-Wallpaper-iphoneswallpapers_com.jpg")
  },[])

  return (
      
      // <View style={{ flex: 1, width: '100%', height: '100%',backgroundColor: 'red' }} >
      <ImageBackground 
        source={{uri: Images}}
        resizeMode={'cover'}
        style={{ flex: 1, width: '100%', height: '100%' }}
      >

        <StatusBar translucent={false} backgroundColor={'#00a2f3'} />


        <View style={styles.ImageView} >
          <View style={styles.TouchImageView} >
            <Image style={{width: 170,height: 170,borderRadius: 90,opacity: 0.9 }} source={{uri: profile.profileImage }} />
          </View>
        </View>

        {/* editable={false} */}
        <View style={styles.ProfileData} >
          <View style={{flexDirection: 'row'}} >
            <Text style={styles.Text} >Name: </Text>
            <TextInput style={styles.TextInput} value={profile.name} editable={false} />
          </View>
          
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.Text} >Email: </Text>
            <TextInput style={styles.TextInput} value={profile.email} editable={false} />
          </View>
          
          <TouchableOpacity style={styles.BtnView} onPress={() => SignOut()} >
            <Text style={styles.BtnText} >SignOut</Text>
          </TouchableOpacity>
      
        </View>
    {/* </View> */}
      </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#075E54",
    alignItems: "center",
  },
  ImageView: {
    flex: 1, 
    width: "100%", 
    alignItems: "center",
  },
  TouchImageView: {
    top: 40,
    elevation: 10
  },


  ProfileData: {
    flex: 2,
    width: "100%",  
    paddingTop: '25%',
    alignItems: "center"
  },
  Text: {
    top: 18,
    fontSize: 14,
    fontFamily: 'Ubuntu-Bold',
    color: '#fff'
  },
  TextInput: {
    width: "74%",
    height: 50,
    marginBottom: 10,
    color: '#fff',
    paddingLeft: 14,
    fontSize: 18,
    borderBottomWidth: 2,
    borderColor: '#fff',
    fontFamily: 'Ubuntu-Bold'
  },
  BtnView: {
    width: 140,
    height: 45,
    backgroundColor: '#00a2f3',
    borderRadius: 5,
    alignItems: "center",
    justifyContent: 'center',
    marginTop: 70,
    elevation: 8
  },
  BtnText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Ubuntu-Bold'
  },
})