var express = require('express');
var router = express.Router();

var passport = require('passport');
var auth = require('../auth/auth-passport');

var mysql_dbc = require('../db/db_con')();
var pool = mysql_dbc.init_pool();

var axios = require('axios');
axios.defaults.headers.post['Content-Type'] = 'application/json';

/* GET users listing. */
router.post('/login', function (req, res, next) {
    console.log(req.body.generation, req.body.password);
    res.setHeader('Content-Type', 'application/json');
    pool.getConnection(function(err, connection) {
        if (err)
            throw err;
        else {
            axios.post('https://1zi1pnd5vb.execute-api.ap-northeast-2.amazonaws.com/dev/auth', {
                user_id: req.body.generation,
                passwd: req.body.password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                connection.query('select * from `Users` where `id` = ?', req.body.generation, function (err, result) {
                    if (err) {
                        console.log('err :' + err);
                    } else {
                        if (result.length === 0) {
                            //회원가입 처리
                            connection.query('INSERT INTO Users (id, username, college, department) VALUES (?, ?, ?, ?)', [response.data.data.user_id, response.data.data.name, response.data.data.college, response.data.data.department], function (err, results) {
                                if (err) {
                                    console.log('insert');
                                    console.log('err :' + err);
                                    res.status(500).send(JSON.stringify({status: 'error'}));
                                } else {
                                    res.send(JSON.stringify({status: 'success', data: response.data.data}));
                                }
                                connection.release();
                            });
                        } else {
                            //회원정보 업데이트
                            connection.query('UPDATE Users SET username=?, college=?, department=? where id=?', [response.data.data.name, response.data.data.college, response.data.data.department, response.data.data.user_id], function (err, results) {
                                if (err) {
                                    console.log('update');
                                    console.log('err :' + err);
                                    res.status(500).send(JSON.stringify({status: 'error'}));
                                } else {
                                    res.send(JSON.stringify({status: 'success', data: response.data.data}));
                                }
                                connection.release();
                            });
                        }
                    }
                });
            }).catch(function (error) {
                console.log('axios');
                console.log(error);
                res.status(500).send(JSON.stringify({status: 'error'}));
            });
        }
    });
});

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
