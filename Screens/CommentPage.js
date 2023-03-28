import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  FlatList,
  RefreshControl,
  TextInput,
  Alert
} from "react-native";

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import { format, formatDistanceStrict, } from 'date-fns'

export default function CommentPage({ navigation, user, route }) {
  let tweet = route.params.tweet;

  const [userProfiles, setUserProfiles] = useState('')
  const [refreshing, setRefreshing] = useState(false);
  const [comment, setComment] = useState('');
  const [defaultFocus, setDefaultFocus] = useState(false);


  // .where('uid','!=',user.uid)
  const UsersProfile = async () => {
    const snapshots = firestore().collection('Tweets').doc(tweet.postId).collection('Comments')
      .orderBy('time', 'desc')
    // console.log(snapshots)
    snapshots.onSnapshot((querySnap) => {
      const allUsers = querySnap?.docs.map(item => item.data())
      setUserProfiles(allUsers)
    })
  }


  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const onRefresh = () => {
    setDefaultFocus(false)
    setRefreshing(true)
    wait(3000).then(() => setRefreshing(false));
    UsersProfile();
  };

  const commentsBox = async () => {
    if (comment == '') {
      Alert.alert(
        'Comments',
        'Please fill your comment box first..?'
      )
    } else {
      const snapshots = await firestore().collection('users').doc(user.uid).get()
      // console.log(snapshots.data())
      let User = snapshots.data();

      firestore().collection('Tweets').doc(tweet.postId).collection('Comments').add({
        userId: User.uid,
        name: User.name,
        email: User.email,
        profileImage: User.profileImage,
        time: new Date(),
        comment: comment,
        commentId: "",
      }).then((docRef) => {
        firestore().collection('Tweets').doc(tweet.postId).collection('Comments').doc(docRef.id).update({
          commentId: docRef.id
        })
        setComment('')
      })
      let commentSize = (await firestore().collection('Tweets').doc(tweet.postId).collection('Comments').get()).size
      firestore().collection('Tweets').doc(tweet.postId).update({
        comments: commentSize
      })

    }
  }

  useEffect(() => {
    onRefresh()
  }, [])
  
  
  // console.log(defaultFocus)

  let Date24 = formatDistanceStrict(tweet.time.toDate(), Date.now(), { unit: 'hour' })
  let hours = format(tweet.time.toDate(), "hh:mm aaa")
  let date = format(tweet.time.toDate(), "ccc dd-LLL-yyyy")

  let HHH = Date24.split(' ')
  let HH = HHH[0]

  return (
    <View style={styles.container} >
      <StatusBar translucent={false} backgroundColor={'#00a2f3'} />

      <View style={{ paddingBottom: 5, zIndex: 2 }}>

        <View style={[styles.tweetView]} >
          {/* Tweet Box */}
          <View style={styles.tweetFirstView}>

            <Image style={styles.tweetImg} source={{ uri: tweet.profileImage }} />
            <View style={{ flexDirection: "column" }}>

              <View style={{ flexDirection: "column", marginBottom: 6 }}>
                {/* Tweet User Name */}
                <Text style={[styles.tweetTxtname, { fontFamily: "Overpass-Regular" }]}>{tweet.name}</Text>
                {/* Tweet User Email */}
                <Text style={[styles.tweetTxtemail, { fontFamily: "Overpass-Regular" }]}>{tweet.email}</Text>
              </View>
              
              {/* {
                tweet.tweetPicture
                  ?
                  (
                    <View>
                      <Text style={[styles.tweet, { fontFamily: 'Ubuntu-Regular' }]}>{tweet.message}</Text>
                      {
                        defaultFocus == false
                        ?
                          <Image
                            source={{ uri: tweet.tweetPicture }}
                            resizeMethod={'auto'}
                            style={{
                              height: tweet.tweetPictureHeight / 2.2,
                              width: 150,
                              borderRadius: 12,
                              left: 12,
                              top: -10,
                              // position: 'absolute'
                            }}
                          />
                        :
                        null

                      }
                    </View>
                  )
                  :
                  (
                    )
              } */}
                    <Text style={[styles.tweet, { fontFamily: 'Ubuntu-Regular' }]}>{tweet.message}</Text>
            </View>

          </View>

          {/* Reply BoX */}
          <View style={{ flexDirection: 'row', height: 50, width: '100%',top: 5,}} >

            <TextInput placeholder="Reply Message..."
              value={comment}
              onChangeText={(text) => setComment(text)}
              onFocus={() => setDefaultFocus(true)}
              style={{
                width: "80%",
                height: 37,
                backgroundColor: '#f3f3f3',
                borderRadius: 8,
                paddingLeft: 16,
                marginLeft: 10,
                elevation: 6,
                paddingVertical: 6,
                fontFamily: "Overpass-Regular"
              }}
            />

            <TouchableOpacity
              onPress={() => commentsBox()}
              style={{
                backgroundColor: '#00a2f3',
                width: "13%",
                height: 37,
                marginLeft: "2%",
                borderRadius: 8,
                justifyContent: 'center',
                alignItems: 'center',
                elevation: 10,
              }}
            >
              <Icon name="send" color={"#fff"} size={28} style={{}} />
            </TouchableOpacity>
          </View>

        </View>



      </View>











      <View style={[styles.container, { top: '1%' }]} >
        <FlatList
          data={userProfiles}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.commentId}
          refreshControl={
            <RefreshControl
              onRefresh={onRefresh}
              refreshing={refreshing}
              colors={["#00a2f3"]}
            />
          }
          renderItem={({ item }) => {

            let Date24 = formatDistanceStrict(item.time.toDate(), Date.now(), { unit: 'hour' })
            let hours = format(item.time.toDate(), "hh:mm aaa")
            let date = format(item.time.toDate(), "ccc dd-LLL-yyyy")

            let HHH = Date24.split(' ')
            let HH = HHH[0]



            return (

              <View style={{ paddingBottom: 16, width: '90%', alignSelf: 'flex-end' }}>

                <View style={styles.tweetView} >

                  {/* Tweet Box */}
                  <View style={styles.tweetFirstView}>

                    <Image style={styles.tweetImg} source={{ uri: item.profileImage }} />
                    <View style={{ flexDirection: "column" }}>

                      <View style={{ flexDirection: "column", marginBottom: 6 }}>
                        {/* Tweet User Name */}
                        <Text style={[styles.tweetTxtname, { fontFamily: "Overpass-Regular" }]}>{item.name}</Text>

                        {/* Tweet User Email */}
                        <Text style={[styles.tweetTxtemail, { fontFamily: "Overpass-Regular" }]}>{item.email}</Text>
                      </View>

                      {/* Tweet User Post */}
                      <Text style={[styles.tweet, { fontFamily: 'Ubuntu-Regular' }]}>{item.comment}</Text>
                    </View>

                  </View>

                  {/* Date & Time */}
                  <View style={{
                    flexDirection: 'row',
                    height: 25,
                    // right: 65,
                    left: "10%",
                    alignSelf: 'flex-start',
                    top: -8,
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    // position: 'absolute'
                  }}>
                    <Icon
                      name="earth"
                      size={14}
                      color={"grey"}
                      style={{}}
                    />
                    <Text style={[styles.tweetTimeTxt, { fontSize: 10, fontFamily: 'Overpass-Bold', }]}>{HH > 6 ? date : (`Today ${hours}`)}</Text>
                  </View>

                </View>

              </View>
            )
          }}
        />
      </View>


      <View style={{ marginTop: 5, paddingBottom: 10 }}></View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e3e3e3",
    zIndex: 1
  },
  tweetView: {
    // flex: 2,
    backgroundColor: "#fff",
    borderRadius: 10,
    top: 10,
    bottom: 10,
    marginHorizontal: '3%',
    paddingBottom: 5,
  },
  tweetFirstView: {
    marginLeft: 10,
    paddingTop: 12,
    flexDirection: "row"
  },
  tweetImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  tweetTxtname: {
    color: "#000",
    fontSize: 16,
    width: 160,
    paddingLeft: 3,
    marginLeft: 8,
  },
  tweetTxtemail: {
    color: "#777",
    fontSize: 13,
    width: 200,
    height: 20,
    top: -5,
    paddingLeft: 4,
    marginLeft: 8,
  },
  tweetTimeTxt: {
    position: 'absolute',
    color: "#777",
    fontSize: 12,
    left: "6%",
    width: 220,
  },
  tweet: {
    color: "#334",
    fontSize: 22,
    width: 270,
    paddingLeft: 3,
    marginLeft: 10,
    paddingBottom: 15
  },
})