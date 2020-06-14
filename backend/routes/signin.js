const express = require('express')
const router = express.Router()
const db = require('../db/database')
const jwt = require('jsonwebtoken')

// login page business logic
router.post('/', async (req, res) => {
    // get the row that has the exact same user input username and password
    // if empty user does not exist
    query = `SELECT * FROM Users WHERE username = "${req.body.username}" AND password = "${req.body.password}"`
    db.query(query, function (err, result) {
        if(err) {
            res.status(400).send(err)
        }
        else if(result.length==0) {
            res.status(400).send('User or password is invalid.')
        }
        else {
            let token = jwt.sign(
                {
                    _id: result[0].id,
                    name: result[0].username,
                    firstname: result[0].firstname,
                    lastname: result[0].lastname,
                    email: result[0].email
                },
                "myPrivateKey",
                {expiresIn: '1h'}
            )
            res.status(200).send(token)
        }
    })
})

module.exports = router