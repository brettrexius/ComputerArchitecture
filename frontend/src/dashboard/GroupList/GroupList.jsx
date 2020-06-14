import React, { useState, useEffect } from "react";
import './GroupList.scss';
import Group from "./Group/Group";
import UserSelect from './UserSelect/UserSelect';

const GroupList = ({groups, setGroups, setSelectedGroup,removeGroup}) => {
  // const [active, setActive] = useState(-1);
  // const [groups, setGroups] = useState(groupList);
  // console.log("GROUP", groupList);

  const selectGroup = ( id )=> {
    const updatedGroupes = [...groups];
    updatedGroupes.forEach(group => {
      if(group.groupID == id) { group.isActive = true }
      else {group.isActive = false}
    }) 
    // // We don't really need setGroups here. It's only to set active UI!
    setGroups(updatedGroupes);
    setSelectedGroup(id)
  }

  return (
    <div className="group-list">
      <h4 className="group-list-label">Inbox</h4>
      <ul>
        { groups.map((group, i)=> 
          <li key={i}><Group removeGroup={removeGroup} group={group} selectGroup={selectGroup}/></li>
        )}
      </ul>
    </div>
  );
}

export default GroupList;
