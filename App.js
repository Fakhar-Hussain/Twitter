import React, {useState,useEffect} from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'

import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'

import {navigationRef} from './RootNavigation.js';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import Login from './Screens/Login'
import SignUp from './Screens/SignUp'
import HomePage from './Screens/HomePage'
import MessagePage from './Screens/MessagePage'
import CommentPage from './Screens/CommentPage'
import ProfilePage from './Screens/ProfilePage'

const Stack = createNativeStackNavigator();

export default App = () => {

  const [user , setUser] = useState('');
  const [image , setImage] = useState("https://cdn-icons-png.flaticon.com/512/149/149071.png");


  
  
  useEffect( () => {

    const Subscription = auth().onAuthStateChanged(userExist => {
      if (userExist) {
        firestore().collection('users').doc(userExist.uid)
        .update({
          status: 'online'
        })
        setUser(userExist);
      } else {
        setUser('');
      }
    })
    
    return () => {
      Subscription();
    }
  },[])
  



  
  
  const snapshots = firestore().collection('users').doc(user.uid)
  snapshots.onSnapshot( (querySnap) => {
    const UserImage = querySnap.get('profileImage')
    setImage(UserImage)
  })

  return (
    <NavigationContainer ref={navigationRef} >
      <Stack.Navigator >
        {

          user !== ''
          ?
          <>
            <Stack.Screen name='Home' 
              options={{
                headerShown: true,
                headerStyle :{backgroundColor: "#00a2f3"},
                headerTitleAlign: 'center',
                headerTitle: () => {
                  return(
                    <View style={{flexDirection: 'row'}} >
                      <Text style={{fontSize: 24 ,fontFamily: 'Ubuntu-Medium', color: '#fff'}} >Twitter</Text>
                      <Icon name="twitter" color={"#fff"} size={26} style={{top: 2,left: 6}} />
                    </View>
                )}, 
                headerRight: () => {
                  return(
                    <TouchableOpacity style={{}} onPress={() => navigationRef.navigate('Profile' )} >
                      {/* <Text style={{fontSize: 18 ,top: 3,fontFamily: 'Ubuntu-Medium', color: '#fff'}} >SignOut</Text> */}
                      <Image style={{ width: 36,height: 36,borderRadius: 20,}} source={{uri: image }} />
                    </TouchableOpacity>   
                )},
                
              }} 
            >
              {props => <HomePage {...props} user={user} /> }
            </Stack.Screen>

            <Stack.Screen name='Message'
             options={{
                headerShown: true,
                headerStyle :{
                  backgroundColor: "#00a2f3",
                },
                headerTitleStyle: {
                  fontFamily: 'Ubuntu-Medium',
                },
                headerTintColor: "#fff",
                headerTitleAlign: 'center',
              }} 
            >
              {props => <MessagePage {...props} user={user} /> }
            </Stack.Screen>

            <Stack.Screen name='Comments'
             options={{
                headerShown: true,
                headerStyle :{
                  backgroundColor: "#00a2f3",
                },
                headerTitleStyle: {
                  fontFamily: 'Ubuntu-Medium',
                },
                headerTintColor: "#fff",
                headerTitleAlign: 'center',
              }} 
            >
              {props => <CommentPage {...props} user={user} /> }
            </Stack.Screen>

            <Stack.Screen name='Profile'
             options={{
                headerShown: true,
                headerStyle :{
                  backgroundColor: "#00a2f3",
                },
                headerTitleStyle: {
                  fontFamily: 'Ubuntu-Medium',
                },
                headerTintColor: "#fff",
                headerTitleAlign: 'center',
              }} 
            >
              {props => <ProfilePage {...props} user={user} /> }
            </Stack.Screen>
          </> 
          :
          <>
            <Stack.Screen name='Login' component={Login} options={{headerShown: false}} />
            <Stack.Screen name='SignUp' component={SignUp} options={{headerShown: false}} />
          </>
        }
      </Stack.Navigator>
    </NavigationContainer>
  )
}
