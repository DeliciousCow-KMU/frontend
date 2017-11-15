var express = require('express');
var router = express.Router();

var passport = require('passport');
var auth = require('../auth/auth-passport');

var mysql_dbc = require('../db/db_con')();
var pool = mysql_dbc.init_pool();

/* GET home page. */
router.get('/', auth.isAuthenticated, function (req, res, next) {
    const datas = [
            {
                title:'학교 공지사항', links: [{url: 'https://naver.com', title: '네이버'}, {url: 'https://daum.net', title: '다음'}, {url: 'https://google.com', title: '구글'}]
            },
            {
                title:'단과대 공지', links: [{url: 'https://naver.com', title: '네이버'}, {url: 'https://daum.net', title: '다음'}, {url: 'https://google.com', title: '구글'}]
            },
            {
                title:'푸쉬 받을 공지사항', links: [{url: 'https://naver.com', title: '네이버'}, {url: 'https://daum.net', title: '다음'}, {url: 'https://google.com', title: '구글'}]
            }
    ];

    pool.getConnection(function(err, connection) {
        if (err)
            throw err;
        else {
            connection.query('select * from `Keywords` where `userid` = ?', req.user.id, function (err, keywords) {
                if (err) {
                    console.log('err :' + err);
                    res.render('index', {title: 'KMULife', navbar: true, auth: req.isAuthenticated(), user: req.user, results: datas, keywords: []});
                } else {
                    if (keywords.length === 0) {
                        console.log('저장된 키워드가 없습니다.');
                        res.render('index', {title: 'KMULife', navbar: true, auth: req.isAuthenticated(), user: req.user, results: datas, keywords: []});

                    } else {
                        console.log(keywords);
                        res.render('index', {title: 'KMULife', navbar: true, auth: req.isAuthenticated(), user: req.user, results: datas, keywords: keywords});
                    }
                }
                connection.release();
            });
        }
    });

    // keywords = [
    //     {id: 0, title: '명월민속관'},
    //     {id: 1, title: '외부'},
    //     {id: 2, title: '홍보'}
    // ]
});

router.get('/need_login', function (req, res, next) {
    res.render('index_need_login', {title: 'KMULife', navbar: true, auth: req.isAuthenticated()});
});

router.get('/login', function (req, res, next) {
    res.render('login', {title: 'Login', navbar: false});
});

router.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/login');
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.redirect('/');
        });
    })(req, res, next);
});

//로그인
router.get('/popup/login', function (req, res, next) {
    res.render('login', {title: 'Login', navbar: false, auth: req.isAuthenticated()});
});

//포스트 로그인
router.post('/popup/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/popup/login');
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.render('refresh');
        });
    })(req, res, next);
});

/*Log out*/
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect(req.headers.referer);
});

router.get('/mypage', auth.isAuthenticated, function (req, res) {
    res.render('mypage', {title: 'mypage', navbar: true, user: req.user, auth: req.isAuthenticated()});
});

module.exports = router;
