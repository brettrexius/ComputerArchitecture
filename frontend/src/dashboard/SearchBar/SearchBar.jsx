import React, {useState, useEffect} from 'react';
import Select from 'react-select';
import "./SearchBar.scss";

const styles = {
  multiValue: (base, state) => {
    return state.data.isFixed ? { ...base, backgroundColor: "gray" } : base;
  },
  multiValueLabel: (base, state) => {
    return state.data.isFixed
      ? { ...base, fontWeight: "bold", color: "white", paddingRight: 6 }
      : base;
  },
  multiValueRemove: (base, state) => {
    return state.data.isFixed ? { ...base, display: "none" } : base;
  }
}

// const friends = [
//   { value: 'chocolate', label: 'Chocolate', isFixed:true},
//   { value: 'strawberry', label: 'Strawberry', isFixed: false },
//   { value: 'vanilla', label: 'Vanilla', isFixed:false },
// ];  

// Turn FriendList into SearchItem
const friendFilter = (friends, currentUser) => {
  let frds = [...friends];
  frds[frds.length] = currentUser[0];
  return frds.map(function(frd, i){
    let isFixed = false;
    if(frds.length - 1  == i) isFixed = true;
    return {value: frd._id, label: (frd.firstname + " " + frd.lastname), isFixed: isFixed};
  }) 
}

// const SearchBar = ({options, handleChange}) => {
const SearchBar = ({friends, currentUser, setGroupMembers}) => {
  const filteredFriends = friendFilter(friends, currentUser);
  return(
    <div className="user-select">
      <Select
        defaultValue= {[filteredFriends[filteredFriends.length - 1]]}
        isClearable= {false}
        isMulti
        name="users"
        options={filteredFriends || []}
        className="multi-user-select"
        classNamePrefix="select"
        styles={styles}
        onChange={setGroupMembers}
      />
    </div>
  )
};
export default SearchBar;
