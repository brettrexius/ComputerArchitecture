import React, { useState, useEffect } from "react";
import "./Notification.scss"
import FriendRequest from './FriendRequest/FriendRequest';

const Notification = ({requests, setRequests, acceptFriendRequest,denyFriendRequest}) => {
  return (
    <div className="notification">
      {requests.length == 0  ? 
        <div className="none">
          <a className="bell" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
            <i className="fa fa-bell-o"></i>
          </a>
        </div>
      :
        <div className="dropdown">
          <a className="bell" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
            <span className="badge badge-danger ml-2">{requests.length}</span>
            <i className="fa fa-bell-o"></i>
          </a>
          <div className="dropdown-menu dropdown-menu-right dropdown-secondary">
            <h4 className="friend-request-title">Friend Requests:</h4>
            { requests.map((request, i)=> 
              <li key={i}><FriendRequest denyFriendRequest={denyFriendRequest} acceptFriendRequest={acceptFriendRequest}  request={request} /></li>
            )}
          </div>
        </div>
      }
      {/* <div className="dropdown">
        <a className="bell" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
          {requests.length == 0  ? "":
            <span className="badge badge-danger ml-2">{requests.length}</span>
          }
          <i className="fa fa-bell-o"></i>
        </a>
        {requests.length == 0  ? "":
          <div className="dropdown-menu dropdown-menu-right dropdown-secondary">
            <h4 className="friend-request-title">Friend Requests:</h4>
            { requests.map((request, i)=> 
              <li key={i}><FriendRequest denyFriendRequest={denyFriendRequest} acceptFriendRequest={acceptFriendRequest}  request={request} /></li>
            )}
          </div>
        }
      </div> */}
    </div>
  );
}

export default Notification;
