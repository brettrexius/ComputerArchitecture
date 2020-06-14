import React, {useEffect, useState} from 'react';
import './dashboard.scss'
import auth from '../services/authService';
import { apiUrl } from "../config.json";
import SearchBar    from './SearchBar/SearchBar';
import GroupList    from './GroupList/GroupList';
import ChatBox      from './ChatBox/ChatBox';
import FriendList   from './FriendList/FriendList';
import Notification from './Notification/Notification';
import io from "socket.io-client";


let socket; // Init socket


const DashBoard = () => {
  // const [init, setInit] = useState(auth.getJwt());
  const [init, setInit] = useState('');
  const [currentUser, setCurrentUser] = useState([auth.getCurrentUser()])
  
  const [selectedGroup, setSelectedGroup] = useState(-1);
  const [groups, setGroups] = useState([
    { groupID: 0, groupMembers: "Jimmy Nguyen, Trung Nguyen", isGroup: true, isActive: false,
        recentMessage: "Test, which is a new approach to have all solutions astrology under one roof." },
    { groupID: 1, groupMembers: "Kyle Nguyen, Hai Le", isGroup: false, isActive: false,
        recentMessage: "Test, which is a new approach to have all solutions astrology under one roof." },
    { groupID: 2, groupMembers: "James Frank, David Brown, Leon Duke", isGroup: true, isActive: false,
        recentMessage: null }
  ]);

  const [memberSelected, setMemberSelected] = useState([]);

  const [friends, setFriends]   = useState([
    {id: 0, firstname: "Trung", lastname:"Nguyen"},
    {id: 1, firstname: "Jimmy", lastname:"John"},
    {id: 2, firstname: "Kyle",  lastname:"Le"},
  ]);

  const [requests, setRequests] = useState([
    {from:"David Brown"},
    {from:"Trung Nguyen"},
    {from:"Kung Bao"}]
  );
  
  
  const createGroup = ()=> {
    alert("awe");
  }
 
  // useEffect(() => {
  //   socket = io(apiUrl);
  //   socket.emit('init', auth.getCurrentUser(), (error,data) => {
  //   });
  //   // return () => {
  //   //   // socket.emit('disconnect',user,(error,data) =>{
  //   //   // });
  //   //   // socket.off();
  //   // }
  // }, [init])

  return(
    <div className="dashboard">
      {console.log(selectedGroup)}
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-3">
            <button className="btn btn-primary" onClick={createGroup}>Create Group</button>
          </div>
          <div className="col-sm-6">
            {/* SearchBar */}
            <SearchBar friends={friends} currentUser={currentUser} setMemberSelected={setMemberSelected}/>
          </div>
          <div className="col-sm-3">
              <Notification requests={requests}/>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-3">
            {/* ChatList */}
            <GroupList groups={groups} setSelectedGroup={setSelectedGroup}/>
          </div>
          <div className="col-sm-6">
            {/* ChatBox */}
            <ChatBox/>
          </div>
          <div className="col-sm-3">
            {/* FriendList */}
            <FriendList friends={friends}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashBoard;