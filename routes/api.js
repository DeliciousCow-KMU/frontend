var express = require('express');
var router = express.Router();

var passport = require('passport');
var auth = require('../auth/auth-passport');

var mysql_dbc = require('../db/db_con')();
var pool = mysql_dbc.init_pool();

/* GET users listing. */
router.post('/keyword/add', auth.isAuthenticated, function (req, res, next) {
    pool.getConnection(function(err, connection) {
        if (err)
            throw err;
        else {
            connection.query('INSERT INTO Keywords (userid, keyword) VALUES (?, ?)', [req.user.id, req.body.keyword], function (err, results) {
                if (err) {
                    console.log('err :' + err);
                    res.setHeader('Content-Type', 'application/json');
                    res.status(500).send(JSON.stringify({status: 'error'}));
                } else {
                    console.log(JSON.stringify(results));
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify({status: 'success', data: results}));
                }
                connection.release();
            });
        }
    });
});

/* GET users listing. */
router.delete('/keyword/delete', auth.isAuthenticated, function (req, res, next) {
    pool.getConnection(function(err, connection) {
        if (err)
            throw err;
        else {
            console.log(req.body.id, req.user.id);
            connection.query('DELETE FROM Keywords WHERE id = ? and userid = ?', [req.body.id, req.user.id], function (err, results) {
                if (err) {
                    console.log('err :' + err);
                    res.setHeader('Content-Type', 'application/json');
                    res.status(500).send(JSON.stringify({status: 'error'}));
                } else {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify({status: 'success', data: results}));
                }
                connection.release();
            });
        }
    });
});

module.exports = router;
