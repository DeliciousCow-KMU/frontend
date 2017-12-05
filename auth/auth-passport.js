var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mysql_dbc = require('../db/db_con')();
var pool = mysql_dbc.init_pool();
var bcrypt = require('bcrypt');
var url = require('url');
var axios = require('axios');
axios.defaults.headers.post['Content-Type'] = 'application/json';

var exports = module.exports = {};

exports.isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    else
    if(req.params.repetition >= 1)
        res.render('index_need_login');
    else
        res.render('open_popup');
}

exports.hash = function(data) {
    return bcrypt.hashSync(data, bcrypt.genSaltSync(10));
}

exports.init = function(app) {
    app.use(passport.initialize());
    app.use(passport.session());

    /*로그인 성공시 사용자 정보를 Session에 저장한다*/
    passport.serializeUser(function (user, done) {
        done(null, user)
    });

    /*인증 후, 페이지 접근시 마다 사용자 정보를 Session에서 읽어옴.*/
    passport.deserializeUser(function (user, done) {
        done(null, user);
    });

    passport.use(new LocalStrategy({
        usernameField: 'generation',
        passwordField: 'password',
        passReqToCallback: true //인증을 수행하는 인증 함수로 HTTP request를 그대로  전달할지 여부를 결정한다
    }, function (req, generation, password, done) {
        pool.getConnection(function(err, connection) {
            if (err) {
                throw err;
                return done(false, null);
            } else {
                axios.post('https://1zi1pnd5vb.execute-api.ap-northeast-2.amazonaws.com/dev/auth', {
                    user_id: generation,
                    passwd: password
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function (response) {
                    connection.query('select * from `Users` where `id` = ?', generation, function (err, result) {
                        connection.release();
                        if (err) {
                            console.log('err :' + err);
                            return done(false, null);
                        } else {
                            if (result.length === 0) {
                                //회원가입 처리
                                connection.query('INSERT INTO Users (id, username, college, department) VALUES (?, ?, ?, ?)', [response.data.data.user_id, response.data.data.name, response.data.data.college, response.data.data.department], function (err, results) {
                                    if (err) {
                                        console.log('insert');
                                        console.log('err :' + err);
                                        return done(false, null);
                                    } else {
                                        return done(null, {
                                            id: response.data.data.user_id,
                                            username: response.data.data.name,
                                            department: response.data.data.department,
                                            college: response.data.data.college
                                        });
                                    }
                                    connection.release();
                                });
                            } else {
                                //회원정보 업데이트
                                connection.query('UPDATE Users SET username=?, college=?, department=? where id=?', [response.data.data.name, response.data.data.college, response.data.data.department, response.data.data.user_id], function (err, results) {
                                    if (err) {
                                        console.log('update');
                                        console.log('err :' + err);
                                        return done(false, null);
                                    } else {
                                        return done(null, {
                                            id: response.data.data.user_id,
                                            username: response.data.data.name,
                                            department: response.data.data.department,
                                            college: response.data.data.college
                                        });
                                    }
                                    connection.release();
                                });
                            }
                        }
                    });
                }).catch(function (error) {
                    console.log('axios');
                    console.log(error);
                    return done(false, null);
                });
            }
        });
    }));
}