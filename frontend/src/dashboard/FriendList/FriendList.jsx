import React, { useState, useEffect } from "react";
import Friend from './Friend/Friend';
import Search from './Search/Search';
import './FriendList.scss';

const FriendList = ({friends, setFriends, sendFriendRequest}) => {
  // const [name, setName]         = useState('Jimmy');
  // const [friend, setFriend]     = useState('');
  // const [friends, setFriends]   = useState(friendList);
  const removeFriend = (id) =>{
    setFriends(friends.filter((friend)=>{return friend._id != id}))
  }
  return (
    <div className="friends">
      <Search sendFriendRequest={sendFriendRequest}/>
      <hr style={{border: "solid 1px #d1d4e1"}}/>
      <ul className="friend-list">
        {friends.map((friend, i)=> <li key={i}><Friend friend={friend} removeFriend={removeFriend}/></li> )}
      </ul>
    </div>
  );
}
export default FriendList;
