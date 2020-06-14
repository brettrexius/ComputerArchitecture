import React, {Component} from 'react';
import "./input.scss";
const Input = ({onChange, icon, name, value, placeholder, type, error}) => { 
  let isError = function(){
    if(error == '')             return "is-valid";
    else if(error == undefined) return "";
    else                        return "is-invalid";
  }
  return (
    <div className="row">
      <div className="col-sm-2"></div>
      <div className="col-sm-8">
        <div className="form-group input-group">

        <div className="input-group-prepend">
          <span className="input-group-text"> <i className={"fa " + icon}></i> </span>
        </div>
        <input 
          onChange = {onChange}
          value = {value}
          name = {name}
          className={"form-control " + isError()} placeholder={placeholder} type={type}/>   
        </div>   
      </div>
      <div className="col-sm-2">
          <p className="text-danger">{error}</p>
      </div>
    </div>

  )
}
export default Input;