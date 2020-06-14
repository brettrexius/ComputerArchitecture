const express = require('express')
const router = express.Router()
const db = require('../db/database')

// get all groups, group members of that group, most recent message of that group of user
router.post('/initgroups', (req, res) => {
    // console.log(req.body)
    let id = req.body._id;
    //let id = 2
    let query1 = new Promise(function(resolve, reject) {
        // First Query: get all groupID's of user
        query = `SELECT cid, name, owner, is_DM FROM Userchat INNER JOIN Chats ON Userchat.cid = Chats.id WHERE uid = ${id}`
        db.query(query, function (err, result) {
            if(err) {
                //console.log('400')
                res.status(400).send(err)
            }
            // console.log(result)
            resolve(result);
        })
    })
    .then(
        function(previousValue) {
            // console.log('1', previousValue)
            return new Promise(function(resolve, reject) {
            // Second Query: get all users in each group
                // if user is in any group, send back the groupID, groupMembers, isDM, isActive
                // if NOT, send back []
                //onsole.log('a')
                //console.log(previousValue)
                let val = {}
                let data = []
                //console.log(previousValue.length)
                if(previousValue.length != 0) {
                    for(let i in previousValue) {
                        //console.log(previousValue[i].cid)
                        query = `SELECT uid, username, firstname, lastname FROM UserChat INNER JOIN Users ON UserChat.uid = Users.id WHERE cid = ${previousValue[i].cid}`
                        db.query(query, function (err, result) {
                            if(err) {
                                //console.log('400')
                                res.status(400).send(err)
                            }
                            // groupID : firstname + lastname
                            let names = '';
                            //console.log(result)
                            for(let j in result) {
                                names += result[j].firstname + " " + result[j].lastname + ", "
                            }
                            names = names.substring(0, names.length - 2);
                            data.push( {groupID: previousValue[i].cid, groupMembers: names, isGroup: !previousValue[i].is_DM, isActive : false} )
                            if(previousValue.length == data.length) {
                                //res.send(data)
                                val['groups'] = data
                                //console.log(val)
                                resolve(val)
                            }
                        })
                    }
                }
                else {
                    //res.send(previousValue)
                    val['groups'] = data
                    resolve(val)
                }
            })
    })
    .then(
        function(val) {
            // console.log('2', val)
            return new Promise(function(resolve, reject) {
                // Third query : get recent message of all groups
                //console.log(val)
                if(val.groups.length != 0) {
                    //console.log(val['groups'])
                    //console.log('----------------')
                    for(let i in val['groups']) {
                        //console.log(val['groups'][i])
                        query = `SELECT message FROM Messages WHERE cid = ${val['groups'][i].groupID} ORDER BY timestamp DESC LIMIT 1`
                        db.query(query, function (err, result) {
                            if(err) {
                                //console.log('400')
                                res.status(400).send(err)
                            }
                            //console.log(result)
                            //console.log(result[0].message)
                            //console.log(result[0])
                            if(typeof result[0] != 'undefined') {
                                val['groups'][i]['recentMessage'] = result[0].message
                            }
                            //console.log(val)
                            if(i == val['groups'].length - 1) {
                                // console.log('A', val)
                                res.send(val)
                            }
                        })
                    }
                }
                else {
                    // console.log('B', val)
                    res.send(val)
                }
            })
        }
    )
})

// get all friends of a user
router.post('/initfriends', (req, res) => {
    //let id = 2
    // console.log('initfriends', req.body)
    let id = req.body._id
    //console.log(data)
    // get all friends of user
    query = `SELECT uid2 AS id, firstname, lastname FROM Friendship INNER JOIN Users ON Friendship.uid2 = Users.id WHERE uid1 = ${id} UNION SELECT uid1 AS id, firstname, lastname FROM Friendship INNER JOIN Users ON Friendship.uid1 = Users.id WHERE uid2 = ${id}`
    db.query(query, function (err, result) {
        if(err) {
            //console.log('400')
            res.status(400).send(err)
        }
        // loop through all friends
        let friends = []
        if(result.length != 0) {
            for(let j in result) {
                //console.log(result[j].uid2, result[j].firstname, result[j].lastname)
                friends.push({
                    _id: result[j].id, 
                    firstname: result[j].firstname, 
                    lastname: result[j].lastname
                })
            }
        }
        // console.log(friends)
        res.send(friends)
    })
})

// get all incoming friend requests(notifications) of a user
router.post('/initfriendrequests', (req, res) => {
    //let id = 2;
    // console.log(req.body)
    let id = req.body._id
    // get all incoming friend requests (notifications)
    let requests = []
    query = `SELECT uid1, uid2, username, firstname, lastname FROM FriendRequests INNER JOIN Users ON FriendRequests.uid1 = Users.id WHERE FriendRequests.uid2 = ${id}`
    db.query(query, function (err, result) {
        if(err) {
            //console.log('400')
            res.status(400).send(err)
        }
        let requests = []
        if(result.length != 0) {
            for(let j in result) {
                //console.log(result[j].uid2, result[j].firstname, result[j].lastname)
                requests.push({fromName: result[j].firstname + " " + result[j].lastname, from: result[j].uid1, to: result[j].uid2})
            }
        }
        // console.log(requests)
        res.send(requests)
    })
})

// get all group messages of a group
router.post('/getgroupmessages', (req, res) => {
    let id = req.body.groupID
    //let id = 
    let data = []
    query = `SELECT username, message FROM Messages INNER JOIN Users ON Messages.uid = Users.id WHERE cid = ${id} ORDER BY timestamp ASC`
    db.query(query, function (err, result) {
        if(err) {
            //console.log('400')
            res.status(400).send(err)
        }
        //console.log(result)
        if(result.length != 0) {
            for(let j in result) {
                //console.log(result[j].uid2, result[j].firstname, result[j].lastname)
                data.push({
                    text: result[j].message, 
                    user: result[j].username
                })
            }
        }
        //console.log(data)
        res.send(data)
    })
})

// search friend
router.post('/searchfriend', (req, res) => {
    let username = req.body.username
    // Not Found  : []
    // Found      : [{_id:1, name:'Mr. Admin']
    query = `SELECT id, CONCAT(firstname, " ", lastname) AS name FROM Users WHERE Users.username = "${username}"`
    db.query(query, function (err, result) {
        if(err) {
            //console.log('400')
            res.status(400).send(err)
        }
        //console.log(result)
        if(result.length != 0) {
            res.send([{_id: result[0].id, name: result[0].name}])
        }
        else {
            res.send([])
        }
    })
})

module.exports = router