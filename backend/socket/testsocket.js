const express = require('express')
const router = express.Router()
const db = require('../db/database')

function getGroupID(userID) {
  query = `SELECT cid FROM UserChat WHERE uid = ${userID}`
  let data = []
  db.query(query, function (err, result) {
      if(err) {
          //console.log('400')
          res.status(400).send(err)
      }
      //console.log(result)
      for(let i in result) {
        data.push(result[i])
      }
  })
  return data
}

let users = [];

exports = module.exports = function(io) {
  io.on('connect', function(socket) {
  // data._id is userID
    // socket.on('init', function(data, callback) {  
    // //console.log("A user connected :" + socket.id);
    //   if(data != null) {
    //     let exist = false;
    //     // Update user socketID if they already loggedIn
    //     users = users.map(function(user, i) {
    //       if(user._id == data._id) {
    //         exist = true;
    //         user.socketID = socket.id;
    //       }
    //       return user;
    //     })
    //     // Push user into array if they have not!
    //     if(!exist) {
    //       data['socketID'] = socket.id;
    //       users.push(data);
    //     }
    //     let groups = getGroupID(data._id);
    //     // for(let groupID in groups) {
    //     //   socket.join(groupID)
    //     // }
    //     //socket.join('online')
    //   }
    //   //console.log("Logged In User: ",data.name, "--- Current User:" ,users );
    // });
    console.log('Logged in users: ', users)
    // sendMessage
    socket.on('sendMessage'), function(data, callback) {
        console.log(data)
        console.log(data.user, data.text)
        //io.sockets.in('online').emit(`message`, data.user, data.text)
        callback()
    }
    // Disconnect a user
    socket.on('disconnect', function(data) {
      users = users.filter(function(user, i) {
        return (user.socketID != socket.id)
      })
      let groups = getGroupID(data._id);
    //   for(let groupID in groups) {
    //     socket.leave(groupID)
    //   }
    socket.leave('online')
      //console.log("bottom",users);
    });
  });
}