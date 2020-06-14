import React, {Component} from 'react'; 
import SignupParent from './components/signup'
import Joi from '@hapi/joi';
import { apiUrl } from "../config.json";
import http from '../services/httpService'

import "./signup.scss"
import Dummy from './dummy.png';
import Input from './components/input';

class Signup extends SignupParent {
  state = {
    account: {
      firstname:'', 
      lastname: '',
      email:    '', 
      username: '',
      password: '', 
      repassword:''
    },
    errors: {},
    alert: {
      variant: "",
      message: "",
      show: false
    }
  }

  
  schema = {
    firstname:  Joi.string()
      .required()
      .max(255)
      .label("First Name"),
    lastname:   Joi.string()
      .required()
      .max(255)
      .label("Last Name"),
    email:      Joi.string()
      .required()
      .min(10)
      .max(255)
      .label("Email")
      .email({ minDomainSegments: 1, tlds: { allow: ['com', 'net'] } }), 
    username:   Joi.string()
      .required()
      .min(6)
      .max(255)
      .label("Username"),
    password:   Joi.string()
      .required()
      .min(6)
      .max(255)
      .label("Password"), 
    repassword: Joi.string()
      .when("password",{
        is: Joi.string().min(6),
        then: Joi.string().valid(Joi.ref('password')).error(function(error){
          error[0].message = "Passwords do not match!";
          return error;
        }),
        otherwise: Joi.string().min(6)
      })
      .required()
  }
  
  
  handleSubmit  = e =>{
    e.preventDefault();
    if(this.validateInputs()){
      http.post(apiUrl+"/signup", this.state.account) 
      .then((msg) => {
        if( msg.data[0] == 1){
          //Success:
          let errors  = {};
          let account = {...this.inputTemplate};
          this.setState({errors,account, alert:{
            variant: "success",
            show: true,
            message: "Congratulation! Your account has been successfully created"
          }});
          setTimeout(() => {
            alert.show = false;
            this.setState({alert});
          }, 4000);
        }
      })
      .catch((msg) => {
        if(msg.response.data[0] == 0){
          // if msg == username exists
          let errors = {...this.errorTemplate}
          errors.username = "Username is already taken!"
          this.setState({errors});
        }     
        else {
          // if msg == connection
          let alert   = {
            variant: "danger",
            show: true,
            message: "Something Went Wrong. Please Try Again!"
          }
          this.setState({alert});
          setTimeout(() => {
            alert.show = false;
            this.setState({alert});
          }, 4000);
        }
      });
    }
  }

  render(){
    return (
      <div className="signup">
        <div className="container">
          <div className="row">
            <div className="card bg-light">
              <article className="card-body mx-auto" style={{maxWidth: "400px"}}>
                <h4 className="card-title mt-3 text-center">Create Account</h4>
                <p className="text-center">Get started with your free account</p>
                <div className="profile-image">
                  <img src={Dummy} alt="foo" />
                </div>
                <hr/>
              </article>
              <form className="signup-form" onSubmit={this.handleSubmit}>
                {/* FIRST-NAME */}
                <Input 
                  onChange= {this.handleChange} 
                  icon    = {"fa-user-circle"}   
                  name    = {"firstname"}
                  value   = {this.state.account.firstname}
                  placeholder = {"First Name"} 
                  type    = {"text"}
                  error   = {this.state.errors.firstname}/>
                {/* LAST-NAME */}
                <Input 
                  onChange= {this.handleChange} 
                  icon    = {"fa-user-circle-o"}   
                  name    = {"lastname"}
                  value   = {this.state.account.lastname}
                  placeholder = {"Last Name"} 
                  type    = {"text"}
                  error   = {this.state.errors.lastname}/>
                {/* USER-NAME */}
                <Input 
                  onChange= {this.handleChange} 
                  icon    = {"fa-user"}   
                  name    = {"username"}
                  value   = {this.state.account.username}
                  placeholder = {"Username"} 
                  type    = {"text"}
                  error   = {this.state.errors.username}/>
                {/* PASSWORD */}
                <Input 
                  onChange= {this.handleChange} 
                  icon    = {"fa-lock"}   
                  name    = {"password"}
                  value   = {this.state.account.password}
                  placeholder = {"Create password"} 
                  type    = {"password"}
                  error   = {this.state.errors.password}/>   
                {/* REPASSWORD */}
                <Input 
                  onChange= {this.handleChange} 
                  icon    = {"fa-lock"}   
                  name    = {"repassword"}
                  value   = {this.state.account.repassword}
                  placeholder = {"Repeat password"} 
                  type    = {"password"}
                  error   = {this.state.errors.repassword}/>  
                {/* EMAIL */}
                <Input 
                  onChange= {this.handleChange} 
                  icon    = {"fa-envelope"}   
                  name    = {"email"}
                  value   = {this.state.account.email}
                  placeholder = {"Email"} 
                  type    = {"email"}
                  error   = {this.state.errors.email}/>
                {/* SUBMIT */}
                <div className={"signup-alert alert alert-" + this.state.alert.variant + " " +(this.state.alert.show ? "alert-shown" : "alert-hidden")}>{this.state.alert.message}</div>
                <div className="form-group">
                  <button type="submit" className="btn btn-primary btn-block"> Create Account  </button>
                </div>   
                <p className="text-center">Have an account? <a href="../">Log In</a> </p> 
              </form>
            </div>
          </div>
        </div>
        {/* Modal */}
      </div>
    )
  }
} 

export default Signup;