import React, {useEffect, useState} from 'react';
import './dashboard.scss'
import auth from '../services/authService';
import http from '../services/httpService'
import { apiUrl } from "../config.json";
import SearchBar    from './SearchBar/SearchBar';
import GroupList    from './GroupList/GroupList';
import ChatBox      from './ChatBox/ChatBox';
import FriendList   from './FriendList/FriendList';
import Notification from './Notification/Notification';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


let toastConfig = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true
}

// import io from "socket.io-client";
// let socket;           // Init socket
// socket = io(apiUrl);  // 

const DashBoard = ({socket}) => {
  const [currentUser, setCurrentUser] = useState([auth.getCurrentUser()]);

  /***
   * 0: init
   * 1: after initialized all HTTP {groups, notification, friendrequests}
   * 2: after initialized socket {friends}
   */
  const [afterInit, setAfterInit] = useState(0);

  const [selectedGroup, setSelectedGroup] = useState(-1);

  const [groups, setGroups] = useState([]);
  // const [groups, setGroups] = useState([
  //   { groupID: 0, groupMembers: "Jimmy Nguyen, Trung Nguyen", isGroup: 1, isActive: false,
  //       recentMessage: "Test, which is a new approach to have all solutions astrology under one roof." },
  //   { groupID: 1, groupMembers: "Kyle Nguyen, Hai Le", isGroup: 0, isActive: false,
  //       recentMessage: "Test, which is a new approach to have all solutions astrology under one roof." }
  // ]);
  const [friends, setFriends]   = useState([]);
  // const [friends, setFriends]   = useState([
  //   {_id: 0, firstname: "Trung", lastname:"Nguyen", online: false},
  //   {_id: 1, firstname: "Jimmy", lastname:"John", online: false},
  // ]);
  const [requests, setRequests] = useState([]);
  // const [requests, setRequests] = useState(([
  //   {fromName:"David Brown", from:1, to:2},
  //   {fromName:"Trung Nguyen", from:2, to:3},
  // );
  const [message, setMessage]   = useState('');
  // const [message, setMessage]   = useState('Hey There!');
  const [messages, setMessages] = useState([]);
  // const [messages, setMessages] = useState([
  //   {text: "lol", user: "not admin"},
  //   {text: "jk", user: "admin"}
  // ]);


 /*================== /Friends\ ==================*/
 const sendFriendRequest = (_id) => {
   if(_id == currentUser[0]._id){
     toast.error("You Can't Send Request To Yourself!", toastConfig);
   } else {
     let exist = false;
     for(let i in friends)
       if (friends[i]._id == _id)
         exist = true;
     if(exist){
       toast.error("You Can't Send Request To Yourself!", toastConfig);
     } else {
       socket.emit('sendFriendRequest', {from:  currentUser[0]._id, to: _id} );
     }
   }
 }

 /*================== \Friends/ ==================*/

  /*================== /Groups\ ==================*/

  useEffect(function(){
    socket.emit('join', {groupID: selectedGroup})
    return function(){
      socket.off();
    }
  },[selectedGroup]);




  /*###################### Notifyings ######################*/
  useEffect(function(){ 
    /*================== [Friend] {Online, Offline} ==================*/
    //1> Being notified: a friend just login => Update UI
    socket.on('userOnlineNotification',function(data){
      setFriends(friends.map(function(friend,i){
        if(friend._id == data._id)
          friend.online = true;
        return friend;
      }))
    });
    //2> Being notified: a friend just logout => Update UI
    socket.on('userOfflineNotification',function(data){
      setFriends(friends.map(function(friend,i){
        if(friend._id == data._id)
          friend.online = false;
        return friend;
      }))
    });

    /*================== [Groups] {leave, join} ==================*/
    //1> Being Notified: a user has leave group => Update UI
    socket.on('notifyGroupLeave', function(data){
      let grps = [...groups];
      for(let i in grps){
        if (grps[i].groupID == data.groupID){
          let grpMembers = grps[i].groupMembers.split(", ");
          let names = "";
          for(let i in grpMembers){
            if(grpMembers[i] != data.name){
              names += grpMembers[i] + ", ";
            }
          }
          names = names.substring(0, names.length - 2);
          grps[i].groupMembers = names;
          break;
        }
      }
      setGroups(grps);
    })

    //2> Being Notified: a user has leave group => Update UI
    socket.on('notifyGroupCreate', function(data){
      data['isGroup'] = 1;
      setGroups([...groups,data]);
    })

     /*================== [Friends] {leave, join} ==================*/
    //1> Being Notified: a user has friend-requested you => Update UI
    socket.on('notifyFriendRequest', function(data){
      setRequests([...requests, data]);
      toast("You Just Got A Friend Request!", toastConfig);
    });

    //2> Being Notified: a friend-requested request has been accepted => Update UI
    socket.on('acceptFriendRequestNotification', function(data){
      toast("Your and " +data.friend.firstname + " " + data.friend.lastname + " have become friend!", toastConfig);
      console.log(data);
      setFriends([...friends,data.friend]);
      setGroups([...groups,data.group]);
    });

    return function(){
      socket.off();
    }
  })



  // useEffect(function(){
  //   /*================== [Groups] {leave, join} ==================*/
  //   //1> Being Notified: a user has leave group => Update UI
  //   socket.on('notifyGroupLeave', function(data){
  //     let grps = [...groups];
  //     for(let i in grps){
  //       if (grps[i].groupID == data.groupID){
  //         let grpMembers = grps[i].groupMembers.split(", ");
  //         let names = "";
  //         for(let i in grpMembers){
  //           if(grpMembers[i] != data.name){
  //             names += grpMembers[i] + ", ";
  //           }
  //         }
  //         names = names.substring(0, names.length - 2);
  //         grps[i].groupMembers = names;
  //         break;
  //       }
  //     }
  //     setGroups(grps);
  //   })

  //   //2> Being Notified: a user has leave group => Update UI
  //   socket.on('notifyGroupCreate', function(data){
  //     setGroups([...groups,data]);
  //   })
    
  //   return function(){
  //     socket.off();
  //   }
  // },[groups,afterInit])

  const removeGroup = (grpID) => {
    setSelectedGroup(-1);
    setGroups(groups.filter(function(grp,i){
      return grp.groupID != grpID
    }));
    socket.emit('leaveGroupChat', {groupID: grpID, userID:currentUser[0]._id})
  }
  /*================== \Groups/ ==================*/

  /*================== /SearchBar & CreatGroup\ ==================*/
  const [groupMembers, setGroupMembers] = useState([]);
  const createGroup = () => {
    if(groupMembers.length > 2 ){
      let nMembersUI = "";
      let members = groupMembers.map(function(member,i){
        nMembersUI += member.label + (groupMembers.length -1 == i ? "":", ");
        return member.value
      })
      socket.emit('createGroupChat',{_id: currentUser[0]._id, members: members, groupName:nMembersUI },function(groupID){
        //>> Update UI Group UI here!
        setGroups([...groups, {groupID:groupID, groupMembers: nMembersUI, isGroup: 1, isActive:false}])
      });
    } else {
      toast.error("Group must have at least 3 members!", toastConfig);
    }
  }
  /*================== \SearchBar & CreatGroup/ ==================*/




  /*================== /Notification\ ==================*/
 
  const acceptFriendRequest = (request)=>{
    // Update UI: remove USER
    let rqs = [...requests];
    rqs = rqs.filter(function(rq, i){
      return (rq.from != request.from) && (rq.to != request.to)
    })
    setRequests(rqs);

    //>> Emmit the 'acceptFriendRequest' ?? Notify other ppl?
    socket.emit('acceptFriendRequest', {from:request.from, to: request.to}, function(data){
      setFriends([...friends,data.friend]);
      setGroups([...groups,data.group]);
    });
  }

  const denyFriendRequest = (request)=>{
    // Update UI: remove USER
    let rqs = [...requests];
    rqs = rqs.filter(function(rq, i){
      return (rq.from != request.from) && (rq.to != request.to)
    })
    setRequests(rqs);

    socket.emit('denyFriendRequest', {from:request.from, to: request.to} );
  }

  // // notifyFriendRequest
  // useEffect(function(){
  //   /*================== [Friends] {leave, join} ==================*/
  //   //1> Being Notified: a user has friend-requested you => Update UI
  //   socket.on('notifyFriendRequest', function(data){
  //     setRequests([...requests, data]);
  //     toast("You Just Got A Friend Request!", toastConfig);
  //   });

  //   //2> Being Notified: a friend-requested request has been accepted => Update UI
  //   socket.on('acceptFriendRequestNotification', function(data){
  //     toast("Your and " +data.friend.firstname + " " + data.friend.lastname + " have become friend!", toastConfig);
  //     console.log(data);
  //     setFriends([...friends,data.friend]);
  //     setGroups([...groups,data.group]);
  //   });

  //   return () => {
  //     socket.off();
  //   }
  // },[requests,afterInit])
  /*================== \Notification/ ==================*/

  /*================== /Messages\ ==================*/

  useEffect(()=>{
    // Notify other users who in theory in that group BUT not in that group in UI
    socket.on('notify', function(data){
      let ngrps = [...groups];
      if (data.groupID != selectedGroup){
        toast("New Message:" + data.recentMessage, toastConfig);
        // Loop Through 'not selected' Groups
        for(let i in ngrps){
          if (ngrps[i].groupID == data.groupID){
            ngrps[i].recentMessage = data.recentMessage;
            break;
          }
        }
        setGroups(ngrps);
      }
    });

    socket.on('message', (data) => {
      let msg = data.msg;
      let groupID = data.groupID
      setMessages([...messages, msg ]); // update msg

      let ngrps = [...groups];
      // Update recent TEXT
      for(let i = 0; i < ngrps.length ;i++){
        if(ngrps[i].groupID == groupID)
          ngrps[i].recentMessage = msg.text;
      }setGroups(ngrps);
    });
    
    return () => {
      socket.off();
    }
  });
  // }, [messages,groups, afterInit, requests, message]);

  const sendMessage = (e) =>{ 
    e.preventDefault();
    if(message.length !== 0){
      console.log("Message Sent!");
      let nmsg = {text: message, _id: currentUser[0]._id, user: currentUser[0].name, groupID: selectedGroup, groups: groups};
      setMessage("");
      socket.emit('sendMessage', nmsg );
    }
  }

  // Select Different Group 
  useEffect(()=>{
    if(selectedGroup != -1){
      http.post(apiUrl + "/dashboard/getgroupmessages", {groupID:selectedGroup}).
      then(function(data){
        setMessages(data.data);
      },function(error){
        console.log(error)  
      })
    }
  },[selectedGroup])
  /*================== \Messages/ ==================*/
  //> Init Data
  useEffect(()=>{
    socket.emit('signin', currentUser[0], (error,data) => {
      socket.emit('initFriends',{userID: currentUser[0]._id},function(data){
        setFriends(data);
        setAfterInit(2);
      })   
    })

    auth.fetchCurrentUserData('/dashboard/initgroups').then(
      function(data){
        setGroups(data.data.groups);
      }, 
      function(error){ 
        console.log(error);
      }
    )
    // .then(
    //   function(){
    //     // auth.fetchCurrentUserData('/dashboard/initfriends').then(
    //     //   function(data){
    //     //     setFriends(data.data);
    //     //   }, 
    //     //   function(error){ 
    //     //     console.log(error);
    //     //   }
    //     // )
    //   }
    // )
    .then(
      function(){
        auth.fetchCurrentUserData('/dashboard/initfriendrequests').then(
          function(data){
            setRequests(data.data);
          }, 
          function(error){ 
            console.log(error);
          }
        )
      }
    ).then(
      function(){
        setAfterInit(1);
      }
    )

    // socket.emit('initFriends',{userID: currentUser[0]._id}, function(data){
    //   setFriends(data);
    //   setAfterInit(2);
    // })
  },[])
 
  return(
    <div className="dashboard">
      <ToastContainer
        position="top-right"
        autoClose={7000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnVisibilityChange
        draggable
        pauseOnHover
      />
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-3">
            <button className="btn btn-primary" onClick={createGroup}>Create Group</button>
          </div>
          <div className="col-sm-6">
            {/* SearchBar */}
            <SearchBar friends={friends} currentUser={currentUser} setGroupMembers={setGroupMembers}/>
          </div>
          <div className="col-sm-3">
              <Notification denyFriendRequest={denyFriendRequest} acceptFriendRequest={acceptFriendRequest} requests={requests} setRequests={setRequests}/>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-3">
            {/* ChatList */}
            <GroupList groups={groups} setGroups={setGroups} removeGroup={removeGroup} setSelectedGroup={setSelectedGroup}/>
          </div>
          <div className="col-sm-6">
            {/* ChatBox */}
            {selectedGroup == -1 ? "":
              <ChatBox
                selectedGroup={selectedGroup} groups={groups} sendMessage={sendMessage}
                currentUser={currentUser[0].name} message={message} setMessage={setMessage} messages={messages} setMessages={setMessages}/>
            }
           </div>
          <div className="col-sm-3">
            {/* FriendList */}
            <FriendList sendFriendRequest={sendFriendRequest} friends={friends} setFriends={setFriends}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashBoard;