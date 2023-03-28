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
  RefreshControl
} from "react-native";

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import { format, formatDistanceStrict, } from 'date-fns'

export default function HomeScreen({ navigation, user }) {

  const [userProfiles, setUserProfiles] = useState('')
  const [refreshing, setRefreshing] = useState(false);



  const UsersProfile = async () => {
    const snapshots = firestore().collection('Tweets')
      .orderBy('time', 'desc')
    snapshots.onSnapshot((querySnap) => {
      const allUsers = querySnap?.docs.map(item => item.data())
      setUserProfiles(allUsers)
    })
  }

  const OnLike = (likes) => {
    // console.log(likes)
    let status = false;
    likes.map((item) => {
      if (item === user.uid) {
        status = true;
      } else {
        status = false;
      }
    });
    return status
  }


  const LikeBtn = (item) => {
    // console.log(item.postId)
    let tempLikes = item.likes;

    if (tempLikes.length > 0) {
      // tempLikes.push(user.uid)  
      if (tempLikes.includes(user.uid)) {

        tempLikes.forEach((items, index) => {
          if (items == user.uid) {
            if (index > -1) {
              tempLikes = tempLikes.filter(l => l != user.uid);
              console.log(tempLikes);
            }
          }
        })

      }
      else {
        tempLikes.push(user.uid)
      }

      console.log(tempLikes);
      // if( ){
      // }
    }
    else {
      tempLikes.push(user.uid)
    }


    firestore().collection('Tweets').doc(item.postId).update({
      likes: tempLikes,
    })

  }


  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const onRefresh = () => {
    setRefreshing(true)
    wait(3000).then(() => setRefreshing(false));
    UsersProfile();
  };

  const Nav = async (item) => {
    navigation.navigate("Comments", { tweet: item })
  }



  useEffect(() => {
    onRefresh()
  }, [])


  return (
    <View style={[styles.container]}>
      <StatusBar translucent={false} backgroundColor={'#00a2f3'} />

      <View style={[styles.container, { minHeight: "100%" }]}>
        <FlatList
          data={userProfiles}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.postId}
          refreshControl={
            <RefreshControl
              onRefresh={onRefresh}
              refreshing={refreshing}
              colors={["#00a2f3"]}
            />
          }
          renderItem={({ item }) => {

            // console.log(item.tweetPictureHeight);

            let Date24 = formatDistanceStrict(item.time.toDate(), Date.now(), { unit: 'hour' })
            let hours = format(item.time.toDate(), "hh:mm aaa")
            let date = format(item.time.toDate(), "ccc dd-LLL-yyyy")

            let HHH = Date24.split(' ')
            let HH = HHH[0]

            return (

              <View style={{ paddingBottom: 10 }}>

                <View style={styles.tweetView} >
                  {/* Tweet Box */}
                  <View style={styles.tweetFirstView}>

                    <Image style={styles.tweetImg} source={{ uri: item.profileImage }} />
                    <View style={{ flexDirection: "column" }}>

                      <View style={{ flexDirection: "column", marginBottom: 6 }}>
                                    {/* Tweet User Name */}
                        <Text style={[styles.tweetTxtname, { fontFamily: "Overpass-Regular" }]}>{item.name}</Text>
                        <Text style={[styles.tweetTxtemail, { fontFamily: "Overpass-Regular" }]}>{item.email}</Text>


                      </View>
                    {
                      item.tweetPicture 
                      ? 
                      (
                        <View>
                          <Text style={[styles.tweet, { fontFamily: 'Ubuntu-Regular' }]}>{item.message}</Text>
                          <Image 
                            source={{uri : item.tweetPicture}}
                            resizeMethod={'auto'}
                            style={{
                              height: item.tweetPictureHeight,
                              width: "98%",
                              borderRadius: 12,
                              // left: 6,
                              top: 13
                            }}
                          />
                        </View>
                      )
                      :
                      (
                        <Text style={[styles.tweet, { fontFamily: 'Ubuntu-Regular' }]}>{item.message}</Text>
                      )
                      }
                    </View>

                  </View>

                  {/* Like & Comment Box */}
                  <View style={styles.cmntList}>

                    {/* Likes Button */}
                    <TouchableOpacity style={styles.cmnt} onPress={() => LikeBtn(item)} >
                      {
                        OnLike(item.likes)
                          ?
                          (
                            <>
                              <Icon
                                name="thumb-up"
                                size={24}
                                color="#00a2f3"
                              />
                              <Text style={{ paddingLeft: 5, fontFamily: 'Overpass-Bold', color: "#00a2f3", }} >{(item.likes).length}</Text>
                            </>
                          )
                          :
                          (
                            <>
                              <Icon
                                name="thumb-up"
                                size={24}
                                color="grey"
                              />
                              <Text style={{ paddingLeft: 5, fontFamily: 'Overpass-Bold', color: "grey", }} >{(item.likes).length}</Text>
                            </>
                          )
                      }

                    </TouchableOpacity>
                    {/* Comment Button */}
                    <TouchableOpacity style={styles.cmnt} onPress={() => Nav(item)} >
                      <Icon
                        name="message-reply"
                        size={24}
                        color={"grey"}
                      />
                      <Text style={{ paddingLeft: 5, fontFamily: 'Overpass-Bold', color: "grey" }} >{item.comments}</Text>
                    </TouchableOpacity>

                  </View>

                  {/* Date & Time */}
                  <View style={{
                    // backgroundColor: 'pink',
                    // position: 'absolute',
                    flexDirection: 'row',
                    height: 25,
                    // width: 100,
                    left: 20,
                    alignSelf: 'flex-start',
                    top: -8,
                    alignItems: 'center',
                    justifyContent: 'space-evenly'
                  }}>
                    <Icon
                      name="earth"
                      size={16}
                      color={"grey"}
                      style={{ position: 'absolute', }}
                    />
                    <Text style={[styles.tweetTimeTxt, { fontFamily: 'Overpass-Bold', }]}>{HH > 6 ? (`${hours} - ${date}`) : (`Today ${hours} - ${date}`)}</Text>
                  </View>
                  {/* twitter android */}
                  <Text style={{ fontSize: 12, paddingHorizontal: 46, top: -12, fontFamily: 'Ubuntu-Bold', color: "#00a2f3" }} >Twitter for Android</Text>

                </View>

              </View>
            )
          }}
        />
        <View style={{ marginTop: 10 }}></View>
      </View>

      <TouchableOpacity style={styles.cmntBox} onPress={() => navigation.navigate('Message')}>
        <Icon
          name="comment-text-outline"
          size={28}
          color={"#fff"}
        />
      </TouchableOpacity>


    </View>

  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e3e3e3",
    zIndex: 1
  },
  tweetView: {
    backgroundColor: "#fff",
    borderRadius: 10,
    top: 10,
    // marginBottom: 10,
    marginHorizontal: '3%'
  },
  tweetFirstView: {
    marginLeft: 10,
    paddingTop: 12,
    flexDirection: "row"
  },
  tweetImg: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  tweetTxtname: {
    color: "#000",
    fontSize: 16,
    width: 160,
    // height: 24,
    // paddingTop: 3,
    top: 2,
    paddingLeft: 3,
    marginLeft: 8,
    // backgroundColor: 'pink'
  },
  tweetTxtemail: {
    color: "#777",
    fontSize: 13,
    width: 200,
    height: 20,
    // paddingTop: 3,
    paddingLeft: 4,
    marginLeft: 8,
    // backgroundColor: 'red'
  },
  tweetTimeView: {
    flexDirection: 'row',
    backgroundColor: "#fff",
    // marginTop: -4, 
    // marginLeft: 8, 
    width: 70,
    height: 25,
    alignItems: 'center',
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
    lineHeight: 30,
    top: 5
  },




  cmntList: {
    flexDirection: "row",
    marginTop: 30,
    justifyContent: "space-between",
    marginLeft: 70,
    width: 250,
    paddingBottom: 20
  },
  cmnt: {
    flexDirection: "row",
    borderRadius: 20,
    backgroundColor: "#f3f3f3",
    height: 40,
    width: "43%",
    alignItems: "center",
    justifyContent: "center",
    elevation: 6
  },
  cmntBox: {
    zIndex: 3,
    bottom: 80,
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
    borderRadius: 30,
    width: 60,
    height: 60,
    backgroundColor: '#00a2f3',
    elevation: 10,

  },
})

