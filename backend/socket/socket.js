const express = require('express')
const router = express.Router()
const db = require('../db/database')

function getGroupID(userI, callbackD) {
  query = `SELECT cid FROM UserChat WHERE uid = ${userID}`
  let data = []
  db.query(query, function (err, result) {
      if(err) {
          //console.log('400')
          //res.status(400).send(err)
          //console.log(err)
      }
      //console.log(result)
      for(let i in result) {
        data.push(result[i])
      }
      callback(res, data)
  })
  return data
}


exports = module.exports = function(io) {
  let users = []; //Online Users
  io.on('connect', function(socket) {
  // data._id is userID
    socket.join('online')
    socket.on('init', function(data, callback) {  
    //console.log("A user connected :" + socket.id);
      if(data != null) {
        let exist = false;
        // Update user socketID if they already loggedIn
        users = users.map(function(user, i) {
          if(user._id == data._id) {
            exist = true;
            user.socketID = socket.id;
          }
          return user;
        })
        // Push user into array if they have not!
        if(!exist) {
          data[socketID] = socket.id;
          users.push(data);
        }
        let groups = getGroupID(data._id);
        // for(let groupID in groups) {
        //   socket.join(groupID)
        // }
        //socket.join('online')
      }
      console.log("Logged In User: ",data.name, "--- Current User:" ,users );
    });
    //console.log('Logged in users: ', users)
    // Send Message
    socket.on('sendMessage', function(data, callback) {
      console.log(data)
      //io.sockets.in('online').emit(`message`, data)
      io.to('online').emit('message', data)
      //socket.broadcast.to('online').emit('message', data)
      callback()
    })
    //socket.emit('roomData', function(data, callback) {})
    // Disconnect a user
    socket.on('disconnect', function(data) {
      users = users.filter(function(user, i) {
        return (user.socketID != socket.id)
      })
      let groups = getGroupID(data._id);
      // for(let groupID in groups) {
      //   socket.leave(groupID)
      // }
      socket.leave('online')
      //console.log("bottom",users);
    });
  });
}