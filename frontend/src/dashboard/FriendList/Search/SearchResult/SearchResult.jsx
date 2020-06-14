import React, { useState, useEffect } from "react";
import "./SearchResult.scss"
import Loader from 'react-loader-spinner'

import {SlideDown} from 'react-slidedown'
import 'react-slidedown/lib/slidedown.css'

const LOADING  = {
  type: "Bars",
  color: "#2172FF",
  height:  30,
  width: 60
}
const SearchResult = ({sendFriendRequest, queryDone, slide,slideDown, setSlideDown, result, setResult}) => {
  const friendRequest = ()=>{
    setSlideDown(false); // Trigger Drop"Up" UI FAKE
    sendFriendRequest(result[0]._id);
  }
  // Not Found  : []
  // Found      : [{_id:1, name:'Mr. Admin']

  return (
    <div className="search-result">
      <SlideDown className={'my-dropdown-slidedown'}>
        {slideDown ?
          <div className="result-item">
            {!queryDone? <Loader className="text-center" type={LOADING.type} color={LOADING.color} height={LOADING.height} width={LOADING.width} />:
              (result.length == 0 ? <p>No Result Found!</p>:
                <p>{result[0].name}</p>)
            }
            <div className="result-options">
              <span className={result.length == 0 ? "invisible": ""} onClick={friendRequest}>
                <i className="fa fa-check"></i></span>
              <span onClick={slide}><i className="fa fa-times"></i></span>
            </div>
          </div>
        : null}
      </SlideDown>
    </div>
  );
}

export default SearchResult;
