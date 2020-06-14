import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
// import $ from 'jquery';
// import Popper from 'popper.js'; 
import 'font-awesome/css/font-awesome.min.css';


import {BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import Main       from './main/main';
import Signup     from './signup/signup';
import Nav        from './nav/nav';
import DashBoard  from './dashboard/dashboard';
import Test       from './test/image-picker';
import NotFound   from './NotFound/NotFound'
import SignOut    from './SignOut/SignOut.jsx'
import ProtectedRoute from './ProtectedRoute/ProtectedRoute';
import { apiUrl } from "./config.json";
import io         from "socket.io-client";

let socket = io(apiUrl);  // Init

ReactDOM.render(  
  <BrowserRouter>
    <Nav/>
    <Switch>
      <Route path = "/" exact   component={Main}/>
      <Route path="/signup"     component={Signup} />
      <Route path="/login"      component={Main} />
      <Route path="/test"       component={Test} />
      <ProtectedRoute path="/dashboard"   render={() => <DashBoard socket={socket} />}/>
      <Route path="/logout"               render={() => <SignOut socket={socket} />} />
      <Route path="/not-found"  component={NotFound} />
      <Redirect to="/not-found"/>
    </Switch>
  </BrowserRouter>, 
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
