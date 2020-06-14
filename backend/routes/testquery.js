const express = require('express')
const router = express.Router()
const db = require('../db/database')

function getAllGroupIDs(query) {
    db.query(query, function(err, result) {
        if(err) {
            console.log(err)
        }
        for(let i in result) {
            console.log(result[i].cid)
        }
    })
};

router.post('/', (req, res) => {
    getAllGroupIDs(`SELECT cid FROM UserChat WHERE uid = 1`)
    res.status(200).send()
})

module.exports = router