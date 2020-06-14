import React, { useState, useEffect } from "react";
import "./Friend.scss"
import "./Unfriend.scss"
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

const Friend = ({friend, removeFriend}) => {
  const confirmRemoveFriend = ()=> {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='unfriend-confirm'>
            <h1>Unfriend Confirmation</h1>
            <p>Are you sure to unfriend: <b>{friend.firstname + " " + friend.lastname}</b> ?</p>
            <button onClick={() => {removeFriend(friend._id);onClose()}}>Yes</button>
            <button onClick={onClose}>No</button>
          </div>
        );
      }
    });
  }
  return (
    <div className="friend">
      <div className="about">
        <div className="name">{friend.firstname + " " + friend.lastname}</div>
        {friend.online ? 
          <div className="status"><i className="fa fa-circle online"></i> online</div> :
          <div className="status"><i className="fa fa-circle offline"></i> offline</div>
        }
        
      </div>
      <div className="unfriend">
        <button className="close" onClick={confirmRemoveFriend}>×</button>
      </div>
    </div>
  );
}

export default Friend;
