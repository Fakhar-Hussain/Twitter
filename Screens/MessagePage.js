import React, { useEffect, useState } from 'react'
import {StatusBar,ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Image } from 'react-native'

import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { launchImageLibrary } from "react-native-image-picker"


export default function MessagePage({ navigation, user }) {

  const [message, setMessage] = useState("")
  const [images, setImages] = useState("")
  const [imageHeight, setImageHeight] = useState(0)

  const [userProfiles, setUserProfiles] = useState('')
  const [loading, setLoading] = useState(false)


  const UsersProfile = async () => {
    const snapshots = firestore().collection('users').where('uid', '==', user.uid)
    snapshots.onSnapshot((querySnap) => {
      const allUsers = querySnap?.docs.map(item => item.data())
      setUserProfiles(allUsers)
    })
  }


  const ProfilePicture = () => {
    setLoading(true)
    launchImageLibrary({}, (item) => {
      if (item.didCancel) {
        setLoading(false)
        Alert.alert(
          'Tweet Picture',
          'No Picture Selected'
          )
        }
        else {
        let imagePath = item.assets[0].uri
        let imageHeight = item.assets[0].height
        console.log(imageHeight)
        console.log(imagePath)

        setImageHeight(imageHeight)

        const uploadTask = storage().ref().child(`/TweetPicture/${'Picture' + '_' + Date.now()}`).putFile(imagePath)
        uploadTask.on('state_changed',

          (snapshot) => {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (progress == 100) {
              Alert.alert(
                'Tweet Picture',
                'Picture Uploaded Successfully'
              )
              setLoading(false)
            }

          },

          (error) => {
            setLoading(false)
            Alert.alert(
              'Tweet Picture',
              'Sorry! Picture not Uploaded'
            )
          },

          () => {
            uploadTask.snapshot.ref.getDownloadURL()
              .then((downloadURL) => {
                setImages(downloadURL)
              });
          }

        )
      }

    })
  }



  const postMessage = () => {
    if (message == '') {
      Alert.alert(
        'Message',
        'Please Fill Your Tweet First...'
      )
    } else {
      firestore().collection('Tweets')
        .add({
          name: userProfiles[0].name,
          email: userProfiles[0].email,
          profileImage: userProfiles[0].profileImage,
          postId: "",
          message: message,
          likes: [],
          comments: 0,
          time: new Date(),
          userId: user.uid,
          tweetPicture: images,
          tweetPictureHeight: imageHeight / 2,
        })
        .then((docRef) => {
          firestore().collection('Tweets').doc(docRef.id).update({
            postId: docRef.id
          })
          // console.log("Document written with ID: ", docRef.id);
          navigation.navigate('Home')
          setMessage('')
        })
    }

  }




  useEffect(() => {
    UsersProfile()

  }, [])

  return (
    <View style={styles.container} >
      <StatusBar translucent={false} backgroundColor={'#00a2f3'} />

      {
        loading == true
          ?
          (
            <View style={{ flex: 1, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
              <ActivityIndicator size={40} color={'#00a2f3'} />
            </View>
          )
          :
          (
            <View style={styles.container} >
              <View style={{ flex: 0.5 }} >
                <TextInput
                  style={styles.messageField}
                  placeholder={"Type Message Here..."}
                  multiline={true}
                  textAlignVertical={"top"}
                  autoCorrect={false}
                  value={message}
                  onChangeText={(text) => setMessage(text)}
                />
                <TouchableOpacity style={{ alignSelf: 'flex-end', right: 18,top: 26}} onPress={() => ProfilePicture()} >
                  <Icon
                    // source={{ uri: "https://o.remove.bg/downloads/fdb0c456-860d-46cc-bce8-d5ff8764d66d/2659360-removebg-preview.png" }}
                    name='image-multiple'
                    size={38}
                    color={"#00a2f3"}
                    style={{ width: 45, height: 45 }}
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.postView} onPress={() => postMessage()} >
                <Text style={styles.postText} >
                  Post Message
                </Text>
              </TouchableOpacity>

            </View>
          )
      }

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageField: {
    height: "55%",
    width: "94%",
    backgroundColor: '#dedcdc',
    marginHorizontal: "3%",
    top: 20,
    borderRadius: 12,
    padding: 14,
    color: '#333',
    fontFamily: 'Ubuntu-Regular',
    fontSize: 20,
    // position: 'absolute'
    // paddingBottom: 20,
  },
  postView: {
    top: "86%",
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#00a2f3",
    width: "94%",
    height: 50,
    marginHorizontal: '3%',
    borderRadius: 8,
    position: 'absolute'
  },
  postText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Ubuntu-Bold'
  },
})