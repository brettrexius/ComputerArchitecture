import React, { useState, useEffect } from "react";
import "./FriendRequest.scss"


import {SlideDown} from 'react-slidedown'
import 'react-slidedown/lib/slidedown.css'
const FriendRequest = ({request,denyFriendRequest, acceptFriendRequest}) => {

  return (
    <div className="friend-request">
      <p>A friend request from <b>{request.fromName}</b></p>
      <div className="result-options">
        <span onClick={()=>{acceptFriendRequest (request)}}><i className="fa fa-check"></i></span>
        <span onClick={()=>{denyFriendRequest   (request)}}><i className="fa fa-times"></i></span>
      </div>
    </div>
  );
}

export default FriendRequest;
