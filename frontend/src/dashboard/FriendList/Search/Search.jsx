import React, { useState, useEffect } from "react";
import http from '../../../services/httpService';
import { apiUrl } from "../../../config.json";

import SearchResult from "./SearchResult/SearchResult";
import "./Search.scss"
const Search = ({sendFriendRequest}) => {
  const [typing, setTyping]       = useState('');
  const [slideDown, setSlideDown] = useState(false);
  const [queryDone, setQueryDone] = useState(false);
  const [result, setResult]       = useState([]); //Make sure data Empty => No result
  
  const searchFriend = () =>{
    // alert(typing);
    http.post(apiUrl + "/dashboard/searchfriend", {username:typing}).then(function(res){
      setResult(res.data)
    })
    setQueryDone(true);
  }
  // Not Found  : []
  // Found      : [{_id:1, name:'Mr. Admin'}]
  const slide = ()=> {
    // Close Up
    if (slideDown == true &&  queryDone == true){ 
      // alert('Close Up');
      setSlideDown(false);
      setQueryDone(false);
      setResult([]);
    }
    // Search
    if (slideDown == false){
      // alert("Search");
      // SlideDown UI
      setSlideDown(true);
      // HTTP Request for Searching Friend!


      searchFriend();
      // setTimeout(function(){
      //   setQueryDone(true);
      //   setResult([{_id:1, name:'Mr. Admin'}]);
      //   // setResult([]);
      // },2000)
    }
  }

  return (
    <div>
      <div className="chat-search wrapper">
          <div className="left">
            <input type="text" placeholder="Search a new friend..." className="input-search"
              onChange={(e)=>{setTyping(e.target.value);}} onKeyPress  = {event => event.key === 'Enter' ? slide() : null}/>
          </div>
          <div className="right">
            <button className="friend-search-btn" onClick={slide}><i className="fa fa-plus"></i></button>
          </div>
      </div>
      <SearchResult 
        sendFriendRequest = {sendFriendRequest}
        slideDown     ={slideDown} 
        setSlideDown  ={setSlideDown}
        setResult     ={setResult}
        result        ={result}
        slide         ={slide}
        queryDone     ={queryDone}
      />
    </div>
  );
}

export default Search;
