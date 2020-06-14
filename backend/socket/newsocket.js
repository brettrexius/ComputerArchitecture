const db = require('../db/database')

function query(query, callback) {
    db.query(query, function(err, result) {
        if(err) {
            console.log(err)
        }
        //console.log(result)
        callback(result)
    })
}

let onlineUsers = []

exports = module.exports = function(io) {
    io.on('connect', function(socket) {
        // user log in, update online user list
        socket.on('signin', function(data, callback) {
            //console.log(data)
            // when user connects, update online users
            socket.data = data
            // console.log('socket data: ', socket.data)
            // console.log(socket.id)
            onlineUsers[socket.id] = {
                userID: data._id,
                username: data.name,
                email: data.email,
                socket: socket
            }
            callback()
            console.log('user logged in')
        })
        // see a list of friends, tagged by online and offline
        socket.on('initFriends', (data, callback) => {
            // console.log(data)
            //  [{_id: 0, firstname: "Trung", lastname:"Nguyen", online: true},
            //   {_id: 1, firstname: "Jimmy", lastname:"John", online: false},
            //   {_id: 2, firstname: "Kyle",  lastname:"Le", online: true}]
            // get all friends of user
            query(`SELECT uid2 AS _id, firstname, lastname FROM Friendship INNER JOIN Users ON Friendship.uid2 = Users.id 
            WHERE uid1 = ${data.userID}
            UNION
            SELECT uid1 AS _id, firstname, lastname FROM Friendship INNER JOIN Users ON Friendship.uid1 = Users.id
            WHERE uid2 = ${data.userID}`, (result) => {
                // console.log(result)
                // scan online friends and update online status
                for(let i in result) {
                    // set all friends offline initially
                    result[i].online = false
                    for(let socketID in onlineUsers) {
                        // if friend is online
                        if(result[i]._id == onlineUsers[socketID].userID) {
                            result[i].online = true
                            // notify friends that user is online
                            // console.log('asdf', data.userID)
                            // console.log(onlineUsers[socketID].socket.data._id)
                            onlineUsers[socketID].socket.emit('userOnlineNotification', {_id: data.userID})
                        }
                    }
                }
                // console.log(result)
                callback(result)
            })
        })
        //console.log(Object.keys(onlineUsers).length);
        // join a group chat or DM
        socket.on('join', (data) => {
            //console.log(data)
            if(data.groupID != -1) {
                socket.join(`room_${data.groupID}`)
                //console.log(onlineUsers)
                onlineUsers[socket.id]['groupID'] = data.groupID
                //console.log(onlineUsers);
                //console.log(socket.id)
                //console.log(`switch to room_${onlineUsers[socket.id].groupID}`)
            }
        })
        // send message to all users in chat
        socket.on('sendMessage', (data) => {
            // console.log(data)
            // console.log(`room_${data.groupID}`)
            // console.log(socket.rooms)
            // console.log(`room_${data.groupID}`)
            // console.log(data.text)
            io.to(`room_${onlineUsers[socket.id].groupID}`).emit('message', {groupID: onlineUsers[socket.id].groupID, msg:{text: data.text, user: data.user}});
            query(`INSERT INTO Messages(uid, cid, message) VALUES(${data._id}, ${onlineUsers[socket.id].groupID}, '${data.text}')`, (result)=>{})
            // notify users who are in the group except current user who sends a message that there is a new message
            query(`SELECT uid FROM UserChat WHERE cid = ${onlineUsers[socket.id].groupID} and uid != ${onlineUsers[socket.id].userID}`, (result) => {
                //console.log(result)
                // all users in this group
                for(let i in result) {
                    // all users that are online
                    for(let socketID in onlineUsers) {
                        // if user is online and in the group
                        if(result[i].uid == onlineUsers[socketID].userID) {
                            // console.log('notifying')
                            onlineUsers[socketID].socket.emit('notify', {groupID: onlineUsers[socket.id].groupID, recentMessage: data.text})
                            //groups: data.groups
                        }
                    }
                }
            })
        })
        // user removes a group
        socket.on('leaveGroupChat', (data) => {
            //console.log(data)
            // update db
            query(`DELETE FROM UserChat WHERE cid = ${data.groupID} and uid = ${data.userID}`, () => {})
            // notify all other users in the group that current user left
            query(`SELECT uid FROM UserChat WHERE cid = ${data.groupID}`, (result) => {
                //console.log(result)
                // all users in this group
                for(let i in result) {
                    // all users that are online
                    for(let socketID in onlineUsers) {
                        // if user is online and in the group and not the user that leaves
                        if(result[i].uid != data.userID && result[i].uid == onlineUsers[socketID].userID) {
                            query(`SELECT CONCAT(firstname, ' ', lastname) AS name FROM Users WHERE id = ${data.userID}`, (result) => {
                                //console.log(data.groupID)
                                //console.log(onlineUsers[socket.id].groupID)
                                onlineUsers[socketID].socket.emit('notifyGroupLeave', {name: result[0].name, groupID: data.groupID})
                                //groups: data.groups
                            })
                        }
                    }
                }
            })
            // change of ownership if it's owner
            query(`SELECT id, owner FROM Chats WHERE id = ${data.groupID}`, (result) => {
                //console.log(result)
                //[ RowDataPacket { id: 2, owner: 1 } ]
                //console.log('ownerID: ', result[0].owner)
                //console.log('userID: ', data.userID)
                if(result[0].owner = data.userID) {
                    query(`SELECT uid FROM UserChat WHERE cid = ${data.groupID}`, (result) => {
                        //console.log(result)
                        // [ RowDataPacket { uid: 1 },
                        //     RowDataPacket { uid: 2 },
                        //     RowDataPacket { uid: 4 },
                        //     RowDataPacket { uid: 5 },
                        //     RowDataPacket { uid: 7 } ]
                        query(`UPDATE Chats SET owner = ${result[0].uid} WHERE id = ${data.groupID}`, () => {})
                    })
                }
                //console.log('success')
            })

        })
        // create group chat
        socket.on('createGroupChat', (data, callback) => {
            //console.log(data)
            // { _id: 2, members: [ 2, 1, 5 ], groupName: 'Mr. Root, Mr. Admin, Bruce Wayne' }
            // create chat in DB
            query(`INSERT INTO Chats(owner, is_DM) VALUES(${data._id}, 0)`, () => {})
            // get the new chat id from DB
            query(`SELECT LAST_INSERT_ID() AS groupID`, (result) => {
                callback(result[0].groupID)
                for(let id in data.members) {
                    //console.log(data.members[id])
                    query(`INSERT INTO UserChat(uid, cid) VALUES(${data.members[id]}, ${result[0].groupID})`, () => {})
                    // notify all users in that group except the creator that new group is created
                    for(let socketID in onlineUsers) {
                        // if user is online and in the group and not the owner
                        if(data._id != data.members[id] && data.members[id] == onlineUsers[socketID].userID) {
                            onlineUsers[socketID].socket.emit('notifyGroupCreate', {groupID: result[0].groupID, groupMembers: data.groupName, isActive: false})
                        }
                    }
                }
            })
        })
        // send friend request
        socket.on('sendFriendRequest', (data) => {
            // console.log('test')
            // update friend request in DB and notify
            query(`INSERT INTO FriendRequests(uid1, uid2) VALUES(${data.from}, ${data.to})`, () => {})
            // notify online
            for(let socketID in onlineUsers) {
                // if friend request receiver is online, notify
                //console.log(onlineUsers[socketID].userID, data.to)
                if(onlineUsers[socketID].userID == data.to) {
                    // {from:"David Brown", _id:1}
                    query(`SELECT CONCAT(firstname, " ", lastname) AS name FROM Users WHERE Users.id = ${data.from}`, (result) => {
                        // console.log(result, socketID)
                        // console.log(onlineUsers.length)
                        onlineUsers[socketID].socket.emit('notifyFriendRequest', {fromName: result[0].name, from: data.from, to: data.to})
                    })
                    break
                }
            }
        })
        // accept friend request
        // upon accepting, delete the friend request, update friendship, 
        // notify friend request sender, make a DM
        socket.on('acceptFriendRequest', (data, callback) => {
            // console.log(data)
            // delete friend request
            query(`DELETE FROM FriendRequests WHERE uid1 = ${data.from} and uid2 = ${data.to}`, () => {})
            // create friendship
            query(`INSERT INTO Friendship(uid1, uid2) VALUES(${data.from}, ${data.to})`, () => {})
            // make a DM
            query(`INSERT INTO Chats(owner, is_DM) VALUES(${data.from}, 1)`, () => {})
            // update chat members
            // get the group(DM) id that just got created
            query(`SELECT LAST_INSERT_ID() AS groupID`, (result) => {
                // result[0].groupID = 2;
                // add the members of new DM
                query(`INSERT INTO UserChat(uid, cid) VALUES(${data.from}, ${result[0].groupID})`, () => {})
                query(`INSERT INTO UserChat(uid, cid) VALUES(${data.to}, ${result[0].groupID})`, () => {})
                // send back this to frontend
                // group: { groupID: 0, groupMembers: "Jimmy Nguyen, Trung Nguyen", isGroup : 0, isActive: false }
                // friend: {_id: 0, firstname: "Trung", lastname:"Nguyen"}
            
                // get members of new DM
                let names = ''
                query(`SELECT CONCAT(firstname, " ", lastname) AS name FROM UserChat INNER JOIN Users ON UserChat.uid = Users.id WHERE cid = ${result[0].groupID}`, (val) => {
                    // console.log(val)
                    // [ RowDataPacket { name: 'Mr. Admin' },
                    // RowDataPacket { name: 'Mr. Root' },
                    // RowDataPacket { name: 'John Doe' },
                    // RowDataPacket { name: 'Bruce Wayne' },
                    // RowDataPacket { name: 'Mr. Superman' } ]
                    for(let i in val) {
                        names += val[i].name + ", "
                    }
                    // all members
                    names = names.substring(0, names.length - 2)
                    // console.log(names)
                    // get sender information
                    query(`SELECT firstname, lastname FROM Users WHERE id = ${data.from}`, (value) => {
                        // console.log(value)
                        // [ RowDataPacket { firstname: 'Mr.', lastname: 'Root' } ]
                        // check if sender is online, update online status
                        let isSenderOnline = false
                        for(let socketID in onlineUsers) {
                            // if sender is online
                            if(onlineUsers[socketID].userID == data.from) {
                                isSenderOnline = true
                                break;
                            }
                        }
                        let dataToFrontEnd = {
                            // new DM
                            group: {
                                groupID: result[0].groupID,
                                groupMembers: names,
                                isGroup: 0,
                                isActive: false
                            },
                            // Sender
                            friend: {
                                _id: data.from,
                                firstname: value[0].firstname,
                                lastname: value[0].lastname,
                                online: isSenderOnline
                            }
                        }
                        // console.log(dataToFrontEnd)
                        callback(dataToFrontEnd)
                        // notify friend request sender
                        // scan online users
                        for(let socketID in onlineUsers) {
                            // if friend request sender is online, notify
                            // console.log(onlineUsers[socketID].userID, data.from)
                            if(onlineUsers[socketID].userID == data.from) {
                                // {from:"David Brown", _id:1}
                                dataToFrontEnd.friend._id = data.to
                                query(`SELECT firstname, lastname FROM Users WHERE id = ${data.to}`, (result) => {
                                    dataToFrontEnd.friend.firstname = result[0].firstname
                                    dataToFrontEnd.friend.lastname = result[0].lastname
                                    dataToFrontEnd.friend.online = true
                                    onlineUsers[socketID].socket.emit('acceptFriendRequestNotification', dataToFrontEnd)
                                    // console.log(dataToFrontEnd)
                                })
                                break
                            }
                        }
                    })
                })
            })
        })
        // deny friend request
        // upon denying, delete the friend request
        socket.on('denyFriendRequest', (data) => {
            // console.log(data)
            // delete friend request
            query(`DELETE FROM FriendRequests WHERE uid1 = ${data.from} and uid2 = ${data.to}`, () => {})
        })
        // sign out
        socket.on('signout', (data) => {
            // console.log(data)
            query(`SELECT uid2 AS _id, firstname, lastname FROM Friendship INNER JOIN Users ON Friendship.uid2 = Users.id 
            WHERE uid1 = ${data.userID}
            UNION
            SELECT uid1 AS _id, firstname, lastname FROM Friendship INNER JOIN Users ON Friendship.uid1 = Users.id
            WHERE uid2 = ${data.userID}`, (result) => {
                // console.log(result)
                // scan online friends and notify
                // scan friend list
                for(let i in result) {
                    // scan online user list
                    for(let socketID in onlineUsers) {
                        // see if a user is both a friend and online
                        if(result[i]._id == onlineUsers[socketID].userID) {
                            // friend is online
                            // notify friend that user is now offline
                            // console.log('', result[i]._id)
                            // io.to(`${result[i]._id}`).emit('userOfflineNotification', {_id: data.userID});
                            io.to(`${socketID}`).emit('userOfflineNotification', {_id: data.userID});
                        }
                    }
                }
            })
            if(onlineUsers[socket.id]) {
                delete onlineUsers[socket.id]
            }
            console.log('user signed out')
        })
        // disconnect
        socket.on('disconnect', () => {
            // // console.log(socket.data._id)
            // // notify online friends of user that user just logged out
            // // get all friends of user
            // console.log(socket.data)
            // console.log(socket.id)

            // query(`SELECT uid2 AS _id, firstname, lastname FROM Friendship INNER JOIN Users ON Friendship.uid2 = Users.id 
            // WHERE uid1 = ${socket.data._id}
            // UNION
            // SELECT uid1 AS _id, firstname, lastname FROM Friendship INNER JOIN Users ON Friendship.uid1 = Users.id
            // WHERE uid2 = ${socket.data._id}`, (result) => {
            //     // console.log(result)
            //     // scan online friends and notify
            //     // scan friend list
            //     for(let i in result) {
            //         // scan online user list
            //         for(let socketID in onlineUsers) {
            //             // see if a user is both a friend and online
            //             if(result[i]._id == onlineUsers[socketID].userID) {
            //                 // friend is online
            //                 // notify friend that user is now offline
            //                 console.log('', result[i]._id)
            //                 io.to(`${result[i]._id}`).emit('userOfflineNotification', {_id: socket.data._id});
            //             }
            //         }
            //     }
            // })
            if(onlineUsers[socket.id]) {
                delete onlineUsers[socket.id]
            }
            console.log('user disconnected')
        })
    })
}