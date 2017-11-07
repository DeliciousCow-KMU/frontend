var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mysql_dbc = require('../db/db_con')();
var pool = mysql_dbc.init_pool();
var bcrypt = require('bcrypt');
var url = require('url');

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
            if (err)
                throw err;
            else {
                connection.query('select * from `Users` where `id` = ?', generation, function (err, result) {
                    connection.release();
                    if (err) {
                        console.log('err :' + err);
                        return done(false, null);
                    } else {
                        if (result.length === 0) {
                            console.log('해당 유저가 없습니다');
                            return done(false, null);
                        } else {
                            // if (!bcrypt.compareSync(password, result[0].password)) {
                            if(!password == result[0].password) {
                                console.log('패스워드가 일치하지 않습니다');
                                return done(false, null);
                            } else {
                                console.log('로그인 성공');
                                return done(null, {
                                    id: result[0].id,
                                    username: result[0].username,
                                    token: "0000000000",
                                    department: result[0].department
                                });
                            }
                        }
                    }
                });
            }
        });
    }));
}