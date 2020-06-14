const express = require('express')
const router = express.Router()
const db = require('../db/database')

router.post('/', (req, res) => {
    // console.log(req.body)
    if(req.body.email) {
        query = `INSERT INTO Users(username, password, firstname, lastname, email) VALUES(
            "${req.body.username}", "${req.body.password}", "${req.body.firstname}", "${req.body.lastname}", "${req.body.email}")`
    }
    else {
        query = `INSERT INTO Users(username, password, firstname, lastname) VALUES(
            "${req.body.username}", "${req.body.password}", "${req.body.firstname}", "${req.body.lastname}")`
    }
    db.query(query, function(err, result) {
        if(err) {
            // console.log(err)
            res.status(400).send([0])
        }
        else {
            // res.send('Success.')
            res.send([1])
        }
    })
})

module.exports = router