import React from 'react';

import onlineIcon from './icons/onlineIcon.png';
import closeIcon from './icons/closeIcon.png';

import './InfoBar.scss';

const InfoBar = () => (
  <div className="info-bar">
    <div className="leftInnerContainer">
      <img className="onlineIcon" src={onlineIcon} alt="online icon" />
      <h3>ChatBox</h3>
      {/* {
        groups[selectedGroup-1]?
          (<React.Fragment>
            <img className="onlineIcon" src={onlineIcon} alt="online icon" />
            <small>{groups[selectedGroup]?groups[selectedGroup-1].groupID :""}</small>
          </React.Fragment>):
          ""
      } */}
    </div>
  </div>
);

export default InfoBar;